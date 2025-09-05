// app/company/[companyId]/page.tsx - 企業詳細ページ（MUI版）
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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Category as CategoryIcon,
  ArrowBack as ArrowBackIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getCompanyById, getProjectsByCompanyId } from '@/lib/mock';
import { notFound } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {
  params: Promise<{ companyId: string }>;
}

export default function CompanyDetailPage({ params }: Props) {
  const [company, setCompany] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const searchParams = useSearchParams();
  const fromPage = searchParams.get('from');

  useEffect(() => {
    params.then(({ companyId }) => {
      setCompanyId(companyId);
      const companyData = getCompanyById(companyId);
      const projectsData = getProjectsByCompanyId(companyId);
      
      if (!companyData) {
        notFound();
      }
      
      setCompany(companyData);
      setProjects(projectsData);
    });
  }, [params]);

  if (!company) {
    return <div>Loading...</div>;
  }

  const backHref = fromPage === 'students' ? '/students' : '/company';
  const backText = fromPage === 'students' ? '学生ページに戻る' : '企業一覧に戻る';

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

      <Grid container spacing={4}>
        {/* 左カラム: 企業情報 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'secondary.main',
                  fontSize: '3rem'
                }}
              >
                {company.name.charAt(0)}
              </Avatar>
              
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {company.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <CategoryIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  {company.industry}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Chip
                  label="募集中"
                  color="success"
                  variant="filled"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label="急成長"
                  color="warning"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* 企業情報 */}
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="所在地" 
                      secondary="北九州市小倉北区" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="従業員数" 
                      secondary="15-30名" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="設立" 
                      secondary="2022年" 
                    />
                  </ListItem>
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* アクションボタン */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<WorkIcon />}
                  size="large"
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5
                  }}
                >
                  応募する
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
                  お問い合わせ
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 右カラム: 詳細情報 */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* 企業について */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  企業について
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                  {company.description}
                </Typography>
              </CardContent>
            </Card>

            {/* 募集中のプロジェクト */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    募集中のプロジェクト
                  </Typography>
                  <Chip 
                    label={`${projects.length}件`} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 2 }}
                  />
                </Box>

                {projects.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      現在募集中のプロジェクトはありません
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {projects.map((project) => (
                      <Paper key={project.id} elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {project.title}
                          </Typography>
                          <Chip 
                            label={project.status === 'active' ? '募集中' : 'クローズ'} 
                            color={project.status === 'active' ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {project.description}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {project.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            variant="contained"
                            size="small"
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                            disabled={project.status !== 'active'}
                          >
                            このプロジェクトに応募
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* 企業の特徴・福利厚生 */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  企業の特徴・福利厚生
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        🏢 働く環境
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        フレックスタイム制、リモートワーク可能
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        📚 成長支援
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        研修制度、書籍購入補助
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        🎯 挑戦機会
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        新規事業への参画可能
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ⚖️ ワークライフ
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        有休取得率90%以上
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}