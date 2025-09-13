// scripts/check-data.js - データベースの現在の状態を確認するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? '設定済み' : '未設定');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('データベースの状態を確認します...\n');
  
  // 企業データの確認
  console.log('=== 企業データ ===');
  const { data: companies, error: companyError } = await supabase
    .from('company')
    .select('id, name, industry');
    
  if (companyError) {
    console.error('企業データ取得エラー:', companyError);
  } else {
    console.log(`企業数: ${companies?.length || 0}`);
    companies?.forEach(company => {
      console.log(`- ID: ${company.id}, 名前: ${company.name}, 業界: ${company.industry}`);
    });
  }
  
  // プロジェクトデータの確認
  console.log('\n=== プロジェクトデータ ===');
  const { data: projects, error: projectError } = await supabase
    .from('project')
    .select('id, company_id, title, status');
    
  if (projectError) {
    console.error('プロジェクトデータ取得エラー:', projectError);
  } else {
    console.log(`プロジェクト数: ${projects?.length || 0}`);
    projects?.forEach(project => {
      console.log(`- ID: ${project.id}, 企業ID: ${project.company_id}, タイトル: ${project.title}, ステータス: ${project.status}`);
    });
  }
  
  // 企業ID別プロジェクト数の確認
  if (companies && companies.length > 0) {
    console.log('\n=== 企業ID別プロジェクト数 ===');
    for (const company of companies) {
      const { data: companyProjects } = await supabase
        .from('project')
        .select('id')
        .eq('company_id', company.id);
      console.log(`企業 ${company.name} (ID: ${company.id}): ${companyProjects?.length || 0}件のプロジェクト`);
    }
  }
}

checkData().catch(console.error);