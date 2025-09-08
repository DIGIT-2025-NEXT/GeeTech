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

export default function Header() {
  // 後で差し替える
  const userName = "山田太郎";
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const userStatus = "student" as "unauthenticated" | "student" | "company";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const links = (
    <>
      {userStatus === "student" ? (
        <Link href={"/company"} passHref>
          <Button
            color="primary"
            startIcon={<ExploreIcon />}
            sx={{ mr: 2, backgroundColor: "#ffffff", color: "#212121" }}
          >
            スタートアップを探す
          </Button>
        </Link>
      ) : (
        <Link href={"/students"} passHref>
          <Button
            color="primary"
            startIcon={<ExploreIcon />}
            sx={{ mr: 2, backgroundColor: "#ffffff", color: "#212121" }}
          >
            学生を探す
          </Button>
        </Link>
      )}
      <Link href={"/dashboard"} passHref>
        <Button color="inherit" startIcon={<DashboardIcon />} sx={{ mr: 1 }}>
          ダッシュボード
        </Button>
      </Link>
      <Link href={"/chat"} passHref>
        <Button color="inherit" startIcon={<ChatIcon />} sx={{ mr: 1 }}>
          チャット
        </Button>
      </Link>
      <Button
        color="inherit"
        id="user-menu-button"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={<AccountCircleIcon />}
        endIcon={<ArrowDropDownIcon />}
      >
        {userName} ({userStatus === "student" ? "学生" : "企業"})
      </Button>
    </>
  );

  const linksSkelton = (
    <>
      <Skeleton variant="text" width={240} height={40} />
      <Skeleton variant="text" width={240} height={40} />
      <Skeleton variant="text" width={240} height={40} />
    </>
  );

  const unauthenticatedLinks = (
    <>
      <Link href={"/login"} passHref>
        <Button color="inherit" startIcon={<LoginIcon />}>
          ログイン
        </Button>
      </Link>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "var(--audiowide)" }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Kitaq_Startup
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
