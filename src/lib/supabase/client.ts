import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
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
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw new Error(`Failed to create Supabase client. Please check your environment variables.`)
  }
}