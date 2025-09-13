"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import AdoptButton from "@/app/students/adopt";
import RejectButton from "@/app/students/Reject";

export default function TestNotificationsPage() {
  const { user } = useAuth();
  
  // Test student ID - you would replace this with an actual student ID from your database
  const testStudentId = "test-student-123";

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            ログインが必要です
          </Typography>
          <Typography variant="body1" color="text.secondary">
            通知機能をテストするにはログインしてください。
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          採用・不採用通知機能テスト
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          この画面では採用・不採用の通知機能をテストできます。
        </Typography>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            テスト対象学生: {testStudentId}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            以下のボタンをクリックして通知機能をテストしてください。
            通知は学生ID（{testStudentId}）に送信されます。
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    採用通知テスト
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    採用ボタンをクリックして採用通知をテストします。
                  </Typography>
                  <AdoptButton studentid={testStudentId} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" color="error.main" gutterBottom>
                    不採用通知テスト
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    不採用ボタンをクリックして不採用通知をテストします。
                  </Typography>
                  <RejectButton studentid={testStudentId} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark">
              <strong>注意:</strong> テスト環境では実際の学生に通知は送信されません。
              本番環境では実際の学生IDを使用してください。
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}