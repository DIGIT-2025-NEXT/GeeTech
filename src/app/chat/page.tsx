
import { Box, Button, Card, CardActions, CardContent, Container, Stack, TextField, Typography,Breadcrumbs} from '@mui/material';
import Link from 'next/link';
import { getAllChat, type Chat } from '@/lib/mock';

export default function Chat() {
  const chats=getAllChat;
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ホーム
          </Link>
          <Typography color="text.primary">チャット一覧</Typography>
        </Breadcrumbs>
            <Stack spacing={2}>
              <Card>
              <CardContent>
                <Typography>chat1</Typography>
                <Button href='/chat/[chatid]'>chatid</Button>
              </CardContent>
            </Card>
            
        </Stack>
        </Container>
    )
}