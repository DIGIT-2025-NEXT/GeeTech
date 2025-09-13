// scripts/seed-projects.js - データベースにプロジェクトデータを追加するスクリプト
const { createClient } = require('@supabase/supabase-js');

// 環境変数を使用（実際のプロジェクトのキーに置き換えてください）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const projects = [
  {
    company_id: "1",
    title: "地域密着型マーケティングアシスタント",
    description: "SNS運用、イベント企画などを通じて、私たちのサービスを地域に広めるお手伝いをしてください。実践的なマーケティングスキルが身につきます。",
    skills: ["マーケティング", "SNS運用", "企画"],
    status: "active"
  },
  {
    company_id: "2",
    title: "UI/UXデザインインターン",
    description: "製造業向けSaaSのユーザーインターフェース改善に取り組んでいただきます。実際のプロダクトに携われる貴重な経験です。",
    skills: ["UI/UX", "Figma", "プロトタイピング"],
    status: "active"
  },
  {
    company_id: "3",
    title: "環境データ分析プロジェクト",
    description: "再生可能エネルギーの効率化に向けたデータ分析業務。Pythonを使った実践的なデータサイエンス経験が積めます。",
    skills: ["Python", "データ分析", "環境工学"],
    status: "active"
  }
];

async function seedProjects() {
  console.log('プロジェクトデータの追加を開始します...');
  
  for (const project of projects) {
    const { data, error } = await supabase
      .from('project')
      .insert(project);
    
    if (error) {
      console.error('プロジェクトの追加に失敗:', error);
    } else {
      console.log(`プロジェクト "${project.title}" を追加しました`);
    }
  }
  
  console.log('プロジェクトデータの追加が完了しました');
}

seedProjects();