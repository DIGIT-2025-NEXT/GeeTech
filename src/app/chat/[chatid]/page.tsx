import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Link from 'next/link';

export default async function Chat({ params }: { params: Promise<{ chatid: string }> }) {
    const { chatid } = await params;
    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">Chat</Typography>
            </Box>
        </Container>
    )
}