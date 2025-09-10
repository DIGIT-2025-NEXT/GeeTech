'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { logAuthConfig, getGoogleRedirectUri } from '@/utils/auth-helpers'
import { Database } from '@/lib/types_db'

// Contextの型からsupabaseを削除
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
  
  const supabase = useSupabaseClient<Database>()

  useEffect(() => {
    if (!supabase) return

    logAuthConfig()

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Failed to get initial session:', err)
        setError(err instanceof Error ? err.message : 'Failed to get initial session')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase client not initialized' }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            profile_type: 'students',
          },
        },
      })
      return { error: error?.message || null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign up failed' }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase client not initialized' }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message || null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign in failed' }
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) return { error: 'Supabase client not initialized' }
    const redirectUri = getGoogleRedirectUri()
    if (!redirectUri) {
      return { 
        error: 'SupabaseプロジェクトIDが正しく設定されていません。環境変数 NEXT_PUBLIC_SUPABASE_URL を確認してください。'
      }
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      return { error: error?.message || null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Google sign in failed' }
    }
  }

  const signOut = async () => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  // valueからsupabaseを削除
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