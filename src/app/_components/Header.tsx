"use client";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  useMediaQuery,
  useTheme,
  Box,
  Stack,
  Badge,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";

export default function Header() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { profile } = useProfile();
  const { unreadCount, notifications, markAllAsRead } = useNotifications();

  const userStatus = profile?.profile_type === "company" ? "company" : "student";
  const userName = profile?.username;

  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const isUserMenuOpen = Boolean(userMenuAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationMenuAnchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const title = isMobile ? "K" : "Kitaq_Startup";

  // ユーザーメニュー用のハンドラ
  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // 通知メニュー用のハンドラ
  const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationMenuAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationMenuAnchorEl(null);
  };

  const handleProfile = () => {
    handleUserMenuClose();
    router.push("/profile");
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await signOut();
    router.replace("/login");
  };

  const handleNotificationItemClick = (link: string | null) => {
    handleNotificationClose();
    if (link) {
      router.push(link);
    }
  };

  // 通知メニューが開かれたら既読にする
  useEffect(() => {
    if (isNotificationMenuOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isNotificationMenuOpen, unreadCount, markAllAsRead]);

  const commonButtonSx = {
    minWidth: "auto",
    px: { xs: 1, sm: 2 },
    "& .MuiButton-startIcon": {
      mr: { xs: 0.5, sm: 1 },
    },
  };

  const links = (
    <>
      {userStatus === "student" ? (
        <Button
          color="inherit"
          startIcon={<ExploreIcon />}
          sx={commonButtonSx}
          onClick={() => router.push("/students")}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            企業を探す
          </Box>
        </Button>
      ) : (
        <Button
          color="inherit"
          startIcon={<ExploreIcon />}
          sx={commonButtonSx}
          onClick={() => router.push("/company")}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            学生を探す
          </Box>
        </Button>
      )}
      <Button
        color="inherit"
        startIcon={<DashboardIcon />}
        sx={commonButtonSx}
        onClick={() => router.push("/dashboard")}
      >
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          ダッシュボード
        </Box>
      </Button>
      <Button
        color="inherit"
        onClick={handleNotificationClick}
        startIcon={
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <NotificationsIcon />
          </Badge>
        }
        sx={commonButtonSx}
      >
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          通知
        </Box>
      </Button>
      <Button
        color="inherit"
        startIcon={<ChatIcon />}
        sx={commonButtonSx}
        onClick={() => router.push("/chat")}
      >
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          チャット
        </Box>
      </Button>
      <Button
        color="inherit"
        id="user-menu-button"
        aria-controls={isUserMenuOpen ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isUserMenuOpen ? "true" : undefined}
        onClick={handleUserMenuClick}
        startIcon={<AccountCircleIcon />}
        endIcon={isMobile ? undefined : <ArrowDropDownIcon />}
        sx={commonButtonSx}
      >
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          {userName} ({userStatus === "student" ? "学生" : "企業"})
        </Box>
      </Button>
    </>
  );

  const linksSkelton = (
    <Stack direction="row" spacing={2}>
      <Skeleton variant="rounded" width={isMobile ? 40 : 120} height={36} />
      <Skeleton variant="rounded" width={isMobile ? 40 : 120} height={36} />
      <Skeleton variant="rounded" width={isMobile ? 40 : 120} height={36} />
    </Stack>
  );

  const unauthenticatedLinks = (
    <Button
      color="inherit"
      startIcon={<LoginIcon />}
      sx={commonButtonSx}
      onClick={() => router.push("/login")}
    >
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        ログイン
      </Box>
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "var(--audiowide)" }}
        >
          <Link
            href="/students"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {title}
          </Link>
        </Typography>
        {loading ? linksSkelton : user ? links : unauthenticatedLinks}
      </Toolbar>
      {/* 通知メニュー */}
      <Menu
        id="notification-menu"
        anchorEl={notificationMenuAnchorEl}
        open={isNotificationMenuOpen}
        onClose={handleNotificationClose}
        MenuListProps={{
          'aria-labelledby': 'notification-button',
        }}
        slotProps={{
          paper: {
            sx: { 
              width: 360, 
              maxWidth: '100%',
            },
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle1">通知</Typography>
        </MenuItem>
        <Divider />
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationItemClick(notification.link)}
              sx={{ backgroundColor: notification.is_read ? 'transparent' : '#f0f8ff' }}
            >
              <ListItemText
                primary={notification.title}
                secondary={notification.body}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { 
                    fontWeight: notification.is_read ? 'normal' : 'bold',
                  },
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                }}
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemText primary="新しい通知はありません" />
          </MenuItem>
        )}
      </Menu>
      {/* ユーザーメニュー */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchorEl}
        open={isUserMenuOpen}
        onClose={handleUserMenuClose}
        MenuListProps={{
          'aria-labelledby': 'user-menu-button',
        }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          プロフィール
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          ログアウト
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
