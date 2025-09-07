// lib/mock.ts - Mock data for events and students

export interface Event {
  id: string;
  title: string;
  starts_on: string;
  venue?: string;
}

export interface Student {
  id: string;
  name: string;
  university: string;
  bio: string;
  skills: string[];
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  logo?: string;
  projects?: Project[];
}

export interface Project {
  id: string;
  companyId: string;
  title: string;
  description: string;
  skills: string[];
  status: 'active' | 'closed' | 'draft';
}

// Mock event data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "React勉強会",
    starts_on: "2025-09-10T19:00:00Z",
    venue: "オンライン"
  },
  {
    id: "2", 
    title: "TypeScript入門セミナー",
    starts_on: "2025-09-15T14:00:00Z",
    venue: "東京会場"
  },
  {
    id: "3",
    title: "Web開発ハンズオン",
    starts_on: "2025-09-20T10:00:00Z",
    venue: "大阪会場"
  },
  {
    id: "4",
    title: "デザインシステム構築講座",
    starts_on: "2025-09-25T16:00:00Z",
    venue: "オンライン"
  },
  {
    id: "5",
    title: "Next.js実践講座",
    starts_on: "2025-10-01T13:00:00Z",
    venue: "名古屋会場"
  },
  {
    id: "6",
    title: "アクセシビリティ改善ワークショップ",
    starts_on: "2025-10-05T15:00:00Z",
    venue: "オンライン"
  },
  {
    id: "7",
    title: "パフォーマンス最適化セミナー",
    starts_on: "2025-10-10T11:00:00Z",
    venue: "福岡会場"
  },
  {
    id: "8",
    title: "CI/CD導入実践",
    starts_on: "2025-10-15T14:30:00Z",
    venue: "オンライン"
  },
  {
    id: "9",
    title: "モバイルファースト開発",
    starts_on: "2025-10-20T10:00:00Z",
    venue: "仙台会場"
  },
  {
    id: "10",
    title: "GraphQL API設計",
    starts_on: "2025-10-25T16:00:00Z",
    venue: "オンライン"
  },
  {
    id: "11",
    title: "Dockerコンテナ化入門",
    starts_on: "2025-11-01T13:00:00Z",
    venue: "札幌会場"
  },
  {
    id: "12",
    title: "セキュリティベストプラクティス",
    starts_on: "2025-11-05T15:30:00Z",
    venue: "オンライン"
  }
];

// Mock student data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "山田 花子",
    university: "九州工業大学 情報工学部",
    bio: "Web開発とUI/UXデザインに興味があります。ユーザーに愛されるサービスを作る経験を積みたいです。",
    skills: ["HTML/CSS", "JavaScript", "Figma", "React"]
  },
  {
    id: "2", 
    name: "田中 太郎",
    university: "北九州市立大学 経済学部",
    bio: "マーケティングとデータ分析を学んでいます。スタートアップのグロース戦略に貢献したいです。",
    skills: ["マーケティングリサーチ", "データ分析", "SNS運用"]
  },
  {
    id: "3",
    name: "鈴木 一郎", 
    university: "産業医科大学 医学部",
    bio: "医療分野の課題をテクノロジーで解決することに情熱を持っています。ヘルスケア関連の事業に携わりたいです。",
    skills: ["医療知識", "研究", "課題発見能力"]
  },
  {
    id: "4",
    name: "佐藤 美咲",
    university: "九州工業大学 情報工学部",
    bio: "AI・機械学習に興味があり、社会課題解決に技術を活用したいと考えています。",
    skills: ["Python", "機械学習", "データサイエンス", "TensorFlow"]
  },
  {
    id: "5",
    name: "中村 健太",
    university: "北九州市立大学 国際環境工学部",
    bio: "環境問題に関心があり、持続可能な社会の実現に貢献したいです。",
    skills: ["環境工学", "プロジェクト管理", "データ分析"]
  }
];


export function getNext10(): Event[] {
  const now = new Date();
  
  return mockEvents
    .filter(event => new Date(event.starts_on) >= now)
    .sort((a, b) => new Date(a.starts_on).getTime() - new Date(b.starts_on).getTime())
    .slice(0, 10);
}

export function getAllStudents(): Student[] {
  return mockStudents;
}

// Mock company data
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "株式会社 未来創造",
    industry: "AI・地域活性化",
    description: "私たちはAI技術を駆使して、北九州市の地域課題解決に取り組むスタートアップです。あなたの若い力で、未来の北九州を一緒に創りませんか？"
  },
  {
    id: "2", 
    name: "TechForward Inc.",
    industry: "製造業向けSaaS",
    description: "製造業のDXを推進するための革新的なSaaSを開発しています。世界に通用するプロダクト開発に興味がある学生を募集しています。"
  },
  {
    id: "3",
    name: "Kitakyushu Labs",
    industry: "環境エネルギー", 
    description: "持続可能な社会を目指し、再生可能エネルギーに関する研究開発を行っています。環境問題に情熱を持つ仲間を探しています。"
  },
  {
    id: "4",
    name: "株式会社グルメディスカバリー",
    industry: "フードテック",
    description: "地元の隠れた名店と食を愛する人々をつなぐ新しいプラットフォームを開発中。食べることが好きな人大歓迎！"
  },
  {
    id: "5",
    name: "NextGen Solutions",
    industry: "ヘルスケアIT",
    description: "医療現場のデジタル化を推進し、患者さんと医療従事者の双方にメリットをもたらすソリューションを開発しています。"
  }
];

// Mock project data
const mockProjects: Project[] = [
  {
    id: "1",
    companyId: "1",
    title: "地域密着型マーケティングアシスタント",
    description: "SNS運用、イベント企画などを通じて、私たちのサービスを地域に広めるお手伝いをしてください。実践的なマーケティングスキルが身につきます。",
    skills: ["マーケティング", "SNS運用", "企画"],
    status: "active"
  },
  {
    id: "2",
    companyId: "2",
    title: "UI/UXデザインインターン",
    description: "製造業向けSaaSのユーザーインターフェース改善に取り組んでいただきます。実際のプロダクトに携われる貴重な経験です。",
    skills: ["UI/UX", "Figma", "プロトタイピング"],
    status: "active"
  },
  {
    id: "3", 
    companyId: "3",
    title: "環境データ分析プロジェクト",
    description: "再生可能エネルギーの効率化に向けたデータ分析業務。Pythonを使った実践的なデータサイエンス経験が積めます。",
    skills: ["Python", "データ分析", "環境工学"],
    status: "active"
  }
];

export function getStudentById(id: string): Student | undefined {
  return mockStudents.find(student => student.id === id);
}

export function getAllCompanies(): Company[] {
  return mockCompanies;
}

export function getCompanyById(id: string): Company | undefined {
  return mockCompanies.find(company => company.id === id);
}

export function getProjectsByCompanyId(companyId: string): Project[] {
  return mockProjects.filter(project => project.companyId === companyId);
}

export function getAllProjects(): Project[] {
  return mockProjects;
}