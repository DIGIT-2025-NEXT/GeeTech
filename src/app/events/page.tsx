'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Container, Paper, Typography, Button, Box, Avatar, Divider } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EventsPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography align="center">読み込み中...</Typography>
      </Container>
    )
  }

  if (!user) {
    return null // リダイレクト中
  }

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          ダッシュボード
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" sx={{ mb: 4 }}>
          <Avatar
            src={user.user_metadata?.avatar_url}
            sx={{ width: 80, height: 80, mb: 2 }}
          >
            {user.email?.charAt(0).toUpperCase()}
          </Avatar>
          
          <Typography variant="h6" gutterBottom>
            ようこそ、{user.user_metadata?.full_name || user.email}さん
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ユーザー情報
          </Typography>
          
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1" paragraph>
              <strong>メールアドレス:</strong> {user.email}
            </Typography>
            
            <Typography variant="body1" paragraph>
              <strong>ユーザーID:</strong> {user.id}
            </Typography>
            
            <Typography variant="body1" paragraph>
              <strong>登録日時:</strong> {new Date(user.created_at).toLocaleString('ja-JP')}
            </Typography>
            
            {user.last_sign_in_at && (
              <Typography variant="body1" paragraph>
                <strong>最終ログイン:</strong> {new Date(user.last_sign_in_at).toLocaleString('ja-JP')}
              </Typography>
            )}
          </Box>
        </Box>

        <Box textAlign="center">
          <Button
            variant="contained"
            color="error"
            onClick={handleSignOut}
            size="large"
          >
            ログアウト
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
