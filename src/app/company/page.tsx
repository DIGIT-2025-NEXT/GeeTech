// app/company/page.tsx - 学生一覧ページ
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
  Collapse,
} from '@mui/material';
import {
  Person as PersonIcon,
  Chat as ChatIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  TrendingUp as TrendingUpIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// 学生の型定義
type Student = {
  id: string;
  name: string;
  university: string;
  bio: string;
  skills: string[];
  avatar: string;
};

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.from('students').select('id, name, university, bio, skills, avatar');

      if (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } else {
        setStudents(data as Student[]);
        setFilteredStudents(data as Student[]);
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (universityFilter) {
      filtered = filtered.filter(student => student.university === universityFilter);
    }

    if (skillFilter) {
      filtered = filtered.filter(student =>
        student.skills?.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }

    setFilteredStudents(filtered);
    setDisplayCount(6);
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

  const universities = Array.from(new Set(students.map(s => s.university)));
  const allSkills = Array.from(new Set(students.flatMap(s => s.skills || [])));

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => window.location.href = '/'}>
            ホーム
          </Typography>
          <Typography color="text.primary">学生一覧</Typography>
        </Breadcrumbs>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          未来を担う才能たち
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          あなたの会社を次のレベルへ導く、優秀な学生を見つけよう。
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', mb: filterExpanded ? 2 : 0 }}
          onClick={() => setFilterExpanded(!filterExpanded)}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterIcon sx={{ mr: 1 }} />
            検索・フィルター
          </Typography>
          {filterExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        <Collapse in={filterExpanded}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="名前、自己紹介で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>大学で絞り込み</InputLabel>
                <Select value={universityFilter} label="大学で絞り込み" onChange={(e) => setUniversityFilter(e.target.value)}>
                  <MenuItem value="">すべて</MenuItem>
                  {universities.map((uni) => (<MenuItem key={uni} value={uni}>{uni}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>スキルで絞り込み</InputLabel>
                <Select value={skillFilter} label="スキルで絞り込み" onChange={(e) => setSkillFilter(e.target.value)}>
                  <MenuItem value="">すべて</MenuItem>
                  {allSkills.map((skill) => (<MenuItem key={skill} value={skill}>{skill}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {filteredStudents.length}人の学生が見つかりました
            </Typography>
            <Button variant="outlined" size="small" onClick={() => { setSearchQuery(''); setUniversityFilter(''); setSkillFilter(''); }}>
              フィルターをリセット
            </Button>
          </Box>
        </Collapse>
      </Paper>

      <Grid container spacing={3}>
        {filteredStudents.slice(0, displayCount).map((student, index) => (
          <Grid item xs={12} sm={6} lg={4} key={student.id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card sx={{ height: '420px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-8px)', boxShadow: 12 }, position: 'relative' }} elevation={3}>
                <IconButton sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }} size="small" onClick={() => toggleFavorite(student.id)}>
                  {favorites.has(student.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar src={student.avatar} alt={student.name} sx={{ width: 50, height: 50, mr: 2, border: '3px solid', borderColor: 'primary.light' }}>
                      {!student.avatar && student.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {student.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {student.university}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '60px' }}>
                    {student.bio}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      スキル
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {(student.skills || []).slice(0, 4).map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="filled" sx={{ fontSize: '0.75rem', mb: 0.5, bgcolor: '#e3f2fd', color: '#0d47a1', fontWeight: 500 }} />
                      ))}
                      {(student.skills || []).length > 4 && (
                        <Chip label={`+${(student.skills || []).length - 4}`} size="small" variant="outlined" color="default" sx={{ fontSize: '0.75rem', mb: 0.5 }} />
                      )}
                    </Stack>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                    <Button onClick={() => { window.location.href = `/student/${student.id}`; }} variant="contained" startIcon={<PersonIcon />} size="small" sx={{ flex: 1, textTransform: 'none', borderRadius: 2, fontWeight: 600 }}>
                      プロフィール
                    </Button>
                    <IconButton color="primary" onClick={() => { alert(`チャット機能は準備中です。`); }} sx={{ border: '2px solid', borderColor: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' } }} size="small">
                      <ChatIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {filteredStudents.length > displayCount && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large" onClick={() => setDisplayCount(prev => prev + 6)} sx={{ textTransform: 'none', borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, fontSize: '1rem' }}>
            もっと見る
          </Button>
        </Box>
      )}
      
      {displayCount > 6 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="text" size="small" onClick={() => setDisplayCount(6)}>
            折りたたむ
          </Button>
        </Box>
      )}

      {filteredStudents.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PersonIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            条件に合う学生が見つかりませんでした
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            検索条件を変更して、もう一度お試しください。
          </Typography>
          <Button variant="outlined" onClick={() => { setSearchQuery(''); setUniversityFilter(''); setSkillFilter(''); }}>
            フィルターをリセット
          </Button>
        </Box>
      )}
    </Container>
  );
}

function LoadingSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Skeleton variant="text" width="40%" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 4 }} />
      <Skeleton variant="rectangular" height={120} sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} lg={4} key={i}>
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
