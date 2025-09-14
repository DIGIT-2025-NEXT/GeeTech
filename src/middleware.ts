import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type PathType = "public" | "auth_required" | "protected";
type ProfileType = "students" | "company" | "admin";

interface RouteConfig {
  paths: string[];
  type: PathType;
}


// ルート設定 - 管理しやすい単一箇所での定義
const ROUTE_CONFIG: RouteConfig[] = [
  {
    paths: [
      "/",
      "/auth",
      "/debug",
      "/profile-quick-setup",
      "/middleware-test",
      "/test-access",
      "/students",
      "/companies/*",
    ],
    type: "public",
  },
  {
    paths: ["/dashboard", "/profile", "/chat"],
    type: "auth_required",
  },
  {
    paths: ["/company", "/admin", "/student/*"],
    type: "protected",
  },
];

/**
 * パスのタイプを取得
 */
function getPathType(pathname: string): PathType {
  for (const config of ROUTE_CONFIG) {
    const isMatch = config.paths.some(path => {
      if (path.endsWith("/*")) {
        // /companies/* のような1階層の動的パス
        const basePath = path.slice(0, -2);
        return pathname.startsWith(`${basePath}/`) &&
               !pathname.slice(basePath.length + 1).includes('/');
      } else {
        // 完全一致または配下のパス
        return pathname === path || pathname.startsWith(`${path}/`);
      }
    });
    if (isMatch) return config.type;
  }
  return "public";
}

/**
 * プロファイルタイプに基づくアクセスチェック（シンプルなif文ベース）
 */
function hasAccess(pathname: string, profileType: ProfileType): boolean {
  console.log(`[hasAccess] Checking ${profileType} access to ${pathname}`);

  // 管理者は全てアクセス可能
  if (profileType === "admin") {
    console.log(`[hasAccess] Admin - access granted`);
    return true;
  }

  // 企業は/admin以外なら全てアクセス可能
  if (profileType === "company") {
    if (pathname.startsWith("/admin")) {
      console.log(`[hasAccess] Company blocked from admin area`);
      return false;
    }
    console.log(`[hasAccess] Company - access granted`);
    return true;
  }

  // 学生の場合
  if (profileType === "students") {
    // 管理者エリアはNG
    if (pathname.startsWith("/admin")) {
      console.log(`[hasAccess] Students blocked from admin area`);
      return false;
    }

    // /company配下は全てNG（企業管理系）
    if (pathname.startsWith("/company")) {
      console.log(`[hasAccess] Students blocked from company area`);
      return false;
    }

    // /student/[id]（他人の個人情報）はNG
    if (pathname.match(/^\/student\/[^\/]+$/)) {
      console.log(`[hasAccess] Students blocked from student details`);
      return false;
    }

    console.log(`[hasAccess] Students - access granted`);
    return true;
  }

  console.log(`[hasAccess] Unknown profile type - access denied`);
  return false;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 静的ファイル、API routes、Next.js内部パスをスキップ
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

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
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathType = getPathType(pathname);
  console.log(`[Middleware] Path: ${pathname}, PathType: ${pathType}, HasUser: ${!!user}`);

  // 公開パスは認証不要
  if (pathType === "public") {
    console.log(`[Middleware] Public path, allowing access`);
    return supabaseResponse;
  }

  // 認証が必要なパスで未認証の場合
  if ((pathType === "auth_required" || pathType === "protected") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 保護されたパスの権限チェック
  if (pathType === "protected" && user) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("profile_type")
        .eq("id", user.id)
        .single();

      // プロファイルエラーまたはプロファイルタイプなしの場合
      if (profileError?.code === "PGRST116" || !profile?.profile_type) {
        const url = request.nextUrl.clone();
        url.pathname = "/profile";
        return NextResponse.redirect(url);
      }

      // アクセス権限チェック
      console.log(`[Middleware] Checking access for ${profile.profile_type} to ${pathname}`);
      if (!hasAccess(pathname, profile.profile_type as ProfileType)) {
        console.log(`[Middleware] ACCESS DENIED`);
        return createAccessDeniedResponse(pathname, profile.profile_type);
      }
      console.log(`[Middleware] ACCESS GRANTED`);
    } catch (error) {
      console.error("[Middleware] Profile check error:", error);
      const url = request.nextUrl.clone();
      url.pathname = "/profile-quick-setup";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

/**
 * アクセス拒否レスポンスを作成
 */
function createAccessDeniedResponse(pathname: string, profileType?: string) {
  const isApiRequest = pathname.startsWith("/api/");

  if (isApiRequest) {
    return new NextResponse(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

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
            profileType || "Unknown"
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
