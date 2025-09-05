"use client";

import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Header />
      <Box component="main" sx={{ flex: "1 0 auto" }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
