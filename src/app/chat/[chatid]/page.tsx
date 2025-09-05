import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Link from 'next/link';

export default function Chat({ params }: { params: { chatid: string } }) {
    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">Chat</Typography>
            </Box>
        </Container>
    )
}