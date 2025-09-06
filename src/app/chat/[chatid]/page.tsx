
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import Link from 'next/link';

export default async function Chat() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">{params.chatid}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography>aaaaaa</Typography>
                <TextField label="chat" type="chat" />
            </Box>
            
        </Container>
        
    )
}