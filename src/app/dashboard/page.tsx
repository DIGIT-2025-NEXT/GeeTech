"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// MUI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  ListItemButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Tables } from "@/lib/types_db";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";

type Notification = Tables<"notifications">;

type ApplicationStatus = {
  id: string;
  projectTitle?: string;
  companyName: string;
  status: "pending" | "approved" | "rejected";
  appliedAt?: string;
  type: "project";
};

type CompanyApplication = {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  applicantName: string;
  applicantEmail?: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  statusUpdatedAt?: string;
};
// ---------------------

// ステータスに応じてChipの色を返すヘルパー関数
const getStatusChipColor = (status: "pending" | "approved" | "rejected") => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "pending":
    default:
      return "info";
  }
};

// ステータスの表示テキストを返すヘルパー関数
const getStatusText = (status: "pending" | "approved" | "rejected") => {
  switch (status) {
    case "pending":
      return "審査中";
    case "approved":
      return "承認";
    case "rejected":
      return "不承認";
    default:
      return status;
  }
};

export default function Dashboard() {
  const router = useRouter();
  const { profile } = useProfile();
  const { notifications, markAsRead } = useNotifications();
  const { signOut } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus[]>([]);
  const [companyApplications, setCompanyApplications] = useState<CompanyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      setLoading(true);

      if (profile.profile_type === 'students') {
        // 学生の場合：応募履歴を取得
        try {
          console.log('Fetching applications for student:', profile.id);
          const response = await fetch('/api/student-applications');
          console.log('Response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Student applications data:', data);
            setApplicationStatus(data);
          } else {
            const errorData = await response.text();
            console.error('Failed to fetch student applications:', response.status, errorData);
            setApplicationStatus([]);
          }
        } catch (error) {
          console.error('Error fetching student applications:', error);
          setApplicationStatus([]);
        }
      } else if (profile.profile_type === 'company') {
        // 企業の場合：自社プロジェクトへの応募を取得
        try {
          console.log('Fetching company applications for:', profile.id);
          const response = await fetch('/api/company-applications');
          console.log('Response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Company applications data:', data);
            setCompanyApplications(data);
          } else {
            const errorData = await response.text();
            console.error('Failed to fetch company applications:', response.status, errorData);
            setCompanyApplications([]);
          }
        } catch (error) {
          console.error('Error fetching company applications:', error);
          setCompanyApplications([]);
        }
      }

      setLoading(false);
    };

    if (profile) {
      fetchData();
    }
  }, [profile]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));

    try {
      const response = await fetch(`/api/company-applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Status update result:', result);

        // ローカル状態を更新
        setCompanyApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status: newStatus, statusUpdatedAt: new Date().toISOString() }
              : app
          )
        );

        alert(result.message || 'ステータスを更新しました');
      } else {
        const errorData = await response.json();
        console.error('Failed to update status:', errorData);
        alert(errorData.error || 'ステータスの更新に失敗しました');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('ステータスの更新中にエラーが発生しました');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        ダッシュボード
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
        }}
      >
        {/* 左カラム: プロフィール & クイックアクション */}
        <Box sx={{ width: { xs: "100%", lg: "25%" }, display: "flex" }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Stack alignItems="center" spacing={2} sx={{ p: 2 }}>
                <Avatar
                  sx={{ width: 80, height: 80, mb: 1, bgcolor: "primary.main" }}
                  src={profile?.avatar_url || undefined}
                >
                  {profile?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6">{profile?.username}</Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mb: 2 }}
                >
                  {profile?.email}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => router.push("/profile/edit")}
                  fullWidth
                >
                  プロフィールを編集
                </Button>
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Stack spacing={2}>
                {profile?.profile_type === "company" ? (
                  <Button
                    variant="outlined"
                    href="/company"
                    startIcon={<BusinessIcon />}
                  >
                    学生を探す
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    href="/students"
                    startIcon={<SearchIcon />}
                  >
                    企業を探す
                  </Button>
                )}
                <Button
                  variant="outlined"
                  href="/chat"
                  startIcon={<EmailIcon />}
                >
                  メッセージを確認
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  ログアウト
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* 中央カラム: 応募状況 */}
        <Box sx={{ width: { xs: "100%", lg: "45%" }, display: "flex" }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {profile?.profile_type === 'students' ? '応募状況' : '応募管理'}
              </Typography>
              <List sx={{ p: 0 }}>
                {loading ? (
                  <ListItem>
                    <ListItemText primary="読み込み中..." />
                  </ListItem>
                ) : profile?.profile_type === 'students' ? (
                  applicationStatus.length > 0 ? (
                    applicationStatus.map((app, index) => (
                      <Box key={app.id}>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemText
                              primary={
                                <Box>
                                  <Typography variant="subtitle2" component="span">
                                    {app.companyName}
                                  </Typography>
                                  {app.projectTitle && (
                                    <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mt: 0.5 }}>
                                      プロジェクト: {app.projectTitle}
                                    </Typography>
                                  )}
                                </Box>
                              }
                              secondary={
                                app.appliedAt ? `応募日: ${new Date(app.appliedAt).toLocaleDateString('ja-JP')}` : undefined
                              }
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={getStatusText(app.status)}
                                color={getStatusChipColor(app.status)}
                                size="small"
                              />
                              <Chip
                                label="プロジェクト"
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </Box>
                          </ListItemButton>
                        </ListItem>
                        {index < applicationStatus.length - 1 && (
                          <Divider component="li" />
                        )}
                      </Box>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="応募履歴がありません" />
                    </ListItem>
                  )
                ) : profile?.profile_type === 'company' ? (
                  companyApplications.length > 0 ? (
                    companyApplications.map((app, index) => (
                      <Box key={app.id}>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemText
                              primary={
                                <Box>
                                  <Typography variant="subtitle2" component="span">
                                    {app.applicantName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mt: 0.5 }}>
                                    プロジェクト: {app.projectTitle}
                                  </Typography>
                                  {app.applicantEmail && (
                                    <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block' }}>
                                      {app.applicantEmail}
                                    </Typography>
                                  )}
                                </Box>
                              }
                              secondary={
                                `応募日: ${new Date(app.appliedAt).toLocaleDateString('ja-JP')}`
                              }
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                              <Chip
                                label={getStatusText(app.status)}
                                color={getStatusChipColor(app.status)}
                                size="small"
                              />
                              {app.status === 'pending' && (
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleUpdateApplicationStatus(app.id, 'approved')}
                                    disabled={updatingStatus[app.id]}
                                    sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                                  >
                                    採用
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                                    disabled={updatingStatus[app.id]}
                                    sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                                  >
                                    不採用
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          </ListItemButton>
                        </ListItem>
                        {index < companyApplications.length - 1 && (
                          <Divider component="li" />
                        )}
                      </Box>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="応募がありません" />
                    </ListItem>
                  )
                ) : (
                  <ListItem>
                    <ListItemText primary="ユーザータイプが不明です" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* 右カラム: 通知 */}
        <Box sx={{ width: { xs: "100%", lg: "30%" }, display: "flex" }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                通知
              </Typography>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  p: 0,
                  maxHeight: 400,
                  overflowY: "auto",
                }}
              >
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <Box key={notification.id}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => handleNotificationClick(notification)}
                          sx={{
                            backgroundColor: notification.is_read
                              ? "transparent"
                              : "#f0f8ff",
                            alignItems: "flex-start",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{ bgcolor: "secondary.main" }}
                              src={notification.icon_url || undefined}
                            >
                              <NotificationsIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={notification.title}
                            secondary={new Date(
                              notification.created_at || ""
                            ).toLocaleString("ja-JP")}
                            primaryTypographyProps={{
                              fontWeight: notification.is_read
                                ? "normal"
                                : "bold",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                      {index < notifications.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </Box>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="新しい通知はありません" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
