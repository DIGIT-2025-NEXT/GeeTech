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
  id: number;
  companyName: string;
  status: "Reviewing" | "Accepted" | "Rejected";
};
// ---------------------

// ステータスに応じてChipの色を返すヘルパー関数
const getStatusChipColor = (status: "Reviewing" | "Accepted" | "Rejected") => {
  switch (status) {
    case "Accepted":
      return "success";
    case "Rejected":
      return "error";
    case "Reviewing":
    default:
      return "info";
  }
};

export default function Dashboard() {
  const router = useRouter();
  const { profile } = useProfile();
  const { notifications, markAsRead } = useNotifications();
  const { signOut } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (profile?.profile_type !== 'students') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/student-applications');
        if (response.ok) {
          const data = await response.json();
          setApplicationStatus(data);
        } else {
          console.error('Failed to fetch application status');
          setApplicationStatus([]);
        }
      } catch (error) {
        console.error('Error fetching application status:', error);
        setApplicationStatus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStatus();
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
                応募状況
              </Typography>
              <List sx={{ p: 0 }}>
                {profile?.profile_type === 'students' ? (
                  loading ? (
                    <ListItem>
                      <ListItemText primary="読み込み中..." />
                    </ListItem>
                  ) : applicationStatus.length > 0 ? (
                    applicationStatus.map((app, index) => (
                      <Box key={app.id}>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => router.push(`/applications/${app.id}`)}
                          >
                            <ListItemText
                              primary={app.companyName}
                              secondary={app.status}
                            />
                            <Chip
                              label={app.status}
                              color={getStatusChipColor(app.status)}
                              size="small"
                            />
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
                ) : (
                  <ListItem>
                    <ListItemText primary="学生のみ表示される機能です" />
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
