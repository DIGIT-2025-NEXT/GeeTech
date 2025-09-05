# Google OAuth redirect_uri_mismatch エラー修正ガイド

## エラーの原因
`redirect_uri_mismatch`エラーは、Google Cloud Consoleで設定したリダイレクトURIとSupabaseが使用するURIが一致していないことが原因です。

## 解決手順

### ステップ1: SupabaseプロジェクトIDの確認

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. **Settings > General** に移動
4. **Project URL** を確認（例: `https://tzsbxafggyykmfopjcdv.supabase.co`）
5. プロジェクトIDをメモ（例: `tzsbxafggyykmfopjcdv`）

### ステップ2: Google Cloud Consoleでの設定

#### 2.1 OAuth同意画面の設定（初回のみ）

1. **Google Cloud Console** (https://console.cloud.google.com/) にアクセス
2. プロジェクトを選択
3. **APIs & Services > OAuth consent screen** に移動
4. **User Type** で **External** を選択（個人開発の場合）
5. 必要な情報を入力：
   - **App name**: アプリケーション名
   - **User support email**: サポートメール
   - **Developer contact information**: 開発者連絡先
6. **Save and Continue** をクリック
7. **Scopes** で **Add or Remove Scopes** をクリック
8. 以下のスコープを追加：
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
9. **Save and Continue** をクリック
10. **Test users** でテストユーザーを追加（必要に応じて）
11. **Save and Continue** をクリック

#### 2.2 OAuth 2.0クライアントIDの作成

1. **APIs & Services > Credentials** に移動
2. **Create Credentials > OAuth 2.0 Client IDs** を選択
3. **Application type** で **Web application** を選択
4. **Name** にクライアント名を入力
5. **Authorized redirect URIs** に以下を追加：

```
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

**例**: プロジェクトIDが `tzsbxafggyykmfopjcdv` の場合
```
https://tzsbxafggyykmfopjcdv.supabase.co/auth/v1/callback
```

6. **Create** をクリック
7. **Client ID** と **Client Secret** をコピーして保存

### ステップ3: 設定の保存と確認

1. **Save** をクリック
2. 数分待つ（設定の反映に時間がかかる場合があります）
3. SupabaseダッシュボードでGoogle認証が有効になっていることを確認

### ステップ4: テスト

1. アプリケーションでGoogleログインを試す
2. エラーが解決されていることを確認

## よくある間違い

❌ **間違ったリダイレクトURI**:
- `http://localhost:3000/auth/callback`
- `https://your-domain.com/auth/callback`
- `https://supabase.com/auth/callback`

✅ **正しいリダイレクトURI**:
- `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

## トラブルシューティング

### エラーが続く場合

1. **プロジェクトIDの確認**: Supabaseダッシュボードで正しいプロジェクトIDを確認
2. **設定の反映待ち**: Google Cloud Consoleの設定変更は数分かかる場合があります
3. **キャッシュのクリア**: ブラウザのキャッシュをクリアして再試行
4. **OAuth同意画面の設定**: Google Cloud ConsoleでOAuth同意画面が正しく設定されているか確認

### 追加の設定確認

1. **OAuth同意画面**:
   - Google Cloud Console > APIs & Services > OAuth consent screen
   - アプリケーション名、ユーザーサポートメール、開発者連絡先情報を設定

2. **必要なスコープ**:
   - `openid`
   - `email`
   - `profile`

## 設定例

### Supabaseプロジェクト情報
- **Project URL**: `https://tzsbxafggyykmfopjcdv.supabase.co`
- **Project ID**: `tzsbxafggyykmfopjcdv`

### Google Cloud Console設定
- **Authorized redirect URIs**: `https://tzsbxafggyykmfopjcdv.supabase.co/auth/v1/callback`
