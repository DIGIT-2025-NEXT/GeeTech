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
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          KitaqStartup
        </Typography>
        <Typography variant="body2">by GeeTech</Typography>
      </Toolbar>
    </AppBar>
  );
}