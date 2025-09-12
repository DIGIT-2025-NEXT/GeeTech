import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  // シングルトンパターンで既存のインスタンスがあれば再利用
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  // URLの形式を検証
  try {
    const url = new URL(supabaseUrl)
    
    // SupabaseのURL形式を検証
    if (!url.hostname.endsWith('.supabase.co')) {
      throw new Error(`Invalid Supabase URL format. Expected: https://your-project-id.supabase.co, got: ${supabaseUrl}`)
    }
    
    // プロトコルを検証
    if (url.protocol !== 'https:') {
      throw new Error(`Supabase URL must use HTTPS. Expected: https://your-project-id.supabase.co, got: ${supabaseUrl}`)
    }
    
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}. Expected format: https://your-project-id.supabase.co`)
  }

  try {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          if (typeof window === 'undefined') return undefined
          const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`))
            ?.split('=')[1]
          return value ? decodeURIComponent(value) : undefined
        },
        set(name, value, options) {
          if (typeof window === 'undefined') return
          const expires = options?.maxAge ? new Date(Date.now() + options.maxAge * 1000).toUTCString() : ''
          document.cookie = `${name}=${encodeURIComponent(value)}; ${expires ? `expires=${expires}; ` : ''}path=${options?.path || '/'}; ${options?.domain ? `domain=${options.domain}; ` : ''}${options?.secure ? 'secure; ' : ''}${options?.httpOnly ? 'httponly; ' : ''}${options?.sameSite ? `samesite=${options.sameSite}; ` : ''}`
        },
        remove(name, options) {
          if (typeof window === 'undefined') return
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${options?.path || '/'}; ${options?.domain ? `domain=${options.domain}; ` : ''}`
        }
      }
    })
    return supabaseInstance
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw new Error(`Failed to create Supabase client. Please check your environment variables.`)
  }
}