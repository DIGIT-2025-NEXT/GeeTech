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
          if (user) {
            // Check user's profile type from user metadata or profile table
            const profileType = user.user_metadata?.profile_type

            if (profileType === 'company') {
              next = '/company'
            } else if (profileType === 'students') {
              next = '/students'
            } else {
              // Default fallback - try to get from profile table if not in metadata
              const { data: profile } = await supabase
                .from('profiles')
                .select('profile_type')
                .eq('id', user.id)
                .single()

              if (profile?.profile_type === 'company') {
                next = '/company'
              } else {
                next = '/students' // Default to students page
              }
            }
          } else {
            next = '/students' // Default fallback
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError)
          next = '/students' // Default fallback on error
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
