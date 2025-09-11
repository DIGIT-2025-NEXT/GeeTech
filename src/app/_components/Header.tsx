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
  Skeleton,
  useMediaQuery,
  useTheme,
  Box,
  Stack,
  Badge,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ExploreIcon from "@mui/icons-material/Explore";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export default function Header() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const {
    loading: profileLoading,
    error: profileError,
    profile,
  } = useProfile();

  // userStatusとuserNameは将来的にはContextやDBから取得することを想定
  const userStatus =
    profile?.profile_type === "company" ? "company" : "student";
  const userName = profile?.username;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // レスポンシブ対応
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const title = isMobile ? "K" : "Kitaq_Startup";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    router.push("/profile");
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
    router.replace("/login");
  };

  const commonButtonSx = {
    minWidth: "auto", // アイコンのみの時に幅を詰める
    px: { xs: 1, sm: 2 }, // スマホではパディングを小さく
    "& .MuiButton-startIcon": {
      mr: { xs: 0.5, sm: 1 }, // スマホではアイコンの右マージンをなくす
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
        startIcon={
          <Badge
            badgeContent={0} //TODO
            color="info"
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <DashboardIcon />
          </Badge>
        }
        sx={commonButtonSx}
        onClick={() => router.push("/dashboard")}
      >
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          ダッシュボード
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
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={<AccountCircleIcon />}
        endIcon={isMobile ? undefined : <ArrowDropDownIcon />} // スマホでは矢印を非表示
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
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "user-menu-button",
          },
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
