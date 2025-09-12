
"use client";

import { Box, Button, Card, CardContent, Container, Stack, Typography, Breadcrumbs} from '@mui/material';
import Link from 'next/link';
import { useState, useEffect, useCallback } from "react";
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

  const fetchChatRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const response = await fetch('/api/chat/rooms');
      if (response.ok) {
        const data = await response.json();
        const newRooms = data.rooms || [];
        
        // 既存のroomsと比較して、変更がある場合のみ更新
        setRooms(prevRooms => {
          // 配列の長さが異なるか、ID順でソートして比較
          if (prevRooms.length !== newRooms.length) {
            return newRooms;
          }
          
          const prevSorted = [...prevRooms].sort((a, b) => a.id.localeCompare(b.id));
          const newSorted = [...newRooms].sort((a, b) => a.id.localeCompare(b.id));
          
          // IDリストの比較
          const prevIds = prevSorted.map(room => room.id).join(',');
          const newIds = newSorted.map(room => room.id).join(',');
          
          if (prevIds !== newIds) {
            return newRooms;
          }
          
          // 各roomの最新メッセージ内容をチェック
          for (let i = 0; i < prevSorted.length; i++) {
            const prevRoom = prevSorted[i];
            const newRoom = newSorted[i];
            
            // 最新メッセージの比較
            if (!prevRoom.lastMessage && newRoom.lastMessage) {
              return newRooms;
            }
            if (prevRoom.lastMessage && !newRoom.lastMessage) {
              return newRooms;
            }
            if (prevRoom.lastMessage && newRoom.lastMessage) {
              if (prevRoom.lastMessage.message !== newRoom.lastMessage.message ||
                  prevRoom.lastMessage.created_at !== newRoom.lastMessage.created_at) {
                return newRooms;
              }
            }
          }
          
          // 変更がない場合は既存の状態を維持
          return prevRooms;
        });
        
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
  }, []);

  useEffect(() => {
    if (user && !loading) {
      fetchChatRooms();
    }
  }, [user, loading, fetchChatRooms]);

  // ポーリングによる定期更新（WebSocketを使ったリアルタイム更新の代替）
  useEffect(() => {
    if (!user || !userType) return;

    // 4秒ごとにチャットルーム一覧を更新
    const intervalId = setInterval(() => {
      console.log(`Polling for chat rooms updates (${userType})`);
      fetchChatRooms();
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user, userType, fetchChatRooms]);

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
      <Stack spacing={2} sx={{ mt: 2 }}>
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardContent>
              <Typography variant='h6'>
                {userType === 'student' ? room.company.name : room.students.name}
              </Typography>
              <Typography variant='subtitle2' color='text.secondary'>
                {userType === 'student' ? room.company.industry : room.students.university}
              </Typography>
              {room.lastMessage && (
                <Typography sx={{ mt: 1, mb: 2 }}>
                  {room.lastMessage.sender_type === userType ? 'あなた: ' : ''}
                  {room.lastMessage.message}
                </Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                  href={`/chat/${room.id}`} 
                  sx={{ bgcolor: "black", color: "white" }}
                >
                  チャットを見る
                </Button>
                {room.lastMessage && (
                  <Typography variant='caption' color='text.secondary'>
                    {new Date(room.lastMessage.created_at).toLocaleDateString('ja-JP')}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  )
}