// app/students/[studentId]/page.tsx - 学生詳細ページ（MUI版・改良版）
'use client';

import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  Button,
  Box,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  LinearProgress,
  Breadcrumbs,
  Badge,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Alert
} from '@mui/material';
import { 
  Person as PersonIcon, 
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  DateRange as DateRangeIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  AutoAwesome as PsychologyIcon,
  EmojiEvents as EmojiEventsIcon,
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getStudentById } from "@/lib/mock";
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {
  params: Promise<{ studentId: string }>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function StudentDetailPage({ params }: Props) {
  const [studentId, setStudentId] = useState<string>('');
  const [student, setStudent] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setStudentId(p.studentId);
      const studentData = getStudentById(p.studentId);
      if (!studentData) {
        notFound();
      }
      setStudent(studentData);
    });
  }, [params]);

  if (!student) {
    return <div>Loading...</div>;
  }

  const skillsData = [
    { name: 'JavaScript', level: 85, category: 'プログラミング' },
    { name: 'React', level: 80, category: 'フレームワーク' },
    { name: 'HTML/CSS', level: 90, category: 'マークアップ' },
    { name: 'Figma', level: 75, category: 'デザイン' },
    { name: 'Node.js', level: 70, category: 'バックエンド' },
    { name: 'Python', level: 65, category: 'プログラミング' }
  ];

  const projectsData = [
    {
      title: 'ECサイトリニューアルプロジェクト',
      description: 'ユーザビリティを向上させるためのUI/UX改善',
      technologies: ['React', 'TypeScript', 'Material-UI'],
      status: '完了',
      date: '2024年12月'
    },
    {
      title: 'AIチャットボット開発',
      description: 'カスタマーサポート向けのインテリジェントボット',
      technologies: ['Python', 'TensorFlow', 'Flask'],
      status: '進行中',
      date: '2024年11月〜現在'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ブレッドクラム */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          ホーム
        </Link>
        <Link href="/students" style={{ textDecoration: 'none', color: 'inherit' }}>
          学生一覧
        </Link>
        <Typography color="text.primary">{student.name}</Typography>
      </Breadcrumbs>

      {/* 戻るボタン */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/students"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ textTransform: 'none' }}
        >
          学生一覧に戻る
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* 左サイドバー: プロフィール情報 */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* メインプロフィールカード */}
            <Card elevation={4} sx={{ mb: 3 }}>
              <Box 
                sx={{ 
                  height: 120,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  position: 'relative'
                }}
              >
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 64,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>

              <CardContent sx={{ textAlign: 'center', pt: 0 }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto',
                    mt: -6,
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    border: '4px solid white',
                    boxShadow: 3
                  }}
                >
                  {student.name.charAt(0)}
                </Avatar>
                
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {student.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1" color="text.secondary">
                    {student.university}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                  <Rating value={4.8} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    (4.8/5.0)
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
                  <Chip label="アクティブ" color="success" size="small" />
                  <Chip label="即戦力" color="primary" size="small" />
                  <Chip label="人気" color="warning" size="small" />
                </Stack>

                {/* 連絡先情報 */}
                <Divider sx={{ my: 3 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="所在地" secondary="北九州市小倉北区" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="連絡可能" secondary="チャット・メール" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DateRangeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="登録日" secondary="2024年10月" />
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                {/* ソーシャルリンク */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                  <IconButton color="primary">
                    <GitHubIcon />
                  </IconButton>
                  <IconButton color="primary">
                    <LinkedInIcon />
                  </IconButton>
                  <IconButton color="primary">
                    <LanguageIcon />
                  </IconButton>
                </Box>

                {/* アクションボタン */}
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<ChatIcon />}
                    size="large"
                    fullWidth
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 'bold'
                    }}
                  >
                    チャットを開始
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<WorkIcon />}
                    size="large"
                    fullWidth
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 'bold'
                    }}
                  >
                    採用を検討
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    size="large"
                    fullWidth
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      py: 1.5
                    }}
                  >
                    メールで連絡
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* クイック統計 */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  活動統計
                </Typography>
                <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      応募数
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                      8
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      面談数
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      234
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      閲覧数
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                      95%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      返信率
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* メインコンテンツエリア */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="概要" icon={<PersonIcon />} />
                <Tab label="スキル" icon={<CodeIcon />} />
                <Tab label="実績・経験" icon={<EmojiEventsIcon />} />
                <Tab label="プロジェクト" icon={<AssignmentIcon />} />
              </Tabs>
            </Box>

            {/* 概要タブ */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  自己紹介
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  この学生は過去30日間で15回プロフィールが閲覧されています
                </Alert>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', mb: 3 }}>
                  {student.bio}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                  現在、フロントエンド開発に特に力を入れており、ユーザーが直感的に使えるインターフェースの設計に情熱を注いでいます。
                  また、デザイン思考を取り入れた開発プロセスを学び、技術とデザインの両面からアプローチできる人材を目指しています。
                </Typography>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  学習・成長への取り組み
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PsychologyIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          学習姿勢
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        新しい技術に対する探究心が強く、常に最新のトレンドをキャッチアップしています。
                        オンライン学習プラットフォームを活用し、継続的なスキルアップを図っています。
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUpIcon sx={{ mr: 2, color: 'success.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          成長マインド
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        失敗を恐れずチャレンジする姿勢があり、フィードバックを積極的に求めて改善に活かしています。
                        チームワークを重視し、協力して成果を出すことを得意としています。
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* スキルタブ */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                スキル詳細
              </Typography>
              
              {/* 主要スキル */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  主要スキル
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                  {student.skills.map((skill: string, index: number) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="filled"
                      color="primary"
                      sx={{ 
                        fontSize: '0.9rem',
                        py: 2,
                        px: 1,
                        height: 'auto',
                        borderRadius: 2,
                        mb: 1
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* スキルレベル詳細 */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  スキルレベル詳細
                </Typography>
                <Grid container spacing={3}>
                  {skillsData.map((skill, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper elevation={1} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {skill.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {skill.level}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={skill.level} 
                          sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        />
                        <Chip 
                          label={skill.category} 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>

            {/* 実績・経験タブ */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                実績・経験
              </Typography>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    <EmojiEventsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    受賞歴・成果
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="九州学生ハッカソン 2024 最優秀賞"
                        secondary="地域課題解決をテーマにしたWebアプリケーション開発で受賞"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="大学プログラミングコンテスト 入賞"
                        secondary="アルゴリズム問題解決能力が評価され、上位3位入賞"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    インターン・アルバイト経験
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="スタートアップ企業でのフロントエンド開発インターン"
                        secondary="期間: 2024年8月〜10月 | React, TypeScriptを使用したWebアプリケーション開発に従事"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="ITコンサルティング会社でのアルバイト"
                        secondary="期間: 2024年4月〜7月 | 顧客向け資料作成とデータ分析業務をサポート"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </TabPanel>

            {/* プロジェクトタブ */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                プロジェクト実績
              </Typography>
              
              <Grid container spacing={3}>
                {projectsData.map((project, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {project.title}
                        </Typography>
                        <Chip 
                          label={project.status} 
                          color={project.status === '完了' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {project.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                          使用技術:
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {project.technologies.map((tech, techIndex) => (
                            <Chip 
                              key={techIndex}
                              label={tech} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        プロジェクト期間: {project.date}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}