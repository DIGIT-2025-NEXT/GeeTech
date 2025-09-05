import { Box, Container, Typography } from '@mui/material';

export default async function Chat() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">Chat</Typography>
            </Box>
        </Container>
    )
}