
import { Box, Button, Container, Stack, TextField, Typography, Breadcrumbs, Card } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { getchatById, type Chat } from '@/lib/mock';

export default async function Chat({ params }: { params: { chatid: string } }) {
    const chatlogs=getchatById(params.chatid);
    if(!chatlogs){
        return(
            <Container sx={{height: "85vh"} }>
                
        <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
                <Typography variant='h4'>このチャットは存在しません</Typography>
            </Container>
        )
    }
    return (
        <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column",height: "85vh"}}>
        <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
        <Typography variant='h5'>{chatlogs.company.name}</Typography>
            <Box sx={{ flex:1,overflowY: "auto",p:2}}>
                <Stack spacing={1}>
                    {chatlogs.chatlog.map((e,index)=>
                    e.speaker ==="student"?(
                    <Stack key={index} sx={{alignSelf: "flex-end"}}>
                        <Typography sx={{fontSize:16}}>{chatlogs.student.name}</Typography>
                        <Card sx={{p:1,maxWidth: 600, width: "fit-content",bgcolor:"aqua"}}>
                            <Typography>{e.chattext}</Typography>
                        </Card>
                        <Typography variant="overline" color="text.secondary">
                            {new Date(e.chattime).toLocaleString("ja-JP")}
                        </Typography>
                    </Stack>
                    ):(
                    <Stack key={index} sx={{alignSelf: "flex-start"}}>
                        <Typography sx={{fontSize:16}}>{chatlogs.company.name}</Typography>
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
