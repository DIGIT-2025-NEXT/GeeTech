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
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { applyToProject } from '@/lib/project-applications';
import { useNotifications } from '@/hooks/useNotifications';
import { createOrGetChatRoom } from '@/lib/chat-rooms';

interface Props {
  params: Promise<{ id: string }>;
}

export default function CompanyDetailPage({ params }: Props) {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const { sendNotification } = useNotifications();
  const searchParams = useSearchParams();
  const fromPage = searchParams.get('from');

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // ユーザー認証状態を取得
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchData();
  }, []);

  useEffect(() => {
    params.then(async ({ id }) => {
      console.log('Company page: Fetching data for id:', id);

      const supabase = createClient();
      
      try {
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
          console.error('Error fetching company:', {
            message: companyError.message,
            details: companyError.details,
            hint: companyError.hint,
            code: companyError.code
          });
          
          // エラーが PGRST116 (行が見つからない) の場合は、データが存在しないことを意味する
          if (companyError.code === 'PGRST116') {
            console.log('Company not found, showing 404');
          } else {
            // その他のエラーの場合
            console.error('Other database error occurred');
          }
          
          notFound();
          return;
        }
        
        if (!companyData) {
          console.error('Company page: Company not found for ID:', id);
          notFound();
          return;
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
        };
        
        // プロジェクトデータも取得（現時点ではモックデータをフォールバック）
        const projectsData = await getProjectsByCompanyId(id);
        
        console.log('Company page: Company data:', company);
        console.log('Company page: Projects data:', projectsData);
        
        setCompany(company);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching company data:', error);
        notFound();
      }
    });
  }, [params]);

  const handleApplyToProject = async (projectId: string, projectTitle: string) => {
    if (!user) {
      alert('応募するにはログインが必要です');
      return;
    }

    setIsLoading(prev => ({ ...prev, [projectId]: true }));

    try {
      const result = await applyToProject({
        project_id: projectId,
        user_id: user.id,
        status: 'pending'
      });

      if (result.success) {
        // チャットルームを作成または取得
        try {
          const chatResult = await createOrGetChatRoom(user.id, company?.id || '');

          if (chatResult.success && chatResult.roomId) {
            console.log('Chat room created/found:', chatResult.roomId);

            // 応募成功メッセージを表示後、チャットへ移動
            alert(`「${projectTitle}」への応募が完了しました！チャットページに移動します。`);

            // チャットページに移動
            router.push(`/chat/${chatResult.roomId}`);
          } else {
            console.error('Failed to create chat room:', chatResult.error);
            alert(`「${projectTitle}」への応募が完了しました！`);
          }
        } catch (chatError) {
          console.error('Chat room creation error:', chatError);
          alert(`「${projectTitle}」への応募が完了しました！`);
        }

        // 企業側に通知を送信
        try {
          const supabase = createClient();
          const { data: { user: currentUser } } = await supabase.auth.getUser();

          if (currentUser && company) {
            // プロフィール情報を取得
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, first_name')
              .eq('id', currentUser.id)
              .single();

            const applicantName = profile?.username || profile?.first_name || 'ユーザー';

            // 企業のuser_idを取得
            const { data: companyData } = await supabase
              .from('company')
              .select('user_id')
              .eq('id', company.id)
              .single();

            if (companyData?.user_id) {
              await sendNotification({
                recipient_id: companyData.user_id,
                title: `新しい応募: ${projectTitle}`,
                body: `${applicantName}さんがプロジェクト「${projectTitle}」に応募しました。ダッシュボードから確認できます。`,
                link: '/dashboard'
              });
              console.log('Notification sent to company');
            }
          }
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
          // 通知エラーは応募成功に影響させない
        }
      } else {
        alert(result.error || '応募に失敗しました');
      }
    } catch (error) {
      console.error('応募エラー:', error);
      alert('応募処理中にエラーが発生しました');
    } finally {
      setIsLoading(prev => ({ ...prev, [projectId]: false }));
    }
  };

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
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {project.is_without_recompense && (
                              <Chip
                                label="無償"
                                color="warning"
                                size="small"
                                variant="outlined"
                              />
                            )}
                            <Chip
                              label={project.status === 'active' ? '募集中' : 'クローズ'}
                              color={project.status === 'active' ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
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
                            disabled={project.status !== 'active' || isLoading[project.id] || !user}
                            onClick={() => handleApplyToProject(project.id, project.title)}
                          >
                            {isLoading[project.id] ? '応募中...' : 'このプロジェクトに応募'}
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