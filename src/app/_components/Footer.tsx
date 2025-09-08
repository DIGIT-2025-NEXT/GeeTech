"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Footer() {
  return (
    <AppBar
      position="static"
      sx={{
        top: "auto",
        bottom: 0,
      }}
    >
      <Toolbar
        sx={{
          flexDirection: { xs: "column", sm: "row" }, // スマホでは縦積み、sm以上で横並び
          alignItems: "center",
          py: { xs: 2, sm: 1 }, // スマホでは上下の余白を少し増やす
        }}
      >
        <Typography
          variant="body1"
          sx={{ mr: { sm: 2 }, fontFamily: "var(--audiowide)" }}
        >
          KitaqStartup
        </Typography>
        <Typography variant="body2" sx={{ flexGrow: { sm: 1 } }}>
          by GeeTech
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            mt: { xs: 1.5, sm: 0 }, // スマホでは上に余白を追加
          }}
        >
          © 2025 GeeTech. All Rights Reserved.
        </Typography>
      </Toolbar>
    </AppBar>
  );
}