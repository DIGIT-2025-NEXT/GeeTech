"use client";
import React from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#212121", // プライマリカラーを黒に近いグレーに
      contrastText: "#ffffff", // プライマリカラー上のテキストは白
    },
    background: {
      default: "#ffffff", // デフォルトの背景は白
      paper: "#f5f5f5", // Paperコンポーネントの背景は薄いグレー
    },
    text: {
      primary: "#212121", // テキストの基本色は黒に近いグレー
    },
  },
});

export default function MUIThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
