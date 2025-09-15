-- 企業プロフィール用のcompanyテーブルを作成

CREATE TABLE company (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  industry text,
  description text,
  features text[] DEFAULT '{}',
  logo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- インデックスの作成
CREATE INDEX ON company (user_id);
CREATE INDEX ON company (created_at);

-- RLSポリシーの設定
ALTER TABLE company ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の企業プロフィールのみアクセス可能
CREATE POLICY "Users can access their own company profile" ON company
  FOR ALL USING (auth.uid() = user_id);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_updated_at BEFORE UPDATE ON company
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
