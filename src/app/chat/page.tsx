
"use client";

import { Box, Button, Card, CardContent, Container, Stack, Typography, Breadcrumbs} from '@mui/material';
import Link from 'next/link';
import { getAllChat, type Chat } from '@/lib/mock';
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';

interface ChatRoom {
  id: string;
  student_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  students: {
    id: string;
    name: string;
    university: string;
    avatar?: string;
  };
  company: {
    id: string;
    name: string;
    industry: string;
  };
  lastMessage: {
    message: string;
    created_at: string;
    sender_type: string;
  } | null;
}

export default function Chat() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [userType, setUserType] = useState<'student' | 'company' | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      fetchChatRooms();
    }
  }, [user, loading]);

  const fetchChatRooms = async () => {
    setLoadingRooms(true);
    try {
      const response = await fetch('/api/chat/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
        setUserType(data.userType);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to fetch chat rooms:', response.status, errorData);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
    setLoadingRooms(false);
  };

  if (loading || loadingRooms) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ホーム
          </Link>
          <Typography color="text.primary">チャット</Typography>
        </Breadcrumbs>
        <Typography variant='h4'>読み込み中...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ホーム
          </Link>
          <Typography color="text.primary">チャット</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Card sx={{ p: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
              <Typography variant='h5'>チャットにアクセスするにはログインが必要です</Typography>
              <Button variant='contained' href='/login' sx={{ bgcolor: 'green', ':hover': { bgcolor: 'darkgreen' } , color: 'white' }}>ログインする</Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  if (!rooms || rooms.length === 0) {
    return(
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ホーム
          </Link>
          <Typography color="text.primary">チャット</Typography>
        </Breadcrumbs>
        <Typography variant='h4'>直近のチャットはありません</Typography>
      </Container>
    )
  }
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ホーム
          </Link>
          <Typography color="text.primary">チャット</Typography>
        </Breadcrumbs>
        <Typography variant='h4'>直近のチャット</Typography>
            <Stack spacing={2}>
              {rooms.map((room)=>
              <Card key={room.id}>
                <CardContent>
                  <Typography variant='h6'>{room.company.name}</Typography>
                  <Typography>{room.lastMessage?.message || '最新のメッセージがありません'}</Typography>
                  <Button href={`/chat/${room.id}`} sx={{bgcolor:"black",color:"white"}}>チャットを見る</Button>
                </CardContent>
              </Card>
            )}
            </Stack>
        </Container>
    )
}