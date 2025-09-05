# エラートラブルシューティングガイド

## "requested path is invalid" エラーの解決方法

### エラーの原因

このエラーは通常、以下の原因で発生します：

1. **環境変数の設定ミス**
   - `NEXT_PUBLIC_SUPABASE_URL` が正しく設定されていない
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しく設定されていない

2. **URL形式の間違い**
   - SupabaseのURLが正しい形式でない
   - HTTPSプロトコルが使用されていない

3. **Supabaseプロジェクトの設定問題**
   - プロジェクトが存在しない
   - APIキーが無効

### 解決手順

#### 1. 環境変数の確認

`.env.local` ファイルが正しく設定されているか確認：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```

#### 2. URL形式の確認

正しいURL形式：
- ✅ `https://tzsbxafggyykmfopjcdv.supabase.co`
- ❌ `http://tzsbxafggyykmfopjcdv.supabase.co` (HTTPは不可)
- ❌ `tzsbxafggyykmfopjcdv.supabase.co` (プロトコルなし)
- ❌ `https://supabase.com/dashboard/project/...` (ダッシュボードURL)

#### 3. Supabaseプロジェクトの確認

1. Supabaseダッシュボードにログイン
2. プロジェクトが存在するか確認
3. **Settings > API** で正しいURLとAPIキーを確認

#### 4. 開発者ツールでの確認

1. ブラウザの開発者ツールを開く
2. コンソールタブでエラーメッセージを確認
3. 認証設定のデバッグ情報を確認

### 実装された改善点

#### 1. 詳細なエラーハンドリング

- Supabaseクライアントの初期化エラーをキャッチ
- URL形式の検証を強化
- より具体的なエラーメッセージを表示

#### 2. 認証コンテキストの改善

- エラー状態の管理を追加
- 各認証メソッドにエラーハンドリングを追加
- 初期化失敗時の適切な処理

#### 3. UIでのエラー表示

- 認証エラーをユーザーに表示
- 環境変数の設定方法を案内
- デバッグ情報の表示（開発環境のみ）

### よくある問題と解決方法

#### 問題1: 環境変数が読み込まれない

**解決方法:**
1. `.env.local` ファイルがプロジェクトルートにあるか確認
2. ファイル名が正確か確認（`.env.local`）
3. 開発サーバーを再起動

#### 問題2: URL形式エラー

**解決方法:**
1. Supabaseダッシュボードで正しいURLをコピー
2. `https://` で始まっているか確認
3. `.supabase.co` で終わっているか確認

#### 問題3: APIキーエラー

**解決方法:**
1. Supabaseダッシュボードで新しいAPIキーを生成
2. `anon public` キーを使用
3. キーが完全にコピーされているか確認

### デバッグ機能

開発環境では以下のデバッグ機能が利用できます：

1. **認証設定の自動検証**
2. **プロジェクトIDの自動抽出**
3. **リダイレクトURIの自動生成**
4. **詳細なエラーメッセージ**

### 次のステップ

エラーが解決しない場合：

1. Supabaseプロジェクトを再作成
2. 環境変数を再設定
3. 開発サーバーを再起動
4. ブラウザのキャッシュをクリア
