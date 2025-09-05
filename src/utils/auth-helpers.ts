/**
 * Supabase認証のヘルパー関数
 */

/**
 * SupabaseプロジェクトIDを取得
 */
export function getSupabaseProjectId(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    const match = hostname.match(/^([^.]+)\.supabase\.co$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/**
 * 正しいGoogle OAuthリダイレクトURIを生成
 */
export function getGoogleRedirectUri(): string | null {
  const projectId = getSupabaseProjectId()
  if (!projectId) return null
  
  return `https://${projectId}.supabase.co/auth/v1/callback`
}

/**
 * 現在の環境変数設定を検証
 */
export function validateAuthConfig(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  projectId: string | null
  redirectUri: string | null
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Supabase URLの検証
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL が設定されていません')
  } else {
    try {
      const url = new URL(supabaseUrl)
      if (!url.hostname.endsWith('.supabase.co')) {
        errors.push('NEXT_PUBLIC_SUPABASE_URL の形式が正しくありません。https://your-project-id.supabase.co の形式で設定してください')
      }
    } catch {
      errors.push('NEXT_PUBLIC_SUPABASE_URL が有効なURLではありません')
    }
  }
  
  // Supabase Anon Keyの検証
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseAnonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません')
  } else if (!supabaseAnonKey.startsWith('eyJ')) {
    warnings.push('NEXT_PUBLIC_SUPABASE_ANON_KEY の形式が正しくない可能性があります')
  }
  
  const projectId = getSupabaseProjectId()
  const redirectUri = getGoogleRedirectUri()
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    projectId,
    redirectUri
  }
}

/**
 * 設定情報をコンソールに出力（開発時のみ）
 */
export function logAuthConfig(): void {
  if (process.env.NODE_ENV !== 'development') return
  
  const config = validateAuthConfig()
  
  console.group('🔐 Supabase認証設定')
  console.log('プロジェクトID:', config.projectId || '未設定')
  console.log('リダイレクトURI:', config.redirectUri || '未設定')
  
  if (config.errors.length > 0) {
    console.group('❌ エラー')
    config.errors.forEach(error => console.error(error))
    console.groupEnd()
  }
  
  if (config.warnings.length > 0) {
    console.group('⚠️ 警告')
    config.warnings.forEach(warning => console.warn(warning))
    console.groupEnd()
  }
  
  if (config.isValid) {
    console.log('✅ 設定は正常です')
  }
  
  console.groupEnd()
}
