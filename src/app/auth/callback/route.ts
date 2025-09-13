import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/students'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // ユーザーのprofile_typeに基づいてリダイレクト先を決定
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && !searchParams.get('next')) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('profile_type')
            .eq('id', user.id)
            .single()
          
          if (profile?.profile_type === 'company') {
            next = '/company'
          } else if (profile?.profile_type === 'students') {
            next = '/students'
          }
        }
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError)
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
