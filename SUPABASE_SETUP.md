# Supabase認証設定ガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下を取得：
   - Project URL
   - API Key (anon/public)

## 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を追加：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2.1 URL形式の注意点

⚠️ **重要**: `NEXT_PUBLIC_SUPABASE_URL` は必ず以下の形式で設定してください：

- ✅ **正しい形式**: `https://tzsbxafggyykmfopjcdv.supabase.co`
- ❌ **間違った形式**: `supabase.com/dashboard/project/tzsbxafggyykmfopjcdv/settings/general/`

### 2.2 設定値の取得方法

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. **Settings > API** に移動
4. 以下の値をコピー：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: API Key

### 2.3 設定例

```env
NEXT_PUBLIC_SUPABASE_URL=https://tzsbxafggyykmfopjcdv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6c2J4YWZnZ3l5a21mb3BqY2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.example
```

## 3. Supabase認証設定

Supabaseダッシュボードで以下を設定：

### 3.1 基本設定
1. **Authentication > Settings** に移動
2. **Site URL** を設定（開発時は `http://localhost:3000`）
3. **Redirect URLs** に以下を追加：
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`

### 3.2 Email認証の設定
1. **Authentication > Settings > Auth Providers** で **Email** を有効化
2. **Email confirmation** を有効化（推奨）

### 3.3 Google認証の設定

#### 3.3.1 Google Cloud Consoleでの設定

1. **Google Cloud Console** (https://console.cloud.google.com/) にアクセス
2. プロジェクトを選択または作成
3. **APIs & Services > Credentials** に移動
4. **Create Credentials > OAuth 2.0 Client IDs** を選択
5. **Application type** で **Web application** を選択
6. **Authorized redirect URIs** に以下を追加：
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
   ⚠️ **重要**: `your-project-id` を実際のSupabaseプロジェクトIDに置き換えてください

#### 3.3.2 Supabaseでの設定

1. **Authentication > Settings > Auth Providers** で **Google** を有効化
2. Google Cloud Consoleで取得した **Client ID** と **Client Secret** を入力
3. **Save** をクリック

#### 3.3.3 リダイレクトURIの例

プロジェクトIDが `tzsbxafggyykmfopjcdv` の場合：
```
https://tzsbxafggyykmfopjcdv.supabase.co/auth/v1/callback
```

#### 3.3.4 よくあるエラーと解決方法

**エラー**: `redirect_uri_mismatch`
**原因**: Google Cloud ConsoleのリダイレクトURIがSupabaseのURIと一致していない
**解決方法**: 
1. Google Cloud Consoleで正しいリダイレクトURIを設定
2. SupabaseプロジェクトIDを確認
3. 設定を保存して数分待つ

**詳細な修正手順**:
1. **SupabaseプロジェクトIDの確認**:
   - Supabaseダッシュボード > Settings > General
   - Project URL: `https://YOUR_PROJECT_ID.supabase.co`

2. **Google Cloud Consoleでの設定**:
   - APIs & Services > Credentials
   - OAuth 2.0クライアントIDを選択
   - Authorized redirect URIs に追加: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

3. **設定の確認**:
   - 開発者ツールのコンソールで認証設定がログ出力されます
   - プロジェクトIDとリダイレクトURIを確認してください

## 4. アプリケーションの起動

```bash
npm run dev
```

## 機能

- ✅ **Email認証** - メール・パスワードでの登録・ログイン
- ✅ **Google認証** - GoogleアカウントでのOAuth認証
- ✅ **ユーザープロフィール** - ユーザー情報の表示
- ✅ **認証状態管理** - リアルタイム認証状態の管理
- ✅ **自動リダイレクト** - 認証状態に応じた自動遷移
- ✅ **Material-UI** - 美しいUIコンポーネント
- ✅ **レスポンシブデザイン** - モバイル対応

## ファイル構成

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx        # ログイン・登録ページ
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts        # OAuth認証コールバック
│   │   └── auth-code-error/
│   │       └── page.tsx        # 認証エラーページ
│   ├── events/
│   │   └── page.tsx            # ダッシュボード（認証後）
│   ├── layout.tsx              # 認証プロバイダーの統合
│   └── page.tsx                # メインページ（リダイレクト）
├── contexts/
│   └── AuthContext.tsx         # 認証コンテキスト
└── lib/
    └── supabase/
        ├── client.ts           # ブラウザ用クライアント
        └── server.ts           # サーバー用クライアント
```

## 使用方法

1. **新規登録**: `/login` ページで「新規登録」を選択
2. **ログイン**: `/login` ページでメール・パスワードまたはGoogleでログイン
3. **ダッシュボード**: 認証後は `/events` ページに自動遷移
4. **ログアウト**: ダッシュボードの「ログアウト」ボタンでログアウト
