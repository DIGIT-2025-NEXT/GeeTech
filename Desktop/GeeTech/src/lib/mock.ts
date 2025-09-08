// lib/mock.ts - モックデータ定義
export interface Student {
  id: string;
  name: string;
  university: string;
  bio: string;
  skills: string[];
  email: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  location: string;
}

export const students: Student[] = [
  {
    id: "1",
    name: "田中太郎",
    university: "東京工業大学",
    bio: "フルスタックエンジニアを目指している大学3年生です。特にReactとNode.jsを使ったWebアプリケーション開発に興味があります。最近はNext.jsとTypeScriptを学習中で、実際のプロジェクトで経験を積みたいと考えています。",
    skills: ["React", "TypeScript", "Node.js", "Python", "Git"],
    email: "tanaka@example.com"
  },
  {
    id: "2", 
    name: "佐藤花子",
    university: "早稲田大学",
    bio: "UI/UXデザインとフロントエンド開発の両方に興味がある学生です。ユーザー体験を重視したWebサービスの開発に携わりたいと思っています。デザイン思考とプログラミングを組み合わせた価値創造に挑戦したいです。",
    skills: ["React", "Vue.js", "CSS", "Figma", "JavaScript"],
    email: "sato@example.com"
  },
  {
    id: "3",
    name: "鈴木一郎", 
    university: "慶應義塾大学",
    bio: "データサイエンスとAI分野に強い関心を持つ学生です。機械学習やデータ分析を活用したプロダクト開発に取り組みたいと考えています。統計学の知識を実践的なプロジェクトで活かしていきたいです。",
    skills: ["Python", "R", "SQL", "TensorFlow", "Pandas"],
    email: "suzuki@example.com"
  }
];

export const companies: Company[] = [
  {
    id: "1",
    name: "テックソリューションズ",
    industry: "IT・ソフトウェア",
    description: "最先端のIT技術を活用したソリューションを提供する企業です。",
    location: "北九州市"
  },
  {
    id: "2",
    name: "イノベーション株式会社",
    industry: "製造業",
    description: "革新的な製品開発で業界をリードする製造業企業です。",
    location: "北九州市"
  },
  {
    id: "3",
    name: "デジタルマーケティング",
    industry: "マーケティング",
    description: "デジタル時代のマーケティング戦略を提案する企業です。",
    location: "北九州市"
  }
];

export function getStudentById(id: string): Student | undefined {
  return students.find(student => student.id === id);
}

export function getAllStudents(): Student[] {
  return students;
}

export function getCompanyById(id: string): Company | undefined {
  return companies.find(company => company.id === id);
}

export function getAllCompanies(): Company[] {
  return companies;
}