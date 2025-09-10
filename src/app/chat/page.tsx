
"use client";

import { Button, Card, CardContent, Container, Stack, Typography,Breadcrumbs} from '@mui/material';
import Link from 'next/link';
import { getAllChat, type Chat, getCompanyById } from '@/lib/mock';
import { useState } from "react";
import { useAuth } from '@/contexts/AuthContext';

export default function Chat() {
  const [morecount, setMorecount] = useState(1);
  const { user, loading } = useAuth();

  const addmorecount = () => {
    setMorecount((prev) => prev + 1);
  };
  const userid = user?.id ?? '';
  console.log(`${userid}`);
  const sortedchats = getAllChat()
    .filter((chat) => chat.studentid === userid)
    .sort((a, b) => +new Date(b.chatlog[b.chatlog.length-1].chattime)- +new Date(a.chatlog[a.chatlog.length-1].chattime))
    .slice(0, morecount*10);
  if (loading) {
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
  if(!sortedchats||sortedchats.length==0){
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
              {sortedchats.map((e)=>
              <Card key={e.id}>
                <CardContent>
                  <Typography variant='h6'>{getCompanyById(e.companyid)?.name}</Typography>
                  <Typography>{e.chatlog[e.chatlog.length-1].chattext}</Typography>
                  <Button href={`/chat/${e.id}`} sx={{bgcolor:"black",color:"white"}}>チャットを見る</Button>
                </CardContent>
              </Card>
            )}
            {sortedchats.length>morecount*10 ?(<Button variant='outlined' onClick={addmorecount} sx={{color:'"blue"'}}>もっと見る</Button>):("")}
            </Stack>
        </Container>
    )
}