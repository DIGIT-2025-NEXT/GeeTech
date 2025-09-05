import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Link from 'next/link';

export default function Chat() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">Chat</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Message" type="text" />
                <Button variant="contained" color="primary">Send</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">Messages</Typography>
            </Box>
        </Container>
    )
}