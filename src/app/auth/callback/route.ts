import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // If no explicit next parameter, determine redirect based on user profile type
      if (!next) {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          console.log('Auth callback - User:', user ? `${user.id} (${user.email})` : 'No user')

          if (user) {
            // Check if user has a profile
            const { data: profile, error: profileQueryError } = await supabase
              .from('profiles')
              .select('profile_type, first_name, last_name')
              .eq('id', user.id)
              .single()

            console.log('Auth callback - Profile query result:', { profile, error: profileQueryError })

            // If profile doesn't exist, create one with default settings
            if (!profile) {
              console.log('Auth callback - Creating new profile for user:', user.id)
              try {
                // Try to call our profile creation API
                const profileCreateResponse = await fetch(`${origin}/api/auth/create-profile`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                  }
                })

                const profileCreateResult = await profileCreateResponse.text()
                console.log('Auth callback - Profile API response:', {
                  status: profileCreateResponse.status,
                  result: profileCreateResult
                })

                if (!profileCreateResponse.ok) {
                  // If API fails, try direct database insert as fallback
                  console.log('Auth callback - API failed, trying direct insert')
                  const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                      id: user.id,
                      email: user.email,
                      profile_type: 'students',
                      first_name: null,
                      last_name: null,
                      username: null,
                      company_name: null,
                      bio: null,
                      avatar_url: null,
                      website: null,
                      updated_at: new Date().toISOString()
                    })
                    .select()

                  console.log('Auth callback - Direct insert result:', { newProfile, error: createError })

                  if (createError) {
                    console.error('Auth callback - Error in direct insert:', createError)
                  }
                }

                // Update user metadata as well
                const { error: updateError } = await supabase.auth.updateUser({
                  data: { profile_type: 'students' }
                })

                console.log('Auth callback - User metadata update result:', { error: updateError })

                if (updateError) {
                  console.error('Auth callback - Error updating user metadata:', updateError)
                }

                // New user with fresh profile - redirect to edit
                next = '/profile/edit'
                console.log('Auth callback - Redirecting new user to:', next)
              } catch (createProfileError) {
                console.error('Auth callback - Exception in profile creation:', createProfileError)
                next = '/profile/edit'
              }
            } else if (!profile.first_name || !profile.last_name) {
              // Profile exists but is incomplete - redirect to edit
              next = '/profile/edit'
              console.log('Auth callback - Incomplete profile, redirecting to:', next)
            } else {
              // User has completed profile, redirect based on type
              if (profile.profile_type === 'company') {
                next = '/company'
              } else {
                next = '/students'
              }
              console.log('Auth callback - Existing user, redirecting to:', next)
            }
          } else {
            next = '/students' // Default fallback
            console.log('Auth callback - No user, redirecting to:', next)
          }
        } catch (profileError) {
          console.error('Auth callback - Error in profile handling:', profileError)
          // If error occurs, assume new user and send to profile edit
          next = '/profile/edit'
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
