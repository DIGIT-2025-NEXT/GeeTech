import { Container, Paper, Typography, Button, Box } from '@mui/material'
import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="error">
          認証エラー
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          認証処理中にエラーが発生しました。
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph align="center">
          もう一度ログインを試してください。
        </Typography>

        <Box textAlign="center" sx={{ mt: 3 }}>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
          >
            ログインページに戻る
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
