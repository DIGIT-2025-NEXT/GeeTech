// app/page.tsx - ホームページ
'use client';

import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Stack,
  Avatar,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ヒーローセクション */}
      <Box 
        sx={{ 
          textAlign: 'center',
          mb: 8,
          py: 6,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          borderRadius: 4,
          color: 'white'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          GeeTech Platform
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          学生と企業をつなぐ、新しいマッチングプラットフォーム
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
          北九州市で活躍する企業と優秀な学生が出会い、共に成長する場所
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            component={Link}
            href="/students"
            variant="contained"
            size="large"
            startIcon={<SchoolIcon />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            学生を探す
          </Button>
          <Button
            component={Link}
            href="/company"
            variant="outlined"
            size="large"
            startIcon={<BusinessIcon />}
            sx={{
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            企業を探す
          </Button>
        </Stack>
      </Box>

      {/* 統計情報 */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              150+
            </Typography>
            <Typography variant="body1" color="text.secondary">
              登録学生数
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <BusinessIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              50+
            </Typography>
            <Typography variant="body1" color="text.secondary">
              参加企業数
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <WorkIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
              200+
            </Typography>
            <Typography variant="body1" color="text.secondary">
              マッチング成立数
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              95%
            </Typography>
            <Typography variant="body1" color="text.secondary">
              満足度
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 機能紹介 */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
          主な機能
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  学生プロフィール
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  スキル、経験、学習履歴を詳細に掲載。企業が求める人材を効率的に見つけられます。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <ChatIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  リアルタイムチャット
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  学生と企業が直接コミュニケーションを取り、プロジェクトや採用について相談できます。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <WorkIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  プロジェクトマッチング
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  企業のプロジェクトと学生のスキルを自動マッチング。最適な組み合わせを提案します。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* 注目の学生・企業 */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            注目の学生
          </Typography>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                  田
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    田中太郎
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    東京工業大学
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {['React', 'TypeScript', 'Node.js'].map((skill) => (
                    <Chip key={skill} label={skill} size="small" color="primary" />
                  ))}
                </Stack>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                フルスタックエンジニアを目指している大学3年生です。
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} href="/students/1" size="small" color="primary">
                詳細を見る
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            注目の企業
          </Typography>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'success.main' }}>
                  テ
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    テックソリューションズ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    IT・ソフトウェア
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                最先端のIT技術を活用したソリューションを提供する企業です。
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} href="/company/1" size="small" color="primary">
                詳細を見る
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* CTA */}
      <Paper 
        elevation={4} 
        sx={{ 
          textAlign: 'center', 
          p: 6,
          background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          今すぐ始めませんか？
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          GeeTechで新しい出会いと成長の機会を見つけましょう
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: 'white',
              color: 'warning.main',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            学生として登録
          </Button>
          <Button 
            variant="outlined"
            size="large"
            sx={{ 
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            企業として登録
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}