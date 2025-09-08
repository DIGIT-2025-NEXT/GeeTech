// app/students/page.tsx - 企業一覧ページ（MUI版・改良版）
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
  Skeleton
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Chat as ChatIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  TrendingUp as TrendingUpIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getAllCompanies, type Company } from '@/lib/mock';
import { useState, useEffect } from 'react';

export default function StudentsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // シミュレートされたローディング
    const timer = setTimeout(() => {
      const allCompanies = getAllCompanies();
      setCompanies(allCompanies);
      setFilteredCompanies(allCompanies);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = companies;

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 業界フィルター
    if (industryFilter) {
      filtered = filtered.filter(company => company.industry.includes(industryFilter));
    }

    setFilteredCompanies(filtered);
  }, [searchQuery, industryFilter, companies]);

  const toggleFavorite = (companyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(companyId)) {
        newFavorites.delete(companyId);
      } else {
        newFavorites.add(companyId);
      }
      return newFavorites;
    });
  };

  const industries = Array.from(new Set(companies.map(c => c.industry)));

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ヘッダーセクション */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ホーム
          </Link>
          <Typography color="text.primary">企業一覧</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          革新的な企業たち
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          あなたの成長を支える、パートナー企業
        </Typography>
        <Typography variant="body1" color="text.secondary">
          北九州市で活躍する、革新的な企業とつながりましょう。
        </Typography>
      </Box>

      {/* 統計情報 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box sx={{ width: { xs: '50%', sm: '25%' }, minWidth: 120 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {companies.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              登録企業数
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ width: { xs: '50%', sm: '25%' }, minWidth: 120 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
              {industries.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              業界分野数
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ width: { xs: '50%', sm: '25%' }, minWidth: 120 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              12+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              募集案件数
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* 検索・フィルターセクション */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} />
          検索・フィルター
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: { xs: '100%', md: '50%' }, minWidth: 200 }}>
            <TextField
              fullWidth
              placeholder="企業名、業界、説明で検索..."
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
          </Box>
          <Box sx={{ width: { xs: '100%', md: '25%' }, minWidth: 150 }}>
            <FormControl fullWidth>
              <InputLabel>業界で絞り込み</InputLabel>
              <Select
                value={industryFilter}
                label="業界で絞り込み"
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                <MenuItem value="">すべて</MenuItem>
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredCompanies.length}件の企業が見つかりました
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSearchQuery('');
              setIndustryFilter('');
            }}
          >
            フィルターをリセット
          </Button>
        </Box>
      </Paper>

      {/* 企業一覧 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredCompanies.map((company, index) => (
          <Box key={company.id} sx={{ width: { xs: '100%', sm: '50%', lg: '33.33%' }, minWidth: 300 }}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card 
                sx={{ 
                  height: '100%',

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
                  onClick={() => toggleFavorite(company.id)}
                >
                  {favorites.has(company.id) ? 
                    <FavoriteIcon color="error" /> : 
                    <FavoriteBorderIcon />
                  }
                </IconButton>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* プロフィール部分 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        mr: 2,
                        bgcolor: 'primary.main',
                        fontSize: '1.8rem',
                        border: '3px solid',
                        borderColor: 'primary.light'
                      }}
                    >
                      {company.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {company.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BusinessIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {company.industry}
                        </Typography>
                      </Box>
                      <Rating value={4.5} precision={0.5} size="small" readOnly />
                    </Box>
                  </Box>

                  {/* 企業説明 */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.6
                    }}
                  >
                    {company.description}
                  </Typography>

                  {/* 業界タグ */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      業界
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      <Chip
                        label={company.industry}
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
                    </Stack>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* アクションボタン */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                    <Button
                      component={Link}
                      href={`/company/${company.id}`}
                      variant="contained"
                      startIcon={<BusinessIcon />}
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
          </Box>
        ))}
      </Box>

      {/* 空の状態 */}
      {filteredCompanies.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BusinessIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            条件に合う企業が見つかりませんでした
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            検索条件を変更して、もう一度お試しください。
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery('');
              setIndustryFilter('');
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
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ width: { xs: '50%', sm: '25%' }, minWidth: 120 }}>
            <Skeleton variant="rectangular" height={80} />
          </Box>
        ))}
      </Box>
      
      <Skeleton variant="rectangular" height={120} sx={{ mb: 4 }} />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Box key={i} sx={{ width: { xs: '100%', sm: '50%', lg: '33.33%' }, minWidth: 300 }}>
            <Card sx={{ height: 300 }}>
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
          </Box>
        ))}
      </Box>
    </Container>
  );
}