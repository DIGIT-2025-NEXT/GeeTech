"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNotifications } from "@/hooks/useNotifications";
import { SendNotificationParams } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";

export default function SendNotificationTestPage() {
  const { user } = useAuth();
  const { sendNotification } = useNotifications();

  const [recipientId, setRecipientId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    // デフォルトで自分自身のIDを受信者IDに設定
    if (user) {
      setRecipientId(user.id);
    }
  }, [user]);

  const handleSend = async () => {
    if (!recipientId || !title || !body) {
      setStatus({
        type: "error",
        message: "受信者ID、タイトル、本文は必須です。",
      });
      return;
    }

    const params: SendNotificationParams = {
      recipient_id: recipientId,
      title,
      body,
      link: link || undefined,
    };

    try {
      await sendNotification(params);
      setStatus({ type: "success", message: "通知が正常に送信されました。" });
    } catch (error) {
      setStatus({
        type: "error",
        message: `通知の送信に失敗しました: ${error}`,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          通知送信テスト
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="受信者ID (Recipient UUID)"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="本文"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="リンク先 (任意)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            sx={{ mt: 2 }}
          >
            通知を送信
          </Button>
        </Box>
        {status && (
          <Alert severity={status.type} sx={{ mt: 2 }}>
            {status.message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
