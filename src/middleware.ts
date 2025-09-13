import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// アクセス制御が必要なパスを定義
const PROTECTED_PATHS = ["/company", "/students", "/admin"];

// 認証が必要だが、profile_typeに基づくアクセス制御は不要なパス
const AUTH_REQUIRED_PATHS = ["/dashboard", "/profile", "/chat"];

// 公開パス（認証不要）
const PUBLIC_PATHS = [
  "/",
  "/auth",
  "/debug",
  "/profile-quick-setup",
  "/middleware-test",
  "/test-access",
];

/**
 * パスがアクセス制御の対象かどうかを判定
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * パスが認証必須かどうかを判定
 */
function isAuthRequiredPath(pathname: string): boolean {
  return (
    AUTH_REQUIRED_PATHS.some((path) => pathname.startsWith(path)) ||
    isProtectedPath(pathname)
  );
}

/**
 * パスが公開パスかどうかを判定
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * profileタイプに基づくアクセスチェック
 */
function checkPathAccess(
  pathname: string,
  profileType: string | null
): boolean {
  console.log(`[Access Check] Path: ${pathname}, Profile: ${profileType}`);

  if (!profileType) {
    console.log(`[Access Check] No profile type - access denied`);
    return false;
  }

  // /students/[studentId] のような動的パスを識別するための正規表現
  const studentDetailPathRegex = /^\/students\/[^/]+$/;
  // /company/[companyId] のような動的パスを識別するための正規表現
  const companyDetailPathRegex = /^\/company\/[^/]+$/;

  // students ロールの場合のアクセス制御
  if (profileType === "students") {
    if (pathname === "/students") {
      console.log(`[Access Check] Students access to /students granted`);
      return true;
    }
    if (pathname === "/company") {
      console.log(`[Access Check] Students blocked from /company granted`);
      return false;
    }
    if (pathname === "/company/register") {
      console.log(`[Access Check] Students blocked from /company granted`);
      return false;
    }
    if (studentDetailPathRegex.test(pathname)) {
      console.log(`[Access Check] Students blocked from /students/[studentId]`);
      return false;
    }
    if (companyDetailPathRegex.test(pathname)) {
      console.log(
        `[Access Check] Students access to /company/[companyId] granted`
      );
      return true;
    }
    if (pathname === "/company") {
      console.log(`[Access Check] Students blocked from /company`);
      return false;
    }
    console.log(`[Access Check] Students default access granted for: ${pathname}`);
    return true;
  }

  // company ロールの場合のアクセス制御
  if (profileType === "company") {
    // 企業ユーザーは /company/* パスにアクセス可能
    if (pathname.startsWith("/company")) {
      console.log(`[Access Check] Company access to ${pathname} granted`);
      return true;
    }
    if (pathname === "/students") {
      console.log(`[Access Check] Company blocked from /students`);
      return false;
    }
    if (companyDetailPathRegex.test(pathname)) {
      console.log(`[Access Check] Company blocked from /company/[companyId]`);
      return false;
    }
    if (studentDetailPathRegex.test(pathname)) {
      console.log(
        `[Access Check] Company access to /students/[studentId] granted`
      );
      return true;
    }
    console.log(`[Access Check] Company default access granted for: ${pathname}`);
    return true;
  }

  if (profileType === "admin") {
    console.log(`[Access Check] Admin access granted`);
    return true;
  }

  // 管理者パスは管理者のみアクセス可能
  if (pathname.startsWith("/admin")) {
    console.log(`[Access Check] Non-admin blocked from admin path: ${pathname}`);
    return false;
  }

  console.log(`[Access Check] Default access granted`);
  return true;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log(`[Middleware] 🔍 Processing: ${pathname}`);

  // 静的ファイル、API routes、Next.js内部パスをスキップ
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    console.log(`[Middleware] ⏭️ Skipping static/api: ${pathname}`);
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(`[Middleware] 🔐 User status:`, {
    hasUser: !!user,
    userId: user?.id,
  });

  // 公開パスは認証不要
  if (isPublicPath(pathname)) {
    console.log(`[Middleware] 🌐 Public path: ${pathname}`);
    return supabaseResponse;
  }

  // 認証が必要なパスで未認証の場合
  if (isAuthRequiredPath(pathname) && !user) {
    console.log(`[Middleware] 🚫 Unauthenticated access to: ${pathname}`);
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 認証済みユーザーの保護されたパスチェック
  if (isProtectedPath(pathname) && user) {
    console.log(`[Middleware] 🔒 Checking protected path: ${pathname}`);

    try {
      // プロファイル取得
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("profile_type")
        .eq("id", user.id)
        .single();

      console.log(`[Middleware] 👤 Profile data:`, {
        userId: user.id,
        profileType: profile?.profile_type,
        profileError: profileError?.message,
      });

      if (profileError) {
        console.log(`[Middleware] ❌ Profile error: ${profileError.message}`);
        // プロファイルが見つからない場合（PGRST116エラー）はプロファイル設定へ
        if (profileError.code === 'PGRST116') {
          const url = request.nextUrl.clone();
          url.pathname = "/profile";
          return NextResponse.redirect(url);
        }
        // その他のエラーの場合は一時的にアクセスを許可してログを出力
        console.log(`[Middleware] ⚠️ Profile error but allowing access: ${profileError.message}`);
      }

      // プロファイルタイプがnullの場合はプロファイル設定へリダイレクト
      if (!profile?.profile_type) {
        console.log(`[Middleware] ⚠️ Profile type is null/undefined, redirecting to profile setup`);
        const url = request.nextUrl.clone();
        url.pathname = "/profile";
        return NextResponse.redirect(url);
      }

      // アクセス制御チェック
      const hasAccess = checkPathAccess(
        pathname,
        profile.profile_type
      );

      if (!hasAccess) {
        console.log(
          `[Middleware] 🚨 Access DENIED for ${profile?.profile_type} to ${pathname}`
        );

        // APIリクエストの場合はJSON、通常のページリクエストの場合はHTMLを返す
        const isApiRequest = pathname.startsWith("/api/");

        if (isApiRequest) {
          return new NextResponse(
            JSON.stringify({ error: "Insufficient permissions" }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          // ページリクエストの場合は403エラーページを表示
          const errorHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Access Denied - 403</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { 
                    font-family: system-ui, -apple-system, sans-serif;
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh; 
                    margin: 0; 
                    background-color: #f3f4f6;
                    color: #374151;
                  }
                  .container { 
                    text-align: center; 
                    max-width: 500px;
                    padding: 2rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  }
                  h1 { 
                    color: #dc2626; 
                    margin-bottom: 1rem;
                    font-size: 2rem;
                  }
                  p { 
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                  }
                  .back-button {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: #3b82f6;
                    color: white;
                    text-decoration: none;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    transition: background-color 0.2s;
                  }
                  .back-button:hover {
                    background-color: #2563eb;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>403 - Access Denied</h1>
                  <p>このページにアクセスする権限がありません。</p>
                  <p>プロファイルタイプ: <strong>${
                    profile?.profile_type || "Unknown"
                  }</strong></p>
                  <a href="/dashboard" class="back-button">ダッシュボードに戻る</a>
                </div>
              </body>
            </html>
          `;

          return new NextResponse(errorHtml, {
            status: 403,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }
      }

      console.log(
        `[Middleware] ✅ Access GRANTED for ${profile?.profile_type} to ${pathname}`
      );
    } catch (error) {
      console.error(`[Middleware] 💥 Error checking profile:`, error);
      // エラーの場合はプロファイル設定ページへ
      const url = request.nextUrl.clone();
      url.pathname = "/profile-quick-setup";
      return NextResponse.redirect(url);
    }
  }

  console.log(`[Middleware] ✅ Request allowed: ${pathname}`);
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (apple-touch-icon, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
