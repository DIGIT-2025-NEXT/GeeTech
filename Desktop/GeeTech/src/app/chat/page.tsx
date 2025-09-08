
import { Box, Button, Card, CardActions, CardContent, Container, Stack, TextField, Typography} from '@mui/material';
import Link from 'next/link';

export default function Chat() {
    return (
        <Container maxWidth="sm">
            <Typography>chat一覧</Typography>
            <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography>chat1</Typography>
                <Button href='/chat/[chatid]'>chatid</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography>chat1</Typography>
                <Button href='/chat/[chatid]'>chatid</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography>chat1</Typography>
                <Button href='/chat/[chatid]'>chatid</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography>chat1</Typography>
                <Button href='/chat/[chatid]'>chatid</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography>chat1</Typography>
                <Button href='/chat/[chatid]'>chatid</Button>
              </CardContent>
            </Card>
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