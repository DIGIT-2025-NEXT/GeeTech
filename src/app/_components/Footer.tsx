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
      <Toolbar>
        <Typography
          variant="body1"
          sx={{ mr: 2, fontFamily: "var(--audiowide)" }}
        >
          KitaqStartup
        </Typography>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          by GeeTech
        </Typography>
        <Typography
          variant="caption"
          align="center"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            py: 1,
          }}
        >
          © 2025 GeeTech. All Rights Reserved.
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
