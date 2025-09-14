'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { logAuthConfig, getGoogleRedirectUri } from '@/utils/auth-helpers'
import { clearSupabaseCookies } from '@/utils/clearSupabaseCookies'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  let supabase: SupabaseClient | null = null
  try {
    supabase = createClient()
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
    // クッキーパースエラーの場合、クッキーをクリアして再試行
    if (err instanceof Error && err.message.includes('cookie')) {
      console.log('Cookie parse error detected, clearing cookies...')
      clearSupabaseCookies()
      try {
        supabase = createClient()
      } catch (retryErr) {
        console.error('Failed to initialize Supabase client after cookie clear:', retryErr)
        setError(retryErr instanceof Error ? retryErr.message : 'Failed to initialize Supabase client')
        setLoading(false)
      }
    } else {
      setError(err instanceof Error ? err.message : 'Failed to initialize Supabase client')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // 開発時に認証設定をログ出力
    logAuthConfig()

    // 初期セッションを取得
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          // クッキーパースエラーの場合、クッキーをクリアして再試行
          if (error.message.includes('cookie') || error.message.includes('parse')) {
            console.log('Session cookie error detected, clearing cookies...')
            clearSupabaseCookies()
            window.location.reload()
            return
          }
          setError(error.message)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Failed to get initial session:', err)
        // クッキー関連のエラーの場合
        if (err instanceof Error && (err.message.includes('cookie') || err.message.includes('parse'))) {
          console.log('Session parsing error detected, clearing cookies...')
          clearSupabaseCookies()
          window.location.reload()
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to get initial session')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null) // 認証状態が変更されたらエラーをクリア

        // ログイン時の自動リダイレクト
        if (event === 'SIGNED_IN' && session?.user && pathname === '/login') {
          try {
            // Check if user has a profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('profile_type, first_name, last_name')
              .eq('id', session.user.id)
              .single()

            // If profile doesn't exist, create one with default settings
            if (!profile) {
              try {
                // Create profile with default profile_type = 'students'
                const { error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
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

                if (createError) {
                  console.error('Error creating profile:', createError)
                }

                // Update user metadata as well
                const { error: updateError } = await supabase.auth.updateUser({
                  data: { profile_type: 'students' }
                })

                if (updateError) {
                  console.error('Error updating user metadata:', updateError)
                }

                // New user with fresh profile - redirect to edit
                router.push('/profile/edit')
              } catch (createProfileError) {
                console.error('Error in profile creation:', createProfileError)
                router.push('/profile/edit')
              }
            } else if (!profile.first_name || !profile.last_name) {
              // Profile exists but is incomplete - redirect to edit
              router.push('/profile/edit')
            } else {
              // User has completed profile, redirect based on type
              if (profile.profile_type === 'company') {
                router.push('/company')
              } else {
                router.push('/students')
              }
            }
          } catch (profileError) {
            console.error('Error fetching user profile for redirect:', profileError)
            // If error occurs, assume new user and send to profile edit
            router.push('/profile/edit')
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router, pathname])

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase client not initialized' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            profile_type: 'students',
          },
        },
      })

      // デバッグ用ログ
      console.log('Sign up result:', { data, error })

      return { error: error?.message || null }
    } catch (err) {
      console.error('Sign up error:', err)
      return { error: err instanceof Error ? err.message : 'Sign up failed' }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase client not initialized' }
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error: error?.message || null }
    } catch (err) {
      console.error('Sign in error:', err)
      return { error: err instanceof Error ? err.message : 'Sign in failed' }
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      return { error: 'Supabase client not initialized' }
    }
    
    const redirectUri = getGoogleRedirectUri()
    if (!redirectUri) {
      return { 
        error: 'SupabaseプロジェクトIDが正しく設定されていません。環境変数 NEXT_PUBLIC_SUPABASE_URL を確認してください。'
      }
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      return { error: error?.message || null }
    } catch (err) {
      console.error('Google sign in error:', err)
      return { error: err instanceof Error ? err.message : 'Google sign in failed' }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      return
    }
    
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}