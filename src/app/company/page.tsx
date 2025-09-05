// app/company/page.tsx - 学生一覧ページ（MUI版・改良版）
'use client';

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Breadcrumbs,
  Fade,
  Stack,
  Rating,
  Divider,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Chat as ChatIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Code as CodeIcon,
  EmojiEvents as EmojiEventsIcon,
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  AutoAwesome as PsychologyIcon
} from '@mui/icons-material';
// import Link from 'next/link'; // 不要になったためコメントアウト
import { getAllStudents, type Student } from '@/lib/mock';
import { useState, useEffect } from 'react';

export default function CompanyPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    // シミュレートされたローディング
    const timer = setTimeout(() => {
      const allStudents = getAllStudents();
      setStudents(allStudents);
      setFilteredStudents(allStudents);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = students;

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 大学フィルター
    if (universityFilter) {
      filtered = filtered.filter(student => student.university.includes(universityFilter));
    }

    // スキルフィルター
    if (skillFilter) {
      filtered = filtered.filter(student =>
        student.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }

    setFilteredStudents(filtered);
  }, [searchQuery, universityFilter, skillFilter, students]);

  const toggleFavorite = (studentId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(studentId)) {
        newFavorites.delete(studentId);
      } else {
        newFavorites.add(studentId);
      }
      return newFavorites;
    });
  };

  const handleOpenStudentDetail = (student: Student) => {
    setSelectedStudent(student);
    setDetailModalOpen(true);
  };

  const handleCloseStudentDetail = () => {
    setSelectedStudent(null);
    setDetailModalOpen(false);
  };

  const universities = Array.from(new Set(students.map(s => s.university.split(' ')[0])));
  const allSkills = Array.from(new Set(students.flatMap(s => s.skills)));

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ヘッダーセクション */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography 
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => window.location.href = '/'}
          >
            ホーム
          </Typography>
          <Typography color="text.primary">学生一覧</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          才能あふれる学生たち
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          未来を創る、挑戦がここから始まる。
        </Typography>
        <Typography variant="body1" color="text.secondary">
          北九州市の大学で学ぶ、情熱ある学生たちとつながりましょう。
        </Typography>
      </Box>

      {/* 統計情報 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {students.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              登録学生数
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
              {universities.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              参加大学数
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {allSkills.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              スキル種類
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 検索・フィルターセクション */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} />
          検索・フィルター
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="学生名、スキル、自己紹介で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>大学で絞り込み</InputLabel>
              <Select
                value={universityFilter}
                label="大学で絞り込み"
                onChange={(e) => setUniversityFilter(e.target.value)}
              >
                <MenuItem value="">すべて</MenuItem>
                {universities.map((uni) => (
                  <MenuItem key={uni} value={uni}>{uni}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>スキルで絞り込み</InputLabel>
              <Select
                value={skillFilter}
                label="スキルで絞り込み"
                onChange={(e) => setSkillFilter(e.target.value)}
              >
                <MenuItem value="">すべて</MenuItem>
                {allSkills.slice(0, 10).map((skill) => (
                  <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredStudents.length}件の学生が見つかりました
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSearchQuery('');
              setUniversityFilter('');
              setSkillFilter('');
            }}
          >
            フィルターをリセット
          </Button>
        </Box>
      </Paper>

      {/* 学生一覧 */}
      <Grid container spacing={3}>
        {filteredStudents.map((student, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={student.id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card 
                sx={{ 
                  height: '420px', // 固定の高さを設定
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 12
                  },
                  position: 'relative'
                }}
                elevation={3}
              >
                {/* お気に入りボタン */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  size="small"
                  onClick={() => toggleFavorite(student.id)}
                >
                  {favorites.has(student.id) ? 
                    <FavoriteIcon color="error" /> : 
                    <FavoriteBorderIcon />
                  }
                </IconButton>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* プロフィール部分 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 2,
                        bgcolor: 'primary.main',
                        fontSize: '1.8rem',
                        border: '3px solid',
                        borderColor: 'primary.light'
                      }}
                    >
                      {student.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {student.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {student.university.length > 20 ? 
                            student.university.substring(0, 20) + '...' : 
                            student.university
                          }
                        </Typography>
                      </Box>
                      <Rating value={4.5} precision={0.5} size="small" readOnly />
                    </Box>
                  </Box>

                  {/* 自己紹介 */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.6,
                      minHeight: '48px' // 最小の高さを設定して揃える
                    }}
                  >
                    {student.bio}
                  </Typography>

                  {/* スキルタグ */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      主なスキル
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {student.skills.slice(0, 4).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="filled"
                          color="primary"
                          sx={{ 
                            fontSize: '0.75rem',
                            mb: 0.5,
                            bgcolor: 'primary.50',
                            color: 'primary.main',
                            fontWeight: 500
                          }}
                        />
                      ))}
                      {student.skills.length > 4 && (
                        <Chip
                          label={`+${student.skills.length - 4}`}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{ fontSize: '0.75rem', mb: 0.5 }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* アクションボタン */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                    <Button
                      onClick={() => {
                        // 詳細情報をモーダルで表示するか、他の処理を実行
                        alert(`${student.name}さんの詳細情報を表示する機能は準備中です。`);
                      }}
                      variant="contained"
                      startIcon={<PersonIcon />}
                      size="small"
                      sx={{ 
                        flex: 1,
                        textTransform: 'none',
                        borderRadius: 2,
                        fontWeight: 600
                      }}
                    >
                      詳細を見る
                    </Button>
                    <IconButton 
                      color="primary"
                      onClick={() => {
                        alert(`${student.name}さんとのチャット機能は準備中です。`);
                      }}
                      sx={{ 
                        border: '2px solid',
                        borderColor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white'
                        }
                      }}
                      size="small"
                    >
                      <ChatIcon />
                    </IconButton>
                    <IconButton 
                      color="success"
                      onClick={() => {
                        alert(`${student.name}さんの採用検討機能は準備中です。`);
                      }}
                      sx={{ 
                        border: '2px solid',
                        borderColor: 'success.main',
                        '&:hover': {
                          bgcolor: 'success.main',
                          color: 'white'
                        }
                      }}
                      size="small"
                    >
                      <WorkIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* 空の状態 */}
      {filteredStudents.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PersonIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            条件に合う学生が見つかりませんでした
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            検索条件を変更して、もう一度お試しください。
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery('');
              setUniversityFilter('');
              setSkillFilter('');
            }}
          >
            フィルターをリセット
          </Button>
        </Box>
      )}

      {/* CTAセクション */}
      <Paper 
        elevation={4} 
        sx={{ 
          mt: 6, 
          textAlign: 'center', 
          p: 4, 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white'
        }}
      >
        <TrendingUpIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          あなたも学生として参加しませんか？
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          地元企業との出会いが、あなたのキャリアを加速させます。
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            textTransform: 'none',
            borderRadius: 3,
            px: 4,
            py: 1.5,
            bgcolor: 'white',
            color: 'primary.main',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: 'grey.100'
            }
          }}
        >
          学生登録はこちら
        </Button>
      </Paper>
    </Container>
  );
}

function LoadingSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Skeleton variant="text" width="40%" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 4 }} />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3].map((i) => (
          <Grid size={{ xs: 12, sm: 4 }} key={i}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
      
      <Skeleton variant="rectangular" height={120} sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
            <Card sx={{ height: 420 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
                <Skeleton variant="text" height={80} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Skeleton variant="rounded" width={60} height={24} />
                  <Skeleton variant="rounded" width={80} height={24} />
                  <Skeleton variant="rounded" width={70} height={24} />
                </Box>
                <Skeleton variant="rectangular" height={40} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}