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
  Divider,
  Skeleton,
  Collapse
} from '@mui/material';
import {
  Business as BusinessIcon,
  Chat as ChatIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getAllCompanies, getAllProjects, type Company, type Project } from '@/lib/mock';
import { useState, useEffect } from 'react';
import { IndustryIcon } from '@/app/_components/IndustryIcon';

export default function StudentsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [featureFilter, setFeatureFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  useEffect(() => {
    // シミュレートされたローディング
    const timer = setTimeout(async () => {
      const allCompanies = await getAllCompanies();
      const allProjects = await getAllProjects();
      console.log('Company data from Supabase:', allCompanies);
      setCompanies(allCompanies);
      setFilteredCompanies(allCompanies);
      setProjects(allProjects);
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

    // 特徴フィルター
    if (featureFilter) {
      filtered = filtered.filter(company => 
        company.features && company.features.includes(featureFilter)
      );
    }

    setFilteredCompanies(filtered);
    setDisplayCount(5);
  }, [searchQuery, industryFilter, featureFilter, companies]);

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
  const features = Array.from(new Set(companies.flatMap(c => c.features || [])));
  const [projects, setProjects] = useState<Project[]>([]);

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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {companies.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              登録企業数
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
              {industries.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              業界分野数
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {projects.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              募集案件数
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 検索・フィルターセクション */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            mb: filterExpanded ? 2 : 0
          }}
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
            </Grid>
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>特徴で絞り込み</InputLabel>
                <Select
                  value={featureFilter}
                  label="特徴で絞り込み"
                  onChange={(e) => setFeatureFilter(e.target.value)}
                >
                  <MenuItem value="">すべて</MenuItem>
                  {features.map((feature) => (
                    <MenuItem key={feature} value={feature}>{feature}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {filteredCompanies.length}件の企業が見つかりました
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchQuery('');
                setIndustryFilter('');
                setFeatureFilter('');
              }}
            >
              フィルターをリセット
            </Button>
          </Box>
        </Collapse>
      </Paper>

      {/* 企業一覧 */}
      <Grid container spacing={3}>
        {filteredCompanies.slice(0, displayCount).map((company, index) => (
          <Grid item xs={12} sm={6} md={4} key={company.id}>
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

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  {/* プロフィール部分 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 1.5,
                        bgcolor: 'primary.main',
                        fontSize: '1.4rem',
                        border: '2px solid',
                        borderColor: 'primary.light'
                      }}
                    >
                      {company.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 'bold', mb: 0.3, lineHeight: 1.2 }}>
                        {company.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <IndustryIcon industry={company.industry} size={14} />
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2, fontSize: '0.8rem', ml: 0.3 }}>
                          {company.industry}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* 企業説明 */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3,
                      fontSize: '0.8rem'
                    }}
                  >
                    {company.description}
                  </Typography>

                  {/* 特徴タグ */}
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 0.5, display: 'block' }}>
                      特徴
                    </Typography>
                    <Stack direction="row" spacing={0.3} flexWrap="wrap">
                      {company.features?.slice(0, 3).map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          sx={{ 
                            fontSize: '0.65rem',
                            height: 20,
                            mb: 0.3,
                            fontWeight: 500
                          }}
                        />
                      ))}
                      {company.features && company.features.length > 3 && (
                        <Chip
                          label={`+${company.features.length - 3}`}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{ fontSize: '0.65rem', height: 20, mb: 0.3 }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Divider sx={{ mb: 1.5 }} />

                  {/* アクションボタン */}
                  <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'space-between' }}>
                    <Button
                      component={Link}
                      href={`/companies/${company.id}`}
                      variant="contained"
                      startIcon={<BusinessIcon sx={{ fontSize: 16 }} />}
                      size="small"
                      sx={{ 
                        flex: 1,
                        textTransform: 'none',
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 32,
                        px: 1.5
                      }}
                    >
                      詳細を見る
                    </Button>
                    <IconButton 
                      color="primary"
                      sx={{ 
                        border: '1.5px solid',
                        borderColor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white'
                        },
                        width: 32,
                        height: 32
                      }}
                      size="small"
                    >
                      <ChatIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton 
                      color="success"
                      sx={{ 
                        border: '1.5px solid',
                        borderColor: 'success.main',
                        '&:hover': {
                          bgcolor: 'success.main',
                          color: 'white'
                        },
                        width: 32,
                        height: 32
                      }}
                      size="small"
                    >
                      <WorkIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* もっと見る/折りたたむボタン */}
      {filteredCompanies.length > 5 && (
        <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          {filteredCompanies.length > displayCount && (
            <Button
              variant="outlined"
              size="large"
              onClick={() => setDisplayCount(prev => prev + 5)}
              sx={{
                textTransform: 'none',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              もっと見る
            </Button>
          )}
          {displayCount > 5 && (
            <Button
              variant="outlined"
              size="large"
              onClick={() => setDisplayCount(5)}
              sx={{
                textTransform: 'none',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              折りたたむ
            </Button>
          )}
        </Box>
      )}

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
              setFeatureFilter('');
            }}
          >
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
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Skeleton variant="rectangular" height={80} />
          </Grid>
        ))}
      </Grid>
      
      <Skeleton variant="rectangular" height={120} sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}