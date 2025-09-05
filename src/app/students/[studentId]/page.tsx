// app/students/[studentId]/page.tsx - 学生詳細ページ（MUI版）
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
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getStudentById, Student } from '@/lib/mock';
import { notFound } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {
  params: Promise<{ studentId: string }>;
}

export default function StudentDetailPage({ params }: Props) {
  const [student, setStudent] = useState<Student | null>(null);
  const searchParams = useSearchParams();
  const fromPage = searchParams.get('from');

  useEffect(() => {
    params.then(({ studentId }) => {
      const studentData = getStudentById(studentId);
      
      if (!studentData) {
        notFound();
      }
      
      setStudent(studentData);
    });
  }, [params]);

  if (!student) {
    return <div>Loading...</div>;
  }

  const backHref = fromPage === 'company' ? '/company' : '/students';
  const backText = fromPage === 'company' ? '企業ページに戻る' : '学生一覧に戻る';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 戻るボタン */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href={backHref}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ textTransform: 'none' }}
        >
          {backText}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* 左カラム: 学生情報 */}
        <Box sx={{ flex: { xs: '1', md: '0 0 33%' } }}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {student.name.charAt(0)}
              </Avatar>
              
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {student.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <SchoolIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  {student.university}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* アクションボタン */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  size="large"
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5
                  }}
                >
                  チャットする
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<WorkIcon />}
                  size="large"
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5
                  }}
                >
                  プロジェクト提案
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  size="large"
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5
                  }}
                >
                  メール送信
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 右カラム: 詳細情報 */}
        <Box sx={{ flex: '1' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* 自己紹介 */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  自己紹介
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                  {student.bio}
                </Typography>
              </CardContent>
            </Card>

            {/* スキルセット */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  スキルセット
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {student.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      color="primary"
                      sx={{ fontSize: '0.9rem', py: 2 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* その他の情報 */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  その他の情報
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      🎯 志向性
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      新しい技術への挑戦
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      📚 学習スタイル
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      実践重視
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      🌟 得意分野
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      フロントエンド開発
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ⏰ 稼働可能時間
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      週20時間程度
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}