// app/company/page.tsx - 企業一覧ページ（MUI版・改良版）
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
import 
  Grid2 
  from '@mui/material/Unstable_Grid2';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Chat as ChatIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  TrendingUp as TrendingUpIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
// import Link from 'next/link'; // 不要になったためコメントアウト
import { getAllCompanies, type Company } from '@/lib/mock';
import { useState, useEffect } from 'react';
// SkillIcon is no longer needed as company features are not tied to specific icons
//  

export default function CompanyPage() {
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
    const fetchCompanies = async () => {
      setLoading(true);
      const allCompanies = await getAllCompanies();
      setCompanies(allCompanies);
      setFilteredCompanies(allCompanies);
      setLoading(false);
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    let filtered = companies;

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.features?.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 業界フィルター
    if (industryFilter) {
      filtered = filtered.filter(company => company.industry.includes(industryFilter));
    }

    // 特徴フィルター
    if (featureFilter) {
      filtered = filtered.filter(company =>
        company.features?.some(feature => feature.toLowerCase().includes(featureFilter.toLowerCase()))
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
  
  // Features are dynamic, so we'll collect them from the fetched companies
  const allFeatures = Array.from(new Set(companies.flatMap(c => c.features || [])));

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
          <Typography color="text.primary">企業一覧</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          革新的な企業たち
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          未来を創造するパートナーを見つけよう。
        </Typography>
        <Typography variant="body1" color="text.secondary">
          北九州市を拠点に活躍する、情熱ある企業とつながりましょう。
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
              参加業界数
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {allFeatures.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              特徴種類
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
                placeholder="企業名、説明、特徴で検索..."
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
                  {allFeatures.map((feature) => (
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
      <Grid container spacing={4}>
        {filteredCompanies.slice(0, displayCount).map((company, index) => (
          <Grid item xs={12} sm={6} lg={4} key={company.id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card 
                sx={{ 
                  height: '350px', // カードの高さを小さく変更
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

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  {/* プロフィール部分 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {company.logo ? (
                      <Avatar 
                        src={company.logo}
                        alt={company.name}
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          border: '2px solid',
                          borderColor: 'primary.light'
                        }}
                      />
                    ) : (
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem',
                          border: '2px solid',
                          borderColor: 'primary.light'
                        }}
                      >
                        {company.name.charAt(0)}
                      </Avatar>
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {company.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WorkIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {company.industry}
                        </Typography>
                      </Box>
                      <Rating value={Math.min((company.features?.length || 0) * 0.5, 5)} precision={0.5} size="small" readOnly />
                    </Box>
                  </Box>

                  {/* 説明 */}
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
                      lineHeight: 1.5,
                      minHeight: '40px' // 最小の高さを設定して揃える
                    }}
                  >
                    {company.description}
                  </Typography>

                  {/* 特徴タグ */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      主な特徴
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {(() => {
                        const displayFeatures = (company.features || []).slice(0, 4);
                        const remainingCount = (company.features || []).length - 4;
                        
                        return (
                          <>
                            {displayFeatures.map((feature, index) => (
                              <Chip
                                key={index}
                                label={feature}
                                size="small"
                                variant="filled"
                                sx={{ 
                                  fontSize: '0.75rem',
                                  mb: 0.5,
                                  bgcolor: '#f5f5f5',
                                  color: '#333',
                                  fontWeight: 500,
                                  border: '1px solid #e0e0e0',
                                }}
                              />
                            ))}
                            {remainingCount > 0 && (
                              <Chip
                                label={`+${remainingCount}`}
                                size="small"
                                variant="outlined"
                                color="default"
                                sx={{ fontSize: '0.75rem', mb: 0.5 }}
                              />
                            )}
                          </>
                        );
                      })()}
                    </Stack>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* アクションボタン */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                    <Button
                      onClick={() => {
                        window.location.href = `/company/${company.id}`;
                      }}
                      variant="contained"
                      startIcon={<WorkIcon />}
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
                        alert(`チャット機能は準備中です。`);
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
                        alert(`${company.name}への応募機能は準備中です。`);
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
                      <PersonIcon />
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
          <WorkIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
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
          あなたの企業も参加しませんか？
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          優秀な学生との出会いが、あなたの事業を加速させます。
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => window.location.href = '/company/register'}
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
          <Grid item xs={12} sm={4} key={i}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
      
      <Skeleton variant="rectangular" height={120} sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} lg={4} key={i}>
            <Card sx={{ height: 350 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
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
