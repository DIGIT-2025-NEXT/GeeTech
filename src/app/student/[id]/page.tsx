'use client';

import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Box,
  IconButton,
  Paper,
  Breadcrumbs,
  Stack,
  Rating,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Chat as ChatIcon,
  Work as WorkIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { getStudentById, findChatByStudentId, type Student } from '@/lib/mock';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SkillIcon } from '@/app/_components/SkillIcon';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GridWorkaround = Grid as any;

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // スキル名からアイコン名へのマッピング
  const getSkillIconName = (skillName: string): string | null => {
    const skillToIconMap: { [key: string]: string } = {
      'HTML/CSS': 'html5',
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'React': 'react',
      'Vue.js': 'vuejs',
      'Angular': 'angular',
      'Next.js': 'nextjs',
      'Nuxt.js': 'nuxtjs',
      'Svelte': 'svelte',
      'Node.js': 'nodejs',
      'Express': 'express',
      'Python': 'python',
      'Django': 'django',
      'Flask': 'flask',
      'Go': 'go',
      'Ruby on Rails': 'rubyonrails',
      'PHP': 'php',
      'Laravel': 'laravel',
      'Java': 'java',
      'Spring': 'spring',
      'Swift': 'swift',
      'Kotlin': 'kotlin',
      'AWS': 'aws',
      'Google Cloud': 'googlecloud',
      'Azure': 'azure',
      'Docker': 'docker',
      'Kubernetes': 'kubernetes',
      'Terraform': 'terraform',
      'PostgreSQL': 'postgresql',
      'MySQL': 'mysql',
      'MongoDB': 'mongodb',
      'Redis': 'redis',
      'Prisma': 'prisma',
      'C++': 'cplusplus',
      'C#': 'csharp',
      'Rust': 'rust',
      'Unity': 'unity',
      'Unreal Engine': 'unrealengine',
      'TensorFlow': 'tensorflow',
      'PyTorch': 'pytorch',
      'GraphQL': 'graphql',
      'Supabase': 'supabase',
      'Firebase': 'firebase',
      'Git': 'git',
      'Figma': 'figma',
      'Storybook': 'storybook',
      'Jest': 'jest',
      'Flutter': 'flutter'
    };
    return skillToIconMap[skillName] || null;
  };

  // SkillIcon.tsxで利用可能なスキル一覧
  const availableSkills = [
    'HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
    'Node.js', 'Express', 'Python', 'Django', 'Flask', 'Go', 'Ruby on Rails', 'PHP', 'Laravel',
    'Java', 'Spring', 'Swift', 'Kotlin', 'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma', 'C++', 'C#', 'Rust', 'Unity', 'Unreal Engine',
    'TensorFlow', 'PyTorch', 'GraphQL', 'Supabase', 'Firebase', 'Git', 'Figma', 'Storybook', 'Jest', 'Flutter'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundStudent = getStudentById(studentId);
      setStudent(foundStudent || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [studentId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>読み込み中...</Typography>
      </Container>
    );
  }

  if (!student) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5">学生が見つかりませんでした</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.location.href = '/company'}
          sx={{ mt: 2 }}
        >
          学生一覧に戻る
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* パンくずリスト */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Typography 
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => window.location.href = '/'}
        >
          ホーム
        </Typography>
        <Typography 
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => window.location.href = '/company'}
        >
          学生一覧
        </Typography>
        <Typography color="text.primary">{student.name}さん</Typography>
      </Breadcrumbs>

      {/* 戻るボタン */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => window.location.href = '/company'}
        sx={{ mb: 3 }}
      >
        学生一覧に戻る
      </Button>

      {/* 学生プロフィールカード */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                mr: 3,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                border: '4px solid',
                borderColor: 'primary.light'
              }}
            >
              {student.name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {student.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">
                  {student.university}
                </Typography>
              </Box>
              <Rating value={Math.min(student.skills.length * 0.5, 5)} precision={0.5} readOnly />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 自己紹介 */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            自己紹介
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
          >
            {student.bio}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* スキル */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            スキル
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
            {student.skills.map((skill, index) => {
              const iconName = getSkillIconName(skill);
              return (
                <Chip
                  key={index}
                  icon={iconName ? <SkillIcon iconName={iconName} /> : undefined}
                  label={skill}
                  variant="filled"
                  sx={{ 
                    fontSize: '0.9rem',
                    mb: 1,
                    bgcolor: '#f5f5f5',
                    color: '#333',
                    fontWeight: 600,
                    height: 36,
                    border: '1px solid #e0e0e0',
                    '& .MuiChip-icon': {
                      fontSize: '18px',
                      marginLeft: '6px'
                    }
                  }}
                />
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* 連絡先・アクションエリア */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          アクション
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ChatIcon />}
              size="large"
              onClick={() => {
                // 学生IDからチャットを検索
                const existingChat = findChatByStudentId(studentId);
                if (existingChat) {
                  // 既存のチャットがあれば直接そのチャットページに遷移
                  window.location.href = `/chat/${existingChat.id}`;
                } else {
                  // 既存のチャットがなければチャット一覧ページに遷移
                  window.location.href = '/chat';
                }
              }}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                py: 1.5
              }}
            >
              メッセージを送る
            </Button>
          </Grid>
          <Grid xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<WorkIcon />}
              size="large"
              color="success"
              onClick={() => {
                alert(`${student.name}さんの採用検討機能は準備中です。`);
              }}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                py: 1.5
              }}
            >
              採用を検討
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 連絡先情報 */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          連絡先
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="body1">
              {student.name.split(' ').join('').toLowerCase()}@student.example.com
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="body1">
              090-XXXX-XXXX（企業側から連絡時のみ開示）
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinkedInIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="body1">
              LinkedIn（プラットフォーム経由で連絡可能）
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}