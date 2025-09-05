// app/company/dashboard/page.tsx - 企業ダッシュボード（MUI版）
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  WorkOutline as WorkOutlineIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getAllStudents, getAllProjects } from '@/lib/mock';

export default async function CompanyDashboard() {
  const students = getAllStudents().slice(0, 3); // 注目の学生3名
  const projects = getAllProjects(); // すべてのプロジェクト

  // 会社情報（実際にはログインした会社の情報を取得）
  const company = {
    id: "1",
    name: "株式会社 未来創造",
    industry: "AI・地域活性化",
    description: "私たちはAI技術を駆使して、北九州市の地域課題解決に取り組むスタートアップです。"
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          企業ダッシュボード
        </Typography>
        <Typography variant="body1" color="text.secondary">
          プロジェクト管理と学生との出会いを効果的に進めましょう
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 左サイドバー: 企業情報と管理メニュー */}
        <Grid item xs={12} lg={3}>
          {/* 企業プロフィール */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'secondary.main',
                  fontSize: '2rem'
                }}
              >
                {company.name.charAt(0)}
              </Avatar>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {company.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {company.industry}
              </Typography>

              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<EditIcon />}
                sx={{ textTransform: 'none' }}
              >
                企業情報を編集
              </Button>
            </CardContent>
          </Card>

          {/* クイック統計 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                統計情報
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="プロジェクト数" 
                    secondary="3件（2件募集中）" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="応募者数" 
                    secondary="12名" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="閲覧数" 
                    secondary="156回（今月）" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* メインコンテンツエリア */}
        <Grid item xs={12} lg={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* プロジェクト管理セクション */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    プロジェクト管理
                  </Typography>
                  <Button 
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    新規プロジェクトを掲載
                  </Button>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>プロジェクト名</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>ステータス</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>応募数</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>アクション</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {project.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              {project.skills.slice(0, 2).map((skill, index) => (
                                <Chip 
                                  key={index}
                                  label={skill} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={project.status === 'active' ? '募集中' : 'クローズ'} 
                              color={project.status === 'active' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {Math.floor(Math.random() * 10) + 1}名
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" color="primary">
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton size="small" color="default">
                                <EditIcon />
                              </IconButton>
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* 注目の学生セクション */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    注目の学生
                  </Typography>
                  <Button 
                    component={Link}
                    href="/students"
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    すべて見る
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {students.map((student) => (
                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              mr: 1.5,
                              bgcolor: 'primary.main',
                              fontSize: '1rem'
                            }}
                          >
                            {student.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {student.university.split(' ')[0]}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
                          {student.skills.slice(0, 2).map((skill, index) => (
                            <Chip 
                              key={index}
                              label={skill} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            component={Link}
                            href={`/students/${student.id}`}
                            size="small" 
                            variant="outlined"
                            sx={{ textTransform: 'none', flex: 1 }}
                          >
                            詳細
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained"
                            sx={{ textTransform: 'none' }}
                          >
                            採用検討
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* 最近のアクティビティ */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  最近のアクティビティ
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="田中太郎さんが「UI/UXデザインインターン」に応募しました"
                      secondary="2時間前"
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="「地域密着型マーケティングアシスタント」プロジェクトを公開しました"
                      secondary="1日前"
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <WorkOutlineIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="山田花子さんを採用候補リストに追加しました"
                      secondary="3日前"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}