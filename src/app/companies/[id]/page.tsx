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
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getProjectsByCompanyId, Company, Project } from '@/lib/mock';
import { createClient } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function CompanyDetailPage({ params }: Props) {
  const [company, setCompany] = useState<Company | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const searchParams = useSearchParams();
  const fromPage = searchParams.get('from');

  useEffect(() => {
    params.then(async ({ id }) => {
      console.log('Company page: Fetching data for id:', id);
      
      const supabase = createClient();
      
      try {
        // IDの妥当性チェック
        if (!id || typeof id !== 'string') {
          console.error('Invalid company ID:', id);
          notFound();
          return;
        }

        // Supabaseから企業データを取得
        console.log('Fetching company data for ID:', id);
        const { data: companyData, error: companyError } = await supabase
          .from('company')
          .select('*')
          .eq('id', id)
          .single();
          
        console.log('Supabase response - data:', companyData);
        console.log('Supabase response - error:', companyError);
        console.log('Has error:', !!companyError);
        console.log('Has data:', !!companyData);
          
        if (companyError) {
          console.error('Error fetching company:', companyError);
          console.error('Error details:', {
            message: companyError?.message || 'No message',
            details: companyError?.details || 'No details',
            hint: companyError?.hint || 'No hint',
            code: companyError?.code || 'No code',
            fullError: JSON.stringify(companyError)
          });

          // エラーが PGRST116 (行が見つからない) の場合は、データが存在しないことを意味する
          if (companyError.code === 'PGRST116') {
            console.log('Company not found (404), showing 404 page');
          } else {
            // その他のエラーの場合
            console.error('Database error occurred, details above');
          }

          notFound();
          return;
        }
        
        if (!companyData) {
          console.error('Company page: Company not found for ID:', id);
          notFound();
          return;
        }
        
        // company_applicationsテーブルから追加の企業情報を取得（企業名でマッチング）
        const { data: applicationData, error: applicationError } = await supabase
          .from('company_applications')
          .select('address, number_of_employees, year_of_establishment')
          .eq('company_name', companyData.name)
          .eq('application_status', 'approved')
          .single();

        if (applicationError) {
          console.log('No additional company data found in applications table for company:', companyData.name);
        } else {
          console.log('Application data found:', applicationData);
        }

        // Company型に変換
        const company: Company = {
          id: companyData.id,
          name: companyData.name,
          industry: companyData.industry,
          description: companyData.description,
          features: companyData.features || [],
          logo: companyData.logo || '',
          projects: companyData.projects || [],
          partcipantsid: companyData.partcipantsid || [],
          adoptedid: companyData.adoptedid || [],
          Rejectedid: companyData.Rejectedid || [],
          is_verified: companyData.is_verified || false,
          address: applicationData?.address || undefined,
          number_of_employees: applicationData?.number_of_employees || undefined,
          year_of_establishment: applicationData?.year_of_establishment || undefined,
        };
        
        // プロジェクトデータも取得（現時点ではモックデータをフォールバック）
        const projectsData = await getProjectsByCompanyId(id);
        
        console.log('Company page: Company data:', company);
        console.log('Company page: Address:', company.address);
        console.log('Company page: Employees:', company.number_of_employees);
        console.log('Company page: Establishment:', company.year_of_establishment);
        console.log('Company page: Projects data:', projectsData);
        
        setCompany(company);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching company data:', error);
        notFound();
      }
    });
  }, [params]);

  if (!company) {
    return <div>Loading...</div>;
  }

  const backHref = fromPage === 'students' ? '/students' : '/students';
  const backText = fromPage === 'students' ? '学生ページに戻る' : '学生ページに戻る';

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
        {/* 左カラム: 企業情報 */}
        <Box sx={{ flex: { xs: '1', md: '0 0 33%' } }}>
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
                      secondary={company.address || '情報なし'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="従業員数"
                      secondary={company.number_of_employees ? `${company.number_of_employees}名` : '情報なし'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="設立"
                      secondary={company.year_of_establishment || '情報なし'}
                    />
                  </ListItem>
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* アクションボタン */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        </Box>

        {/* 右カラム: 詳細情報 */}
        <Box sx={{ flex: '1' }}>
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
                          {project.skills.map((skill: string, index: number) => (
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
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      🏢 働く環境
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      フレックスタイム制、リモートワーク可能
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      📚 成長支援
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      研修制度、書籍購入補助
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      🎯 挑戦機会
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      新規事業への参画可能
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ⚖️ ワークライフ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      有休取得率90%以上
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