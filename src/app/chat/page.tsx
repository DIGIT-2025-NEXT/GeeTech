"use client";

import { Box, Button, Card, CardContent, Container, Stack, Typography, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function Chat() {
  const [morecount, setMorecount] = useState(1);
  const [chats, setChats] = useState<any[]>([]);
  const [mprofile, setMProfile] = useState<any | null>(null);
  const [yid,setYID]=useState<string>("");
  const [yprofile, setYProfile] = useState<any | null>(null);
  const [loadingChats, setLoadingChats] = useState(true);

  const { user, loading } = useAuth();
  const userid = user?.id ?? '';
  const supabase = createClient();

  const addmorecount = () => setMorecount((prev) => prev + 1);

  // 🔽 データ取得を副作用でやる
  useEffect(() => {
    if (!userid) return;

    const fetchData = async () => {
      setLoadingChats(true);
      const { data: mprofile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userid)
        .single();
        
      setMProfile(mprofile);
      const { data: yprofile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', yid)
        .single();
        
      setYProfile(yprofile);
      if (mprofile) {
        const idtype = mprofile.profile_type === "students" ? 'studentsid' : 'companyid';
        const { data: chats } = await supabase
          .from('chats')
          .select('*');


        setChats(chats ?? []);
      }
      
      setLoadingChats(false);
    };

    fetchData();
  }, [userid]);
  // ========================
  // 描画処理
  // ========================
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant='h4'>読み込み中...</Typography>
      </Container>
    );
  }

  if (!userid) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Card>
          <CardContent>
            <Typography>チャットにアクセスするにはログインが必要です</Typography>
            <Button variant="contained" href="/login">ログインする</Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (loadingChats) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant='h4'>チャットを取得中...</Typography>
      </Container>
    );
  }

  if (!mprofile) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant='h4'>プロフィールを設定してください</Typography>
      </Container>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant='h4'>直近のチャットはありません</Typography>
      </Container>
    );
  }

  const sortedchats = chats
    .sort((a, b) =>
      +new Date(b.chatlog[b.chatlog.length - 1].chattime) -
      +new Date(a.chatlog[a.chatlog.length - 1].chattime)
    )
    .slice(0, morecount * 10);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant='h4'>直近のチャット</Typography>
      <Stack spacing={2}>
        {sortedchats.map((e) =>
          <Card key={e.id}>
            <CardContent>
              <Typography variant='h6'>
              </Typography>
              <Typography>{e.chatlog[e.chatlog.length - 1].chattext}</Typography>
              <Button href={`/chat/${e.id}`} sx={{ bgcolor: "black", color: "white" }}>チャットを見る</Button>
            </CardContent>
          </Card>
        )}
        {chats.length > morecount * 10 && (
          <Button variant='outlined' onClick={addmorecount}>もっと見る</Button>
        )}
      </Stack>
    </Container>
  );
}
