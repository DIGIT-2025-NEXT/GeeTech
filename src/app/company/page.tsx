// app/company/page.tsx - 学生一覧ページ
"use client";

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
  Collapse,
} from "@mui/material";
import {
  Person as PersonIcon,
  Chat as ChatIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

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
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [creatingChat, setCreatingChat] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("students")
        .select("id, name, university, bio, skills, avatar");

      if (error) {
        console.error("Error fetching students:", error);
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
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (universityFilter) {
      filtered = filtered.filter(
        (student) => student.university === universityFilter
      );
    }

    if (skillFilter) {
      filtered = filtered.filter((student) =>
        student.skills?.some((skill) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    setFilteredStudents(filtered);
    setDisplayCount(6);
  }, [searchQuery, universityFilter, skillFilter, students]);

  const toggleFavorite = (studentId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(studentId)) {
        newFavorites.delete(studentId);
      } else {
        newFavorites.add(studentId);
      }
      return newFavorites;
    });
  };

  const createChatRoom = async (studentId: string) => {
    if (!user) {
      alert('チャット機能を利用するにはログインが必要です。');
      return;
    }

    setCreatingChat(studentId);

    try {
      // 企業IDを取得
      const supabase = createClient();
      const { data: company, error: companyError } = await supabase
        .from('company')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (companyError || !company) {
        console.error('Company not found:', companyError);
        alert('企業情報の取得に失敗しました。');
        return;
      }

      const response = await fetch('/api/chat/room/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,
          companyId: company.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const roomId = data.room.id;

        if (data.existed) {
          // 既存のチャットルームに移動
          window.location.href = `/chat/${roomId}`;
        } else {
          // 新しく作成されたチャットルームに移動
          window.location.href = `/chat/${roomId}`;
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to create chat room:', errorData);
        alert('チャットルームの作成に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
      alert('チャットルームの作成中にエラーが発生しました。');
    } finally {
      setCreatingChat(null);
    }
  };

  const universities = Array.from(new Set(students.map((s) => s.university)));
  const allSkills = Array.from(
    new Set(students.flatMap((s) => s.skills || []))
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ヘッダーセクション */}
      <Box sx={{ mb: 6 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Typography
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => (window.location.href = "/")}
          >
            ホーム
          </Typography>
          <Typography color="text.primary">学生一覧</Typography>
        </Breadcrumbs>


        {/* 統計情報 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h4" color="#000000" sx={{ fontWeight: 'bold' }}>
                {students.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                登録学生数
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h4" color="#333333" sx={{ fontWeight: 'bold' }}>
                {Array.from(new Set(students.map(s => s.university))).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                提携大学数
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h4" color="#666666" sx={{ fontWeight: 'bold' }}>
                {Array.from(new Set(students.flatMap(s => s.skills || []))).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                スキル分野数
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 検索・フィルターセクション */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#000000' }}>
          学生を探す
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="名前、大学、スキルで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>大学で絞り込み</InputLabel>
              <Select
                value={universityFilter}
                label="大学で絞り込み"
                onChange={(e) => setUniversityFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">すべての大学</MenuItem>
                {universities.map((uni) => (
                  <MenuItem key={uni} value={uni}>
                    {uni}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>スキルで絞り込み</InputLabel>
                <Select
                  value={skillFilter}
                  label="スキルで絞り込み"
                  onChange={(e) => setSkillFilter(e.target.value)}
                >
                  <MenuItem value="">すべて</MenuItem>
                  {allSkills.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
          <Typography variant="body1" color="text.secondary">
            {filteredStudents.length}人の学生が見つかりました
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              label={`表示中: ${Math.min(displayCount, filteredStudents.length)}/${filteredStudents.length}`}
              sx={{ bgcolor: '#f5f5f5', color: '#000000' }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchQuery("");
                setUniversityFilter("");
                setSkillFilter("");
              }}
              sx={{
                borderColor: '#666666',
                color: '#666666',
                '&:hover': {
                  borderColor: '#000000',
                  color: '#000000'
                }
              }}
            >
              リセット
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {filteredStudents.slice(0, displayCount).map((student, index) => (
          <Grid item xs={12} sm={6} lg={4} key={student.id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card
                sx={{
                  height: "420px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": { transform: "translateY(-8px)", boxShadow: 12 },
                  position: "relative",
                }}
                elevation={3}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    bgcolor: "white",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  size="small"
                  onClick={() => toggleFavorite(student.id)}
                >
                  {favorites.has(student.id) ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      src={student.avatar}
                      alt={student.name}
                      sx={{
                        width: 50,
                        height: 50,
                        mr: 2,
                        border: "3px solid",
                        borderColor: "#333333",
                      }}
                    >
                      {!student.avatar && student.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {student.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <SchoolIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {student.university}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "60px",
                    }}
                  >
                    {student.bio}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      スキル
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {(student.skills || [])
                        .slice(0, 4)
                        .map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="filled"
                            sx={{
                              fontSize: "0.75rem",
                              mb: 0.5,
                              bgcolor: "#e3f2fd",
                              color: "#0d47a1",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      {(student.skills || []).length > 4 && (
                        <Chip
                          label={`+${(student.skills || []).length - 4}`}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{ fontSize: "0.75rem", mb: 0.5 }}
                        />
                      )}
                    </Stack>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        window.location.href = `/student/${student.id}`;
                      }}
                      variant="contained"
                      startIcon={<PersonIcon />}
                      size="small"
                      sx={{
                        flex: 1,
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      プロフィール
                    </Button>
                    <IconButton
                      color="default"
                      onClick={() => createChatRoom(student.id)}
                      disabled={creatingChat === student.id}
                      sx={{
                        border: "2px solid",
                        borderColor: "#000000",
                        "&:hover": { bgcolor: "#000000", color: "white" },
                      }}
                      size="small"
                    >
                      {creatingChat === student.id ? (
                        <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              border: '2px solid',
                              borderColor: '#000000',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                              }
                            }}
                          />
                        </Box>
                      ) : (
                        <ChatIcon />
                      )}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {filteredStudents.length > displayCount && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setDisplayCount((prev) => prev + 6)}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            もっと見る
          </Button>
        </Box>
      )}

      {displayCount > 6 && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => setDisplayCount(6)}
          >
            折りたたむ
          </Button>
        </Box>
      )}

      {filteredStudents.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <PersonIcon sx={{ fontSize: 100, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            条件に合う学生が見つかりませんでした
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            検索条件を変更して、もう一度お試しください。
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery("");
              setUniversityFilter("");
              setSkillFilter("");
            }}
          >
            フィルターをリセット
          </Button>
        </Box>
      )}

      {/* 企業向けCTAセクション */}
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          textAlign: "center",
          p: 6,
          background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
          color: "white",
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          '&::before': {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }
        }}
      >
        <TrendingUpIcon sx={{ fontSize: 80, mb: 3, position: "relative", zIndex: 1 }} />
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            position: "relative",
            zIndex: 1,
            mb: 2
          }}
        >
          あなたの企業も参加しませんか？
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            opacity: 0.9,
            position: "relative",
            zIndex: 1,
            maxWidth: "600px",
            mx: "auto"
          }}
        >
          優秀な学生との出会いが、あなたの事業を加速させます。
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => (window.location.href = "/register")}
          startIcon={<BusinessIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 5,
            py: 2,
            bgcolor: "white",
            color: "#000000",
            fontWeight: "bold",
            fontSize: "1.2rem",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 4px 20px rgba(255,255,255,0.3)",
            "&:hover": {
              bgcolor: "grey.100",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 30px rgba(255,255,255,0.4)",
            },
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
      <Skeleton variant="rectangular" height={120} sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} lg={4} key={i}>
            <Card sx={{ height: 420 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Skeleton
                    variant="circular"
                    width={60}
                    height={60}
                    sx={{ mr: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
                <Skeleton variant="text" height={80} sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
