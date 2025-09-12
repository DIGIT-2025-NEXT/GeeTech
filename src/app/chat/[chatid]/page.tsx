
"use client";

import { Box, Button, Container, Stack, TextField, Typography, Card, CardContent} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import {getStudentById,getCompanyByIdSync,getchatById} from '@/lib/mock';
import { useAuth } from '@/contexts/AuthContext';

export default function Chat({ params }: { params: Promise<{ chatid: string }> }) {
    const [chatid, setChatid] = React.useState<string>('');
    
    React.useEffect(() => {
        params.then(({ chatid }) => setChatid(chatid));
    }, [params]);
    const chatlogs = getchatById(chatid);
    const { user, loading } = useAuth();
    const userid = user?.id ?? '';
    
    if (loading || !chatid) {
        return (
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
            <Typography variant='h4'>読み込み中...</Typography>
          </Container>
        );
      }
      if(!userid){
        return (
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
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
    if(!chatlogs){
        return(
            <Container sx={{height: "85vh"} }>
                
        <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
                <Typography variant='h4'>このチャットは存在しません</Typography>
            </Container>
        )
    }
    //ユーザーidの確認（チャットの作成後メッセージ解除）
    /*
    if (user?.id !== chatlogs.studentid&&user?.id !== chatlogs.companyid) {
        return (
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
            <Typography variant='h6'>このチャットにアクセスする権限がありません。</Typography>
          </Container>
        );
    */
    return (
        <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column",height: "85vh"}}>
        <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
        <Typography variant='h5'>{getCompanyByIdSync(chatlogs.companyid)?.name}</Typography>
            <Box sx={{ flex:1,overflowY: "auto",p:2}}>
                <Stack spacing={1}>
                    {chatlogs.chatlog.map((e,index)=>
                    e.speaker ==="student"?(
                    <Stack key={index} sx={{alignSelf: "flex-end"}}>
                        <Typography sx={{fontSize:16}}>{getStudentById(chatlogs.studentid)?.name}</Typography>
                        <Card sx={{p:1,maxWidth: 600, width: "fit-content",bgcolor:"aqua"}}>
                            <Typography>{e.chattext}</Typography>
                        </Card>
                        <Typography variant="overline" color="text.secondary">
                            {new Date(e.chattime).toLocaleString("ja-JP")}
                        </Typography>
                    </Stack>
                    ):(
                    <Stack key={index} sx={{alignSelf: "flex-start"}}>
                        <Typography sx={{fontSize:16}}>{getCompanyByIdSync(chatlogs.companyid)?.name}</Typography>
                        <Card sx={{p:1,maxWidth: 600, width: "fit-content",bgcolor:"white"}}>
                            <Typography>{e.chattext}</Typography>
                        </Card>
                        <Typography variant="overline" color="text.secondary">
                            {new Date(e.chattime).toLocaleString("ja-JP")}
                        </Typography>
                    </Stack>
                    ))}
                    
                </Stack>
            </Box>
            <Box sx={{p: 2,borderTop: "1px solid #ddd",display: "flex",gap: 1}}>
              <TextField fullWidth placeholder='メッセージを入力' variant='outlined'/>
              <Button variant='contained'>送信</Button>
            </Box>
        </Container>
        
    )
}
