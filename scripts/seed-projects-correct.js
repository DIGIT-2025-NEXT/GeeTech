// scripts/seed-projects-correct.js - 正しい企業IDでプロジェクトデータを追加するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 実際のUUIDを使用したプロジェクト
const projects = [
  {
    company_id: "47b78e6b-0123-43cc-a23d-5785ebf2f370", // テックイノベーターズ株式会社
    title: "フルスタックWebアプリケーション開発インターン",
    description: "React/Next.jsとNode.jsを使用したWebアプリケーション開発に取り組んでいただきます。実際のプロダクト開発に携わる貴重な経験です。",
    skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    status: "active"
  },
  {
    company_id: "47b78e6b-0123-43cc-a23d-5785ebf2f370", // テックイノベーターズ株式会社
    title: "UI/UXデザインプロジェクト",
    description: "ユーザー体験を重視したデザイン改善プロジェクト。Figmaを使用してプロトタイプ作成から実装まで幅広く経験できます。",
    skills: ["Figma", "UI/UX", "プロトタイピング", "デザインシステム"],
    status: "active"
  },
  {
    company_id: "3969d87c-d6ef-4628-8c20-f044ff65455b", // ヘルステックパイオニアーズ
    title: "ヘルスケアデータ分析プロジェクト", 
    description: "医療データを活用したAI診断支援システムの開発に参画。Pythonを使った機械学習モデルの構築と検証を行います。",
    skills: ["Python", "機械学習", "データ分析", "TensorFlow", "Pandas"],
    status: "active"
  },
  {
    company_id: "3969d87c-d6ef-4628-8c20-f044ff65455b", // ヘルステックパイオニアーズ
    title: "患者管理システムのUI改善",
    description: "医療従事者が使いやすい患者管理システムのインターフェース設計・改善。ユーザビリティテストから改善提案まで。",
    skills: ["UI/UX", "リサーチ", "プロトタイピング", "医療IT"],
    status: "active"
  },
  {
    company_id: "3db595ce-e3ae-4f06-993b-ddd6d1735313", // グリーンエネルギーソリューションズ
    title: "再生可能エネルギー効率化アプリ開発",
    description: "太陽光発電システムの効率を監視・分析するWebアプリケーション開発。IoTデータの可視化とレポート機能の実装。",
    skills: ["React", "データ可視化", "IoT", "環境技術", "JavaScript"],
    status: "active"
  },
  {
    company_id: "3db595ce-e3ae-4f06-993b-ddd6d1735313", // グリーンエネルギーソリューションズ
    title: "環境データ分析・予測モデル開発",
    description: "気象データと発電量データを活用した予測モデル開発。Pythonを使った機械学習による発電量予測システムの構築。",
    skills: ["Python", "機械学習", "データサイエンス", "統計解析", "環境工学"],
    status: "active"
  },
  {
    company_id: "4e0ca671-f165-47b6-aee6-0b777069525b", // DOKKIITECH
    title: "モバイルアプリUI/UX改善プロジェクト",
    description: "既存モバイルアプリのユーザビリティ向上とデザインリニューアル。ユーザーテストから改善提案、実装まで一貫して担当。",
    skills: ["モバイルUI", "UX調査", "Figma", "プロトタイピング", "React Native"],
    status: "active"
  },
  {
    company_id: "4e0ca671-f165-47b6-aee6-0b777069525b", // DOKKIITECH
    title: "AIチャットボット開発インターン",
    description: "顧客サポート向けAIチャットボットの開発・改善。自然言語処理とAPI連携を活用したインタラクティブなサービス開発。",
    skills: ["AI", "自然言語処理", "Python", "API開発", "チャットボット"],
    status: "active"
  }
];

async function seedProjectsWithCorrectIds() {
  console.log('正しい企業IDでプロジェクトデータの追加を開始します...');
  
  // まず既存のプロジェクトを削除
  const { error: deleteError } = await supabase
    .from('project')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // すべて削除
  
  if (deleteError) {
    console.error('既存プロジェクトの削除に失敗:', deleteError);
  } else {
    console.log('既存のプロジェクトデータを削除しました');
  }
  
  // 新しいプロジェクトを追加
  for (const project of projects) {
    const { data, error } = await supabase
      .from('project')
      .insert(project)
      .select();
    
    if (error) {
      console.error('プロジェクトの追加に失敗:', error);
    } else {
      console.log(`プロジェクト "${project.title}" を企業ID ${project.company_id} に追加しました`);
    }
  }
  
  console.log('プロジェクトデータの追加が完了しました');
  
  // 結果を確認
  const { data: finalProjects } = await supabase
    .from('project')
    .select('id, company_id, title')
    .order('company_id');
    
  console.log('\n=== 追加されたプロジェクト一覧 ===');
  finalProjects?.forEach(project => {
    console.log(`- ${project.title} (企業ID: ${project.company_id})`);
  });
}

seedProjectsWithCorrectIds();