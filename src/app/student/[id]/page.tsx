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
  Grid,
} from '@mui/material';
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
import { getStudentById, type Student } from '@/lib/mock';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

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
              <Rating value={4.5} precision={0.5} readOnly />
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
            スキル・得意分野
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
            {student.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                variant="filled"
                color="primary"
                sx={{ 
                  fontSize: '0.9rem',
                  mb: 1,
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  fontWeight: 600,
                  height: 36
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* 連絡先・アクションエリア */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          アクション
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ChatIcon />}
              size="large"
              onClick={() => {
                alert(`${student.name}さんとのチャット機能は準備中です。`);
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
          <Grid item xs={12} sm={6}>
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