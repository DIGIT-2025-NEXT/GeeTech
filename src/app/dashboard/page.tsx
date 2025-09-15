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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { Tables } from "@/lib/types_db";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { createOrGetChatRoom } from "@/lib/chat-rooms";
import { createClient } from "@/lib/supabase/client";

type Notification = Tables<"notifications">;

type ApplicationStatus = {
  id: string;
  projectTitle?: string;
  companyName: string;
  companyId?: string;
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

type LikedCompany = {
  id: string;
  name: string;
  industry: string;
  description: string;
  features?: string[];
  logo?: string;
  is_verified?: boolean;
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
  const [applicationStatus, setApplicationStatus] = useState<
    ApplicationStatus[]
  >([]);
  const [companyApplications, setCompanyApplications] = useState<
    CompanyApplication[]
  >([]);
  const [likedCompanies, setLikedCompanies] = useState<LikedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<{
    [key: string]: boolean;
  }>({});

  // ダイアログの状態管理
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogData, setDialogData] = useState<{
    applicationId: string;
    status: "approved" | "rejected";
    applicantName: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      setLoading(true);

      if (profile.profile_type === "students") {
        // 学生の場合：応募履歴を取得
        try {
          console.log("Fetching applications for student:", profile.id);
          const response = await fetch("/api/student-applications");
          console.log("Response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Student applications data:", data);
            setApplicationStatus(data);
          } else {
            const errorData = await response.text();
            console.error(
              "Failed to fetch student applications:",
              response.status,
              errorData
            );
            setApplicationStatus([]);
          }
        } catch (error) {
          console.error("Error fetching student applications:", error);
          setApplicationStatus([]);
        }

        // 学生の場合：いいねした企業を取得
        try {
          console.log("Fetching liked companies for student:", profile.id);
          const likesResponse = await fetch(`/api/likes?studentId=${profile.id}`);

          if (likesResponse.ok) {
            const likesData = await likesResponse.json();
            console.log("Liked companies data:", likesData);
            setLikedCompanies(likesData.companies || []);
          } else {
            console.error("Failed to fetch liked companies:", likesResponse.status);
            setLikedCompanies([]);
          }
        } catch (error) {
          console.error("Error fetching liked companies:", error);
          setLikedCompanies([]);
        }
      } else if (profile.profile_type === "company") {
        // 企業の場合：自社プロジェクトへの応募を取得
        try {
          console.log("Fetching company applications for:", profile.id);
          const response = await fetch("/api/company-applications");
          console.log("Response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Company applications data:", data);
            setCompanyApplications(data);
          } else {
            const errorData = await response.text();
            console.error(
              "Failed to fetch company applications:",
              response.status,
              errorData
            );
            setCompanyApplications([]);
          }
        } catch (error) {
          console.error("Error fetching company applications:", error);
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

  // ダイアログを開く関数
  const openConfirmDialog = (
    applicationId: string,
    status: "approved" | "rejected",
    applicantName: string
  ) => {
    setDialogData({ applicationId, status, applicantName });
    setDialogOpen(true);
  };

  // ダイアログを閉じる関数
  const closeDialog = () => {
    if (!dialogLoading) {
      setDialogOpen(false);
      setDialogData(null);
    }
  };

  // 実際の更新処理
  const handleConfirmStatusUpdate = async () => {
    if (!dialogData) return;

    const { applicationId, status: newStatus } = dialogData;
    setDialogLoading(true);

    try {
      const response = await fetch(
        `/api/company-applications/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Status update result:", result);

        // ローカル状態を更新
        setCompanyApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  status: newStatus,
                  statusUpdatedAt: new Date().toISOString(),
                }
              : app
          )
        );

        // 通知もuseNotificationsフックで送信される（API側で実装済み）
      } else {
        const errorData = await response.json();
        console.error("Failed to update status:", errorData);
        alert(errorData.error || "ステータスの更新に失敗しました");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("ステータスの更新中にエラーが発生しました");
    } finally {
      setDialogLoading(false);
      setDialogOpen(false);
      setDialogData(null);
    }
  };

  const handleOpenChat = async (studentId: string, applicationId: string) => {
    if (!profile || profile.profile_type !== "company") {
      alert("チャットを開くことができません");
      return;
    }

    setUpdatingStatus((prev) => ({ ...prev, [`chat_${applicationId}`]: true }));

    try {
      // 企業IDを取得
      const supabase = createClient();
      const { data: company, error: companyError } = await supabase
        .from("company")
        .select("id")
        .eq("user_id", profile.id)
        .single();

      if (companyError || !company) {
        console.error("Company not found:", companyError);
        alert("企業情報の取得に失敗しました");
        return;
      }

      // チャットルームを作成または取得
      const chatResult = await createOrGetChatRoom(studentId, company.id);

      if (chatResult.success && chatResult.roomId) {
        console.log("Opening chat room:", chatResult.roomId);
        router.push(`/chat/${chatResult.roomId}`);
      } else {
        console.error("Failed to create/get chat room:", chatResult.error);
        alert("チャットルームの作成に失敗しました");
      }
    } catch (error) {
      console.error("Error opening chat:", error);
      alert("チャットを開く際にエラーが発生しました");
    } finally {
      setUpdatingStatus((prev) => ({
        ...prev,
        [`chat_${applicationId}`]: false,
      }));
    }
  };

  const handleOpenChatAsStudent = async (companyId: string, applicationId: string) => {
    if (!profile || profile.profile_type !== "students") {
      alert("チャットを開くことができません");
      return;
    }

    setUpdatingStatus((prev) => ({ ...prev, [`chat_${applicationId}`]: true }));

    try {
      // 学生IDは直接profile.idを使用
      const studentId = profile.id;

      // チャットルームを作成または取得
      const chatResult = await createOrGetChatRoom(studentId, companyId);

      if (chatResult.success && chatResult.roomId) {
        console.log("Opening chat room:", chatResult.roomId);
        router.push(`/chat/${chatResult.roomId}`);
      } else {
        console.error("Failed to create/get chat room:", chatResult.error);
        alert("チャットルームの作成に失敗しました");
      }
    } catch (error) {
      console.error("Error opening chat:", error);
      alert("チャットを開く際にエラーが発生しました");
    } finally {
      setUpdatingStatus((prev) => ({
        ...prev,
        [`chat_${applicationId}`]: false,
      }));
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
                  sx={{ width: 80, height: 80, mb: 1, bgcolor: "#000000" }}
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
                ) : profile?.profile_type === "admin" ? (
                  <Button
                    variant="outlined"
                    href="/admin"
                    startIcon={<BusinessIcon />}
                  >
                    管理画面
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

        {/* 中央カラム: 応募状況 & いいねした企業 */}
        <Box sx={{ width: { xs: "100%", lg: "45%" }, display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {profile?.profile_type === "students" ? "応募状況" :
                 profile?.profile_type === "admin" ? "管理者機能" : "応募管理"}
              </Typography>
              <List sx={{ p: 0 }}>
                {loading ? (
                  <ListItem>
                    <ListItemText primary="読み込み中..." />
                  </ListItem>
                ) : profile?.profile_type === "students" ? (
                  applicationStatus.length > 0 ? (
                    applicationStatus.map((app, index) => (
                      <Box key={app.id}>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemText
                              primary={
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    component="span"
                                  >
                                    {app.companyName}
                                  </Typography>
                                  {app.projectTitle && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      component="span"
                                      sx={{ display: "block", mt: 0.5 }}
                                    >
                                      プロジェクト: {app.projectTitle}
                                    </Typography>
                                  )}
                                </Box>
                              }
                              secondary={
                                app.appliedAt
                                  ? `応募日: ${new Date(
                                      app.appliedAt
                                    ).toLocaleDateString("ja-JP")}`
                                  : undefined
                              }
                            />
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={getStatusText(app.status)}
                                color={getStatusChipColor(app.status)}
                                size="small"
                              />
                              {app.companyId && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<ChatIcon />}
                                  onClick={() =>
                                    handleOpenChatAsStudent(app.companyId!, app.id)
                                  }
                                  disabled={updatingStatus[`chat_${app.id}`]}
                                  sx={{
                                    fontSize: "0.7rem",
                                    minWidth: "auto",
                                    px: 1,
                                  }}
                                >
                                  {updatingStatus[`chat_${app.id}`]
                                    ? "..."
                                    : "チャット"}
                                </Button>
                              )}
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
                ) : profile?.profile_type === "company" ? (
                  companyApplications.length > 0 ? (
                    companyApplications.map((app, index) => (
                      <Box key={app.id}>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemText
                              primary={
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    component="span"
                                  >
                                    {app.applicantName}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    component="span"
                                    sx={{ display: "block", mt: 0.5 }}
                                  >
                                    プロジェクト: {app.projectTitle}
                                  </Typography>
                                  {app.applicantEmail && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      component="span"
                                      sx={{ display: "block" }}
                                    >
                                      {app.applicantEmail}
                                    </Typography>
                                  )}
                                </Box>
                              }
                              secondary={`応募日: ${new Date(
                                app.appliedAt
                              ).toLocaleDateString("ja-JP")}`}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={getStatusText(app.status)}
                                color={getStatusChipColor(app.status)}
                                size="small"
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 0.5,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<ChatIcon />}
                                  onClick={() =>
                                    handleOpenChat(app.userId, app.id)
                                  }
                                  disabled={updatingStatus[`chat_${app.id}`]}
                                  sx={{
                                    fontSize: "0.7rem",
                                    minWidth: "auto",
                                    px: 1,
                                  }}
                                >
                                  {updatingStatus[`chat_${app.id}`]
                                    ? "..."
                                    : "チャット"}
                                </Button>
                                {app.status === "pending" && (
                                  <>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() =>
                                        openConfirmDialog(
                                          app.id,
                                          "approved",
                                          app.applicantName
                                        )
                                      }
                                      sx={{
                                        bgcolor: '#666666',
                                        color: 'white',
                                        fontSize: "0.7rem",
                                        minWidth: "auto",
                                        px: 1,
                                      }}
                                    >
                                      採用
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() =>
                                        openConfirmDialog(
                                          app.id,
                                          "rejected",
                                          app.applicantName
                                        )
                                      }
                                      sx={{
                                        bgcolor: '#000000',
                                        color: 'white',
                                        fontSize: "0.7rem",
                                        minWidth: "auto",
                                        px: 1,
                                      }}
                                    >
                                      不採用
                                    </Button>
                                  </>
                                )}
                              </Box>
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
                ) : profile?.profile_type === "admin" ? (
                  <ListItem>
                    <ListItemText
                      primary="管理者メニュー"
                      secondary="企業認証やシステム管理については管理画面をご利用ください"
                    />
                  </ListItem>
                ) : (
                  <ListItem>
                    <ListItemText primary="ユーザータイプが不明です" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* 学生の場合：いいねした企業を表示 */}
          {profile?.profile_type === "students" && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FavoriteIcon sx={{ color: '#000000' }} />
                  いいねした企業
                </Typography>
                <List sx={{ p: 0 }}>
                  {loading ? (
                    <ListItem>
                      <ListItemText primary="読み込み中..." />
                    </ListItem>
                  ) : likedCompanies.length > 0 ? (
                    likedCompanies.map((company, index) => (
                      <Box key={company.id}>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => router.push(`/companies/${company.id}`)}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{ bgcolor: "#000000" }}
                                src={company.logo || undefined}
                              >
                                {company.name.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box>
                                  <Typography variant="subtitle2">
                                    {company.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: "0.85rem" }}
                                  >
                                    {company.industry}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {company.description}
                                </Typography>
                              }
                            />
                            {company.is_verified && (
                              <Chip
                                label="認証済み"
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", borderColor: '#666666', color: '#666666' }}
                              />
                            )}
                          </ListItemButton>
                        </ListItem>
                        {index < likedCompanies.length - 1 && (
                          <Divider component="li" />
                        )}
                      </Box>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="いいねした企業がありません"
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              企業一覧ページでいいねしてみましょう
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                </List>
                {likedCompanies.length > 0 && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      onClick={() => router.push("/students")}
                      size="small"
                    >
                      企業一覧を見る
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
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
                              sx={{ bgcolor: "#333333" }}
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

      {/* 確認ダイアログ */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          {dialogData?.status === "approved" ? "採用確認" : "不採用確認"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {dialogData?.applicantName}さんを
            {dialogData?.status === "approved" ? "採用" : "不採用"}
            にしてもよろしいですか？
          </DialogContentText>
          {dialogLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={dialogLoading}>
            キャンセル
          </Button>
          <Button
            onClick={handleConfirmStatusUpdate}
            disabled={dialogLoading}
            variant="contained"
            sx={{ bgcolor: dialogData?.status === "approved" ? '#666666' : '#000000', color: 'white' }}
          >
            {dialogLoading ? (
              <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
            ) : null}
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
