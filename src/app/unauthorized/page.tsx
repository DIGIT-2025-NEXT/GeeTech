"use client";

import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import {
  Block as BlockIcon,
  Home as HomeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: "center" }}>
        <Box sx={{ mb: 4 }}>
          <BlockIcon 
            sx={{ 
              fontSize: 80, 
              color: "error.main", 
              mb: 2 
            }} 
          />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ fontWeight: "bold", color: "error.main" }}
          >
            アクセス拒否
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            申し訳ございません。このページにアクセスする権限がありません。
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            企業向けページは企業アカウントのみアクセス可能です。
          </Typography>
          <Typography variant="body2" color="text.secondary">
            学生の方は学生向けページをご利用ください。
          </Typography>
        </Box>

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={2} 
          justifyContent="center"
        >
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => router.push("/")}
            size="large"
            sx={{ 
              textTransform: "none",
              borderRadius: 2,
              px: 3
            }}
          >
            ホームに戻る
          </Button>
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={() => router.push("/profile")}
            size="large"
            sx={{ 
              textTransform: "none",
              borderRadius: 2,
              px: 3
            }}
          >
            プロフィールページ
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}