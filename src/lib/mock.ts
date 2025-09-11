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
  features?: string[];
  logo?: string;
  projects?: Project[];
  partcipantsid?: string[];
  adoptedid?: string[];
  Rejectedid?: string[];
}

export interface Project {
  id: string;
  companyId: string;
  title: string;
  description: string;
  skills: string[];
  status: 'active' | 'closed' | 'draft';
}
export interface ChatLog{
  speaker: `company`|`student`;
  chattext: string;
  chattime: string;
}
 export interface Chat {
  id: string;
  companyid: string;
  studentid: string;
  chatlog: ChatLog[];
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
  },
  {
    id: "6",
    name: "高橋 彩香",
    university: "九州工業大学 情報工学部",
    bio: "VRとARの技術開発に興味があり、新しい体験を作り出すことに挑戦したいです。",
    skills: ["Unity", "C#", "VR/AR開発", "3Dモデリング"]
  },
  {
    id: "7",
    name: "渡辺 拓真",
    university: "北九州市立大学 経済学部",
    bio: "デジタルマーケティングとデータ分析を学んでいます。EC事業の成長戦略に興味があります。",
    skills: ["Google Analytics", "SEO", "SNSマーケティング", "データ分析"]
  },
  {
    id: "8",
    name: "松本 優子",
    university: "産業医科大学 医学部",
    bio: "医療DXの推進に関心があり、患者さんの体験向上に貢献したいと考えています。",
    skills: ["医療知識", "UI/UX基礎", "プロセス改善", "データ分析"]
  },
  {
    id: "9",
    name: "森田 慎一",
    university: "九州工業大学 情報工学部",
    bio: "IoTとスマートシティの実現に向けて、センサーデータの活用に取り組んでいます。",
    skills: ["IoT", "Python", "センサーネットワーク", "データ可視化"]
  },
  {
    id: "10",
    name: "小川 恵美",
    university: "北九州市立大学 国際環境工学部",
    bio: "サステナブルなビジネスモデルの構築に興味があり、循環経済の実現に貢献したいです。",
    skills: ["環境経済学", "プロジェクト企画", "プレゼンテーション", "英語"]
  },
  {
    id: "11",
    name: "加藤 雄介",
    university: "九州工業大学 情報工学部",
    bio: "ブロックチェーン技術を活用した新しいサービス開発に挑戦したいと考えています。",
    skills: ["Solidity", "Web3.js", "JavaScript", "暗号化技術"]
  },
  {
    id: "12",
    name: "岡田 亜衣",
    university: "産業医科大学 医学部",
    bio: "医療現場でのAI活用に興味があり、診断支援システムの開発に携わりたいです。",
    skills: ["医療統計", "機械学習基礎", "研究", "データ解釈"]
  },
  {
    id: "13",
    name: "石井 翔太",
    university: "北九州市立大学 経済学部",
    bio: "地域創生とスタートアップエコシステムの構築に関心があります。",
    skills: ["ビジネス企画", "市場調査", "プレゼンテーション", "チームワーク"]
  },
  {
    id: "14",
    name: "村上 美里",
    university: "九州工業大学 情報工学部",
    bio: "AIとロボティクスの融合技術に興味があり、人と機械の協働を実現したいです。",
    skills: ["ROS", "Python", "機械学習", "制御工学"]
  },
  {
    id: "15",
    name: "長谷川 健二",
    university: "北九州市立大学 国際環境工学部",
    bio: "再生可能エネルギーの効率化と蓄電技術の開発に取り組みたいと考えています。",
    skills: ["電気工学", "バッテリー技術", "シミュレーション", "実験設計"]
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
    description: "私たちはAI技術を駆使して、北九州市の地域課題解決に取り組むスタートアップです。あなたの若い力で、未来の北九州を一緒に創りませんか？",
    features: ["リモートワーク可", "オンライン面談OK", "フレックス制度"],
    partcipantsid: ["1", "4", "5"]
  },
  {
    id: "2", 
    name: "TechForward Inc.",
    industry: "製造業向けSaaS",
    description: "製造業のDXを推進するための革新的なSaaSを開発しています。世界に通用するプロダクト開発に興味がある学生を募集しています。",
    features: ["オンライン面談OK", "住宅手当あり", "研修制度充実"],
    partcipantsid: ["2", "3"]
  },
  {
    id: "3",
    name: "Kitakyushu Labs",
    industry: "環境エネルギー", 
    description: "持続可能な社会を目指し、再生可能エネルギーに関する研究開発を行っています。環境問題に情熱を持つ仲間を探しています。",
    features: ["リモートワーク可", "社会貢献活動参加", "学会発表支援"],
    partcipantsid: []
  },
  {
    id: "4",
    name: "株式会社グルメディスカバリー",
    industry: "フードテック",
    description: "地元の隠れた名店と食を愛する人々をつなぐ新しいプラットフォームを開発中。食べることが好きな人大歓迎！",
    features: ["食事補助", "オンライン面談OK", "カジュアル面談可"],
    partcipantsid: ["1", "2", "3", "4"]
  },
  {
    id: "5",
    name: "NextGen Solutions",
    industry: "ヘルスケアIT",
    description: "医療現場のデジタル化を推進し、患者さんと医療従事者の双方にメリットをもたらすソリューションを開発しています。",
    features: ["フレックス制度", "研修制度充実", "リモートワーク可"],
    partcipantsid: []
  },
  {
    id: "6",
    name: "株式会社イノベートラボ",
    industry: "EdTech",
    description: "教育とテクノロジーの融合で、新しい学習体験を創造します。学習者一人ひとりに最適化された教育プラットフォームを開発中です。",
    features: ["リモートワーク可", "学習支援制度", "オンライン面談OK"],
    partcipantsid: ["1", "3"]
  },
  {
    id: "7",
    name: "データマイニング株式会社",
    industry: "ビッグデータ・AI",
    description: "企業のビッグデータ活用を支援し、データドリブンな意思決定を実現するAIソリューションを提供しています。",
    features: ["最新技術習得支援", "フレックス制度", "研修制度充実"],
    partcipantsid: ["4", "9"]
  },
  {
    id: "8",
    name: "株式会社スマートシティ九州",
    industry: "IoT・スマートシティ",
    description: "IoT技術を活用したスマートシティの実現に向けて、センサーネットワークと都市データの活用プラットフォームを開発しています。",
    features: ["社会貢献活動参加", "技術力向上支援", "オンライン面談OK"],
    partcipantsid: ["2", "5"]
  },
  {
    id: "9",
    name: "株式会社クリエイティブデザイン",
    industry: "デザイン・UI/UX",
    description: "ユーザー体験を重視したWebサービスやアプリのデザインを手がけ、クライアントのブランド価値向上に貢献しています。",
    features: ["クリエイティブ環境", "デザインツール支給", "フレックス制度"],
    partcipantsid: ["1", "6"]
  },
  {
    id: "10",
    name: "株式会社ブロックチェーンラボ",
    industry: "ブロックチェーン・Web3",
    description: "ブロックチェーン技術を活用した分散型アプリケーションの開発と、Web3時代の新しいビジネスモデルの創造に取り組んでいます。",
    features: ["最先端技術", "リモートワーク可", "技術書購入支援"],
    partcipantsid: ["11"]
  },
  {
    id: "11",
    name: "株式会社ロボティクス北九州",
    industry: "ロボティクス・自動化",
    description: "産業用ロボットの開発と工場自動化システムの構築を通じて、製造業の生産性向上と働き方改革を支援しています。",
    features: ["技術力向上支援", "研修制度充実", "住宅手当あり"],
    partcipantsid: ["14"]
  },
  {
    id: "12",
    name: "株式会社サステナブルエナジー",
    industry: "再生可能エネルギー・蓄電",
    description: "太陽光発電と蓄電池システムの開発・運用を通じて、持続可能なエネルギー社会の実現を目指しています。",
    features: ["環境貢献", "技術研究支援", "フレックス制度"],
    partcipantsid: ["10", "15"]
  },
  {
    id: "13",
    name: "株式会社バイオテックイノベーション",
    industry: "バイオテクノロジー",
    description: "バイオテクノロジーを活用した新薬開発支援と医療機器の研究開発を行い、人々の健康と生活の質向上に貢献しています。",
    features: ["研究環境充実", "学会発表支援", "オンライン面談OK"],
    partcipantsid: ["8", "12"]
  },
  {
    id: "14",
    name: "株式会社デジタルマーケティングプロ",
    industry: "デジタルマーケティング",
    description: "AI を活用したマーケティング自動化ツールの開発と、企業のデジタル変革を支援するコンサルティングサービスを提供しています。",
    features: ["マーケティングスキル習得", "データ分析環境", "リモートワーク可"],
    partcipantsid: ["7", "13"]
  },
  {
    id: "15",
    name: "株式会社次世代モビリティ",
    industry: "モビリティ・自動運転",
    description: "自動運転技術の研究開発と次世代モビリティサービスの構築を通じて、未来の交通社会をデザインしています。",
    features: ["最新技術研究", "技術力向上支援", "社会貢献活動参加"],
    partcipantsid: []
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
export const mockChats: Chat[] = [
  {
    id: "chat-1",
    companyid: "1",
    studentid: "1",
    chatlog: [
      { speaker: "company", chattext: "UIデザインの改善をお願いしたいのですが可能ですか？", chattime: "2025-09-01 10:00" },
      { speaker: "student", chattext: "はい、Figmaでのデザイン経験がありますので対応できます。", chattime: "2025-09-01 10:05" },
      { speaker: "company", chattext: "具体的には予約画面の操作性を改善したいと考えています。", chattime: "2025-09-01 10:10" },
      { speaker: "student", chattext: "ユーザーフローを分析してワイヤーフレームを提案しますね。", chattime: "2025-09-01 10:15" }
    ]
  },
  {
    id: "chat-2",
    companyid: "2",
    studentid: "2",
    chatlog: [
      { speaker: "company", chattext: "市場調査のレポートをお願いできますか？", chattime: "2025-09-01 11:00" },
      { speaker: "student", chattext: "はい、データ分析とレポート作成は得意です。", chattime: "2025-09-01 11:04" },
      { speaker: "company", chattext: "特に海外市場の比較データをまとめてほしいです。", chattime: "2025-09-01 11:08" },
      { speaker: "student", chattext: "承知しました。英語資料も扱えるので問題ありません。", chattime: "2025-09-01 11:12" }
    ]
  },
  {
    id: "chat-3",
    companyid: "5",
    studentid: "3",
    chatlog: [
      { speaker: "company", chattext: "医療従事者向けのアンケート調査を手伝えますか？", chattime: "2025-09-01 09:30" },
      { speaker: "student", chattext: "はい、医学部での研究経験を活かして協力できます。", chattime: "2025-09-01 09:35" },
      { speaker: "company", chattext: "対象者のリストアップも必要なのですが可能ですか？", chattime: "2025-09-01 09:40" },
      { speaker: "student", chattext: "倫理面に配慮した形で提案させていただきます。", chattime: "2025-09-01 09:45" }
    ]
  },
  {
    id: "chat-4",
    companyid: "1",
    studentid: "4",
    chatlog: [
      { speaker: "company", chattext: "機械学習モデルの精度検証をお願いしたいです。可能ですか？", chattime: "2025-09-01 14:00" },
      { speaker: "student", chattext: "はい、PythonとTensorFlowを使った経験があります。", chattime: "2025-09-01 14:07" },
      { speaker: "company", chattext: "現在の精度が70%程度なのですが、改善の余地はありますか？", chattime: "2025-09-01 14:12" },
      { speaker: "student", chattext: "データの前処理や特徴量エンジニアリングを検討すべきです。", chattime: "2025-09-01 14:18" }
    ]
  },
  {
    id: "chat-5",
    companyid: "3",
    studentid: "5",
    chatlog: [
      { speaker: "company", chattext: "環境データの整理と分析をお願いできますか？", chattime: "2025-09-01 15:00" },
      { speaker: "student", chattext: "はい、データ分析スキルを活かして対応できます。", chattime: "2025-09-01 15:05" },
      { speaker: "company", chattext: "CO2排出量の時系列データを重点的に見ていただきたいです。", chattime: "2025-09-01 15:10" },
      { speaker: "student", chattext: "分かりました、可視化してレポートにまとめます。", chattime: "2025-09-01 15:14" }
    ]
  },
  {
    id: "chat-6",
    companyid: "4",
    studentid: "1",
    chatlog: [
      { speaker: "company", chattext: "グルメ紹介サイトのUI改善をお願いできますか？", chattime: "2025-09-02 10:20" },
      { speaker: "student", chattext: "Reactを使ったUI改善の経験がありますので可能です。", chattime: "2025-09-02 10:25" },
      { speaker: "company", chattext: "写真の見せ方を工夫して滞在時間を伸ばしたいです。", chattime: "2025-09-02 10:30" },
      { speaker: "student", chattext: "カルーセル表示やアニメーションを試してみましょう。", chattime: "2025-09-02 10:35" }
    ]
  },
  {
    id: "chat-7",
    companyid: "2",
    studentid: "4",
    chatlog: [
      { speaker: "company", chattext: "製造業向けのデータ予測モデルを作れますか？", chattime: "2025-09-02 11:10" },
      { speaker: "student", chattext: "はい、機械学習アルゴリズムを使った予測モデルを構築できます。", chattime: "2025-09-02 11:15" },
      { speaker: "company", chattext: "欠損値が多いデータでも対応できますか？", chattime: "2025-09-02 11:20" },
      { speaker: "student", chattext: "はい、前処理を工夫して精度を保つことが可能です。", chattime: "2025-09-02 11:25" }
    ]
  },
  {
    id: "chat-8",
    companyid: "5",
    studentid: "2",
    chatlog: [
      { speaker: "company", chattext: "医療系アプリのマーケティング戦略を一緒に考えられますか？", chattime: "2025-09-02 13:00" },
      { speaker: "student", chattext: "はい、SNS運用やデータ分析を活かして提案できます。", chattime: "2025-09-02 13:04" },
      { speaker: "company", chattext: "高齢者層にも届く施策があると助かります。", chattime: "2025-09-02 13:10" },
      { speaker: "student", chattext: "分かりました。オフラインとの連動も含めて検討します。", chattime: "2025-09-02 13:15" }
    ]
  },
  {
    id: "chat-9",
    companyid: "3",
    studentid: "3",
    chatlog: [
      { speaker: "company", chattext: "再生可能エネルギーの調査に協力できますか？", chattime: "2025-09-02 14:20" },
      { speaker: "student", chattext: "はい、研究や課題発見のスキルを活かして協力できます。", chattime: "2025-09-02 14:25" },
      { speaker: "company", chattext: "特に太陽光発電の導入事例を集めたいです。", chattime: "2025-09-02 14:30" },
      { speaker: "student", chattext: "最新の論文や報告書を調べてまとめます。", chattime: "2025-09-02 14:34" }
    ]
  },
  {
    id: "chat-10",
    companyid: "4",
    studentid: "5",
    chatlog: [
      { speaker: "company", chattext: "食に関するプロジェクトの調査を手伝ってもらえますか？", chattime: "2025-09-02 15:40" },
      { speaker: "student", chattext: "はい、環境工学の視点から持続可能性についても考えられます。", chattime: "2025-09-02 15:45" },
      { speaker: "company", chattext: "地域農家との連携にも興味があります。", chattime: "2025-09-02 15:50" },
      { speaker: "student", chattext: "地産地消の観点も加えて分析してみます。", chattime: "2025-09-02 15:55" }
    ]
  },
  {
    id: "chat-11",
    companyid: "1",
    studentid: "2",
    chatlog: [
      { speaker: "company", chattext: "学生向けサービスの利用動向を調査できますか？", chattime: "2025-09-03 09:00" },
      { speaker: "student", chattext: "はい、アンケート設計とデータ集計を担当できます。", chattime: "2025-09-03 09:05" },
      { speaker: "company", chattext: "特にSNSでの拡散効果を知りたいです。", chattime: "2025-09-03 09:10" },
      { speaker: "student", chattext: "SNS分析は得意なのでお任せください。", chattime: "2025-09-03 09:15" }
    ]
  },
  {
    id: "chat-12",
    companyid: "2",
    studentid: "1",
    chatlog: [
      { speaker: "company", chattext: "フロントエンド開発の経験を活かせますか？", chattime: "2025-09-03 11:00" },
      { speaker: "student", chattext: "はい、ReactとTypeScriptを使った開発経験があります。", chattime: "2025-09-03 11:05" },
      { speaker: "company", chattext: "既存のダッシュボードを改善してほしいです。", chattime: "2025-09-03 11:10" },
      { speaker: "student", chattext: "UI/UXを意識してリデザインしてみます。", chattime: "2025-09-03 11:15" }
    ]
  },
  {
    id: "chat-13",
    companyid: "3",
    studentid: "4",
    chatlog: [
      { speaker: "company", chattext: "AIを活用した環境モデルに興味はありますか？", chattime: "2025-09-03 13:00" },
      { speaker: "student", chattext: "はい、機械学習を環境分野に応用するのは挑戦したい分野です。", chattime: "2025-09-03 13:05" },
      { speaker: "company", chattext: "CO2予測モデルの試作を依頼したいです。", chattime: "2025-09-03 13:10" },
      { speaker: "student", chattext: "必要なデータをいただければ対応可能です。", chattime: "2025-09-03 13:15" }
    ]
  },
  {
    id: "chat-14",
    companyid: "5",
    studentid: "1",
    chatlog: [
      { speaker: "company", chattext: "医療システムのUI改善をお願いできますか？", chattime: "2025-09-03 15:00" },
      { speaker: "student", chattext: "はい、患者さんが使いやすいデザインを考えられます。", chattime: "2025-09-03 15:05" },
      { speaker: "company", chattext: "操作が複雑だと苦情が多いので改善したいです。", chattime: "2025-09-03 15:10" },
      { speaker: "student", chattext: "シンプルなUIにする提案を準備します。", chattime: "2025-09-03 15:15" }
    ]
  },
  {
    id: "chat-15",
    companyid: "4",
    studentid: "3",
    chatlog: [
      { speaker: "company", chattext: "健康志向の飲食店を紹介する記事を書けますか？", chattime: "2025-09-04 10:00" },
      { speaker: "student", chattext: "はい、医療と食の観点から記事執筆が可能です。", chattime: "2025-09-04 10:05" },
      { speaker: "company", chattext: "科学的根拠を交えて紹介したいです。", chattime: "2025-09-04 10:10" },
      { speaker: "student", chattext: "論文を引用しながら記事を作成します。", chattime: "2025-09-04 10:15" }
    ]
  },
  {
    id: "chat-16",
    companyid: "2",
    studentid: "5",
    chatlog: [
      { speaker: "company", chattext: "SaaSサービスの環境面での評価が必要です。", chattime: "2025-09-04 11:00" },
      { speaker: "student", chattext: "はい、環境工学を学んでいるので対応できます。", chattime: "2025-09-04 11:05" },
      { speaker: "company", chattext: "省エネ効果の指標を調べてほしいです。", chattime: "2025-09-04 11:10" },
      { speaker: "student", chattext: "基準に基づいて評価してみます。", chattime: "2025-09-04 11:15" }
    ]
  },
  {
    id: "chat-17",
    companyid: "3",
    studentid: "2",
    chatlog: [
      { speaker: "company", chattext: "再エネに関するSNSキャンペーンの分析が可能ですか？", chattime: "2025-09-04 14:00" },
      { speaker: "student", chattext: "はい、SNS運用経験を活かして分析します。", chattime: "2025-09-04 14:05" },
      { speaker: "company", chattext: "投稿の反応率を上げたいです。", chattime: "2025-09-04 14:10" },
      { speaker: "student", chattext: "ターゲット層に合わせた改善提案をします。", chattime: "2025-09-04 14:15" }
    ]
  },
  {
    id: "chat-18",
    companyid: "1",
    studentid: "5",
    chatlog: [
      { speaker: "company", chattext: "AIを使った地域課題解決プロジェクトに興味はありますか？", chattime: "2025-09-05 09:00" },
      { speaker: "student", chattext: "はい、持続可能性の観点から協力したいです。", chattime: "2025-09-05 09:05" },
      { speaker: "company", chattext: "具体的には廃棄物処理の効率化を考えています。", chattime: "2025-09-05 09:10" },
      { speaker: "student", chattext: "データ分析の視点から貢献できそうです。", chattime: "2025-09-05 09:15" }
    ]
  },
  {
    id: "chat-19",
    companyid: "4",
    studentid: "2",
    chatlog: [
      { speaker: "company", chattext: "グルメアプリの利用者データを解析できますか？", chattime: "2025-09-05 10:00" },
      { speaker: "student", chattext: "はい、マーケティングリサーチとデータ分析を得意としています。", chattime: "2025-09-05 10:05" },
      { speaker: "company", chattext: "利用頻度の高い層を把握したいです。", chattime: "2025-09-05 10:10" },
      { speaker: "student", chattext: "年齢層や利用時間帯を軸に整理してみます。", chattime: "2025-09-05 10:15" }
    ]
  },
  {
    id: "chat-20",
    companyid: "5",
    studentid: "4",
    chatlog: [
      { speaker: "company", chattext: "医療AIの研究に興味はありますか？", chattime: "2025-09-05 11:00" },
      { speaker: "student", chattext: "はい、AIと医療の融合は大きな可能性があると思います。", chattime: "2025-09-05 11:05" },
      { speaker: "company", chattext: "画像診断支援の精度向上がテーマです。", chattime: "2025-09-05 11:10" },
      { speaker: "student", chattext: "機械学習を応用して改善できそうです。", chattime: "2025-09-05 11:15" }
    ]
  },
  {
    id: "chat-21",
    companyid: "2",
    studentid: "3",
    chatlog: [
      { speaker: "company", chattext: "新製品の市場調査を医学的観点から分析できますか？", chattime: "2025-09-06 09:00" },
      { speaker: "student", chattext: "はい、医療系の文献調査を踏まえて分析できます。", chattime: "2025-09-06 09:05" },
      { speaker: "company", chattext: "健康志向の市場を特に調べたいです。", chattime: "2025-09-06 09:10" },
      { speaker: "student", chattext: "国内外の動向を比較してまとめます。", chattime: "2025-09-06 09:15" }
    ]
  },
  {
    id: "chat-22",
    companyid: "3",
    studentid: "1",
    chatlog: [
      { speaker: "company", chattext: "環境政策に関するアプリのUI改善を依頼できますか？", chattime: "2025-09-06 10:00" },
      { speaker: "student", chattext: "はい、ユーザーが使いやすいUI設計を提案できます。", chattime: "2025-09-06 10:05" },
      { speaker: "company", chattext: "行政担当者が利用する前提です。", chattime: "2025-09-06 10:10" },
      { speaker: "student", chattext: "専門用語を整理して直感的に操作できるようにします。", chattime: "2025-09-06 10:15" }
    ]
  },
  {
    id: "chat-23",
    companyid: "4",
    studentid: "4",
    chatlog: [
      { speaker: "company", chattext: "食の安全に関するデータベースを作成できますか？", chattime: "2025-09-06 11:00" },
      { speaker: "student", chattext: "はい、データベース設計と構築の経験があります。", chattime: "2025-09-06 11:05" },
      { speaker: "company", chattext: "農薬やアレルゲン情報を含めたいです。", chattime: "2025-09-06 11:10" },
      { speaker: "student", chattext: "適切なスキーマを設計して実装します。", chattime: "2025-09-06 11:15" }
    ]
  },
  {
    id: "chat-24",
    companyid: "1",
    studentid: "3",
    chatlog: [
      { speaker: "company", chattext: "学生の医療データ分析をお願いできますか？", chattime: "2025-09-06 13:00" },
      { speaker: "student", chattext: "はい、統計学の知識を活かして分析できます。", chattime: "2025-09-06 13:05" },
      { speaker: "company", chattext: "特に生活習慣病の傾向を調べたいです。", chattime: "2025-09-06 13:10" },
      { speaker: "student", chattext: "関連要因を整理して報告します。", chattime: "2025-09-06 13:15" }
    ]
  },
  {
    id: "chat-25",
    companyid: "5",
    studentid: "5",
    chatlog: [
      { speaker: "company", chattext: "病院でのエネルギー消費削減について研究したいです。", chattime: "2025-09-06 14:00" },
      { speaker: "student", chattext: "はい、環境工学の視点から提案できます。", chattime: "2025-09-06 14:05" },
      { speaker: "company", chattext: "空調と照明に焦点を当てたいです。", chattime: "2025-09-06 14:10" },
      { speaker: "student", chattext: "省エネ効果を数値化して報告します。", chattime: "2025-09-06 14:15" }
    ]
  },
  {
    id: "chat-26",
    companyid: "2",
    studentid: "1",
    chatlog: [
      { speaker: "company", chattext: "クラウドサービスのUI改善を依頼できますか？", chattime: "2025-09-07 09:00" },
      { speaker: "student", chattext: "はい、ダッシュボード設計を得意としています。", chattime: "2025-09-07 09:05" },
      { speaker: "company", chattext: "管理者用と一般ユーザー用に分けたいです。", chattime: "2025-09-07 09:10" },
      { speaker: "student", chattext: "権限ごとにUIを最適化して提案します。", chattime: "2025-09-07 09:15" }
    ]
  },
  {
    id: "chat-27",
    companyid: "3",
    studentid: "2",
    chatlog: [
      { speaker: "company", chattext: "エコキャンペーンの効果測定をお願いできますか？", chattime: "2025-09-07 10:00" },
      { speaker: "student", chattext: "はい、SNSデータの分析を通じて測定します。", chattime: "2025-09-07 10:05" },
      { speaker: "company", chattext: "キャンペーン前後の比較が欲しいです。", chattime: "2025-09-07 10:10" },
      { speaker: "student", chattext: "時系列で可視化して報告します。", chattime: "2025-09-07 10:15" }
    ]
  },
  {
    id: "chat-28",
    companyid: "4",
    studentid: "5",
    chatlog: [
      { speaker: "company", chattext: "サステナブルフードに関する調査を依頼できますか？", chattime: "2025-09-07 11:00" },
      { speaker: "student", chattext: "はい、環境工学を学んでいるので対応可能です。", chattime: "2025-09-07 11:05" },
      { speaker: "company", chattext: "若者の意識調査を中心にお願いします。", chattime: "2025-09-07 11:10" },
      { speaker: "student", chattext: "アンケートを設計してレポートします。", chattime: "2025-09-07 11:15" }
    ]
  },
  {
    id: "chat-29",
    companyid: "5",
    studentid: "4",
    chatlog: [
      { speaker: "company", chattext: "AIによる病気予測モデルに興味はありますか？", chattime: "2025-09-07 13:00" },
      { speaker: "student", chattext: "はい、機械学習の応用研究に関心があります。", chattime: "2025-09-07 13:05" },
      { speaker: "company", chattext: "心疾患リスクの予測を考えています。", chattime: "2025-09-07 13:10" },
      { speaker: "student", chattext: "特徴量を工夫して精度向上に取り組みます。", chattime: "2025-09-07 13:15" }
    ]
  },
  {
    id: "chat-30",
    companyid: "1",
    studentid: "2",
    chatlog: [
      { speaker: "company", chattext: "学生支援プラットフォームのUI改善を依頼できますか？", chattime: "2025-09-07 15:00" },
      { speaker: "student", chattext: "はい、ユーザーが使いやすい画面を設計します。", chattime: "2025-09-07 15:05" },
      { speaker: "company", chattext: "多言語対応も視野に入れたいです。", chattime: "2025-09-07 15:10" },
      { speaker: "student", chattext: "i18nライブラリを使って対応可能です。", chattime: "2025-09-07 15:15" },
      { speaker: "company", chattext: "あなたを採用します", chattime: "2025-09-07 15:30"}
    ]
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
export function getAllChat(): Chat[] {
  return mockChats;
}

export function getchatById(id: string): Chat | undefined {
  return mockChats.find(chat => chat.id === id);
}

export function findChatByStudentId(studentId: string): Chat | undefined {
  return mockChats.find(chat => chat.studentid === studentId);
}

export function addAdoptedid(companyid: string,studentid: string){
  const company = mockCompanies.find(company => company.id === companyid);
  if (!company) return;
  if (!company.adoptedid) company.adoptedid = [];
  if (!company.adoptedid.includes(studentid)) company.adoptedid.push(studentid);
}

export function removeAdoptedid(companyid: string,studentid: string){
  const company = mockCompanies.find(company => company.id === companyid);
  if (!company) return;
  company.adoptedid = (company.adoptedid || []).filter(id => id !== studentid);
}

export function addRejectedid(companyid: string,studentid: string){
  const company = mockCompanies.find(company => company.id === companyid);
  if (!company) return;
  if (!company.Rejectedid) company.Rejectedid = [];
  if (!company.Rejectedid.includes(studentid)) company.Rejectedid.push(studentid);
}

export function removerejectedid(companyid: string,studentid: string){
  const company = mockCompanies.find(company => company.id === companyid);
  if (!company) return;
  company.Rejectedid = (company.Rejectedid || []).filter(id => id !== studentid);
}

export function addParticipartedid(companyid: string,studentid: string){
  const company = mockCompanies.find(company => company.id === companyid);
  if (!company) return;
  if (!company.partcipantsid) company.partcipantsid = [];
  if (!company.partcipantsid.includes(studentid)) company.partcipantsid.push(studentid);
}

export function removeParticipartedid(companyid: string,studentid: string){
  const company = mockCompanies.find(company => company.id === companyid);
  if (!company) return;
  company.partcipantsid = (company.partcipantsid || []).filter(id => id !== studentid);
}