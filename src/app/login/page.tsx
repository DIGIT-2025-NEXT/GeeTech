import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Link from 'next/link';

export default function Login() {
    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">Login</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Email" type="email" />
                <TextField label="Password" type="password" />
                <Button variant="contained" color="primary">Login</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                 <Link href="/register">Don&apos;t have an account?</Link>
            </Box>
        </Container>
    )
}

