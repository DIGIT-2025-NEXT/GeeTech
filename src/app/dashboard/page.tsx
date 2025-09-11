"use client";

import { useRouter } from "next/navigation";

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
import { useProfile } from "@/hooks/useProfile";

const dummyNotifications = [
  {
    id: 1,
    icon: <BusinessIcon />,
    primary: "株式会社TechCorpからスカウトが届きました",
    secondary: "2時間前",
  },
  {
    id: 2,
    icon: <EmailIcon />,
    primary: "株式会社Innovateからメッセージがあります",
    secondary: "昨日",
  },
  {
    id: 3,
    icon: <NotificationsIcon />,
    primary: "新しいスキル「AI」が追加されました",
    secondary: "3日前",
  },
];

const dummyApplicationStatus: {
  id: number;
  companyName: string;
  status: "Reviewing" | "Accepted" | "Rejected";
}[] = [
  {
    id: 1,
    companyName: "株式会社TechCorp",
    status: "Reviewing",
  },
  {
    id: 2,
    companyName: "株式会社Innovate",
    status: "Accepted",
  },
  {
    id: 3,
    companyName: "株式会社FutureWeb",
    status: "Rejected",
  },
  {
    id: 4,
    companyName: "株式会社NextGen Solutions",
    status: "Reviewing",
  },
];
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
                <Button variant="outlined" startIcon={<EmailIcon />}>
                  メッセージを確認
                </Button>
                <Button variant="outlined" startIcon={<LogoutIcon />}>
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
                {dummyApplicationStatus.map((app, index) => (
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
                    {index < dummyApplicationStatus.length - 1 && (
                      <Divider component="li" />
                    )}
                  </Box>
                ))}
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
              <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
                {dummyNotifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() =>
                          router.push(`/notifications/${notification.id}`)
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "secondary.main" }}>
                            {notification.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={notification.primary}
                          secondary={notification.secondary}
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < dummyNotifications.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
