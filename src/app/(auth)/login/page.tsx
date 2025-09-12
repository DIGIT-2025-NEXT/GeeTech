"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {
    user,
    signIn,
    signUp,
    signInWithGoogle,
    error: authError,
  } = useAuth();
  const router = useRouter();

  // すでにサインインしているならトップへ
  useEffect(() => {
    if (user) router.replace("/events");
  }, [user, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setMessage(error || "エラーが発生しました");
      } else if (!isLogin) {
        setMessage(
          "確認メールを送信しました。メールボックスを確認してください。"
        );
      }
    } catch {
      setMessage("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setMessage(error || "エラーが発生しました");
      }
    } catch {
      setMessage("Google認証でエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // リダイレクト中
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isLogin ? "ログイン" : "新規登録"}
        </Typography>

        {/* Google認証ボタン */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleAuth}
          disabled={loading}
          sx={{ mb: 3, py: 1.5 }}
        >
          Googleで{isLogin ? "ログイン" : "登録"}
        </Button>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            または
          </Typography>
        </Divider>

        {/* Email認証フォーム */}
        <Box component="form" onSubmit={handleEmailAuth} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? "処理中..." : isLogin ? "ログイン" : "新規登録"}
          </Button>
        </Box>

        {/* メッセージ表示 */}
        {message && (
          <Alert
            severity={
              message.includes("エラー") || message.includes("error")
                ? "error"
                : "success"
            }
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}

        {/* 認証エラー表示 */}
        {authError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2" component="div">
              <strong>認証エラー:</strong> {authError}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              環境変数 <code>NEXT_PUBLIC_SUPABASE_URL</code> と{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              が正しく設定されているか確認してください。
            </Typography>
          </Alert>
        )}

        {/* ログイン/登録切り替え */}
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            {isLogin
              ? "アカウントをお持ちでない方はこちら"
              : "すでにアカウントをお持ちの方はこちら"}
          </Button>
        </Box>
      </Paper>

    </Container>
  );
}
