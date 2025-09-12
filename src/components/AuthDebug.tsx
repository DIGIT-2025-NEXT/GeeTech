'use client'

import { useState } from 'react'
import { validateAuthConfig } from '@/utils/auth-helpers'
import { Card, CardContent, CardHeader, Typography, Box, Button, Alert } from '@mui/material'
import { ContentCopy, Refresh } from '@mui/icons-material'

export default function AuthDebug() {
  const [config, setConfig] = useState(validateAuthConfig())
  const [copied, setCopied] = useState(false)

  const refreshConfig = () => {
    setConfig(validateAuthConfig())
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card sx={{ mt: 2, border: '2px solid #ff9800' }}>
      <CardHeader>
        <Typography variant="h6" sx={{ color: '#ff9800' }}>
          🔧 認証設定デバッグ情報 (開発環境のみ)
        </Typography>
      </CardHeader>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            現在の設定
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              SupabaseプロジェクトID:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                {config.projectId || '未設定'}
              </Typography>
              {config.projectId && (
                <Button
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(config.projectId!)}
                >
                  {copied ? 'コピー済み' : 'コピー'}
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Google OAuthリダイレクトURI:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 1, borderRadius: 1, wordBreak: 'break-all' }}>
                {config.redirectUri || '未設定'}
              </Typography>
              {config.redirectUri && (
                <Button
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(config.redirectUri!)}
                >
                  {copied ? 'コピー済み' : 'コピー'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {config.errors.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="error" gutterBottom>
              エラー
            </Typography>
            {config.errors.map((error, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            ))}
          </Box>
        )}

        {config.warnings.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="warning.main" gutterBottom>
              警告
            </Typography>
            {config.warnings.map((warning, index) => (
              <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                {warning}
              </Alert>
            ))}
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Google Cloud Console設定手順
          </Typography>
          <Typography variant="body2" paragraph>
            1. <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a> にアクセス
          </Typography>
          <Typography variant="body2" paragraph>
            2. プロジェクトを選択
          </Typography>
          <Typography variant="body2" paragraph>
            3. <strong>APIs & Services → Credentials</strong> に移動
          </Typography>
          <Typography variant="body2" paragraph>
            4. OAuth 2.0クライアントIDを選択または作成
          </Typography>
          <Typography variant="body2" paragraph>
            5. <strong>Authorized redirect URIs</strong> に以下を追加:
          </Typography>
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {config.redirectUri || 'https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback'}
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            6. <strong>Save</strong> をクリック
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshConfig}
          fullWidth
        >
          設定を再読み込み
        </Button>
      </CardContent>
    </Card>
  )
}
