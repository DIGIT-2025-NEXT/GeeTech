export function clearSupabaseCookies() {
  if (typeof window === 'undefined') return;
  
  const cookiesToClear = [
    'sb-access-token',
    'sb-refresh-token', 
    'supabase-auth-token',
    'sb-auth-token',
    // Supabaseの一般的なクッキー名
    `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`
  ];
  
  cookiesToClear.forEach(cookieName => {
    if (cookieName) {
      // パスとドメインを指定してクリア
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    }
  });
  
  // ローカルストレージもクリア
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.warn('Error clearing storage:', error);
  }
}