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
  CardActions,
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
  Business as BusinessIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  LocationOn as LocationIcon,
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
          注目のスタートアップ企業
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          北九州市から未来を創る企業たち
        </Typography>
        <Typography variant="body1" color="text.secondary">
          革新的なアイデアと技術で社会課題に挑む、北九州市のスタートアップ企業をご紹介します。
        </Typography>
      </Box>

      {/* 統計情報 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {companies.length}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              登録企業数
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
              {industries.length}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              業界数
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>
              24
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              募集プロジェクト
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
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              placeholder="企業名、業界、事業内容で検索..."
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
          <Grid size={{ xs: 12, md: 4 }}>
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
          </Grid>
        </Grid>

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
      <Grid container spacing={3}>
        {filteredCompanies.map((company, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={company.id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card 
                sx={{ 
                  height: '380px', // 固定の高さを設定
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
                  {/* 企業ヘッダー */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        bgcolor: 'secondary.main',
                        fontSize: '1.5rem'
                      }}
                    >
                      {company.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {company.name.length > 15 ? 
                          company.name.substring(0, 15) + '...' : 
                          company.name
                        }
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CategoryIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {company.industry}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <StarIcon />
                    </IconButton>
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
                      lineHeight: 1.6,
                      minHeight: '72px'
                    }}
                  >
                    {company.description}
                  </Typography>

                  {/* ステータス表示 */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label="募集中"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                    <Chip
                      label="急成長"
                      size="small"
                      color="warning"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Box>
                </CardContent>

                {/* アクションボタン */}
                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Button
                    component={Link}
                    href={`/company/${company.id}?from=students`}
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    size="small"
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      flexGrow: 1,
                      mr: 1
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
                    <WorkIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

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
          background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
          color: 'white'
        }}
      >
        <BusinessIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          あなたの企業も参加しませんか？
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          優秀な学生との出会いが、ビジネスを加速させます。
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
          企業登録はこちら
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
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      
      <Skeleton variant="rectangular" height={120} sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
            <Card sx={{ height: 380 }}>
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