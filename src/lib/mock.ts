// lib/mock.ts - Mock data for events and students
import { createClient } from './supabase/client'
import type { Tables } from './types_db'

export type Event = Tables<'events'>;

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


export async function getNext10(): Promise<Event[]> {
  const supabase = createClient()
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('starts_on', { ascending: true })
    .limit(10)

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  const now = new Date();
  return events.filter(event => new Date(event.starts_on) >= now);
}

export function getAllStudents(): Student[] {
  return mockStudents;
}

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
      { speaker: "student", chattext: "権限ごとにUIを最適化して提案します。", chattime: "2025-09-07 15:15" }
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

export async function getAllCompanies(): Promise<Company[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('company').select('*');

  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }

  // Ensure the fetched data matches the Company type
  return data.map((company: any) => ({
    id: company.id,
    name: company.name,
    industry: company.industry,
    description: company.description,
    features: company.features || [],
    logo: company.logo || '',
    projects: company.projects || [],
    partcipantsid: company.partcipantsid || [],
    adoptedid: company.adoptedid || [],
    Rejectedid: company.Rejectedid || [], // Use Rejectedid as per the interface
  }));
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