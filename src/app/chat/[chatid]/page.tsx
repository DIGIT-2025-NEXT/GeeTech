
"use client";

import { Box, Button, Container, Stack, TextField, Typography, Card, CardContent} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_type: 'student' | 'company';
  message: string;
  created_at: string;
  updated_at: string;
}

interface ChatRoom {
  id: string;
  student_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

interface ChatData {
  room: ChatRoom;
  messages: ChatMessage[];
}

export default function Chat({ params }: { params: Promise<{ chatid: string }> }) {
    const [chatid, setChatid] = React.useState<string>('');
    const [chatData, setChatData] = React.useState<ChatData | null>(null);
    const [userType, setUserType] = React.useState<'student' | 'company' | null>(null);
    const [loadingChat, setLoadingChat] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState('');
    const [sending, setSending] = React.useState(false);
    const [studentInfo, setStudentInfo] = React.useState<{name: string; university: string} | null>(null);
    const [companyInfo, setCompanyInfo] = React.useState<{name: string; industry: string} | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    
    const { user, loading } = useAuth();
    const { lastMessage } = useWebSocket(chatid);
    
    React.useEffect(() => {
        params.then(({ chatid }) => setChatid(chatid));
    }, [params]);

    const fetchUserInfo = React.useCallback(async (studentId: string, companyId: string) => {
        try {
            // Supabaseから直接情報を取得する（一時的な実装）
            // 実際にはAPIを作成することを推奨
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            
            // 学生情報を取得
            const { data: studentData } = await supabase
                .from('students')
                .select('name, university')
                .eq('id', studentId)
                .single();
            
            if (studentData) {
                setStudentInfo({ name: studentData.name, university: studentData.university });
            }

            // 会社情報を取得
            const { data: companyData } = await supabase
                .from('company')
                .select('name, industry')
                .eq('id', companyId)
                .single();
            
            if (companyData) {
                setCompanyInfo({ name: companyData.name, industry: companyData.industry });
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }, []);

    const fetchChatData = React.useCallback(async () => {
        setLoadingChat(true);
        try {
            const response = await fetch(`/api/chat/messages/${chatid}`);
            if (response.ok) {
                const data = await response.json();
                setChatData(data);
                
                // ユーザータイプを判定
                if (data.room.student_id === user?.id) {
                    setUserType('student');
                } else {
                    setUserType('company');
                }

                // 学生と会社の情報を取得
                await fetchUserInfo(data.room.student_id, data.room.company_id);
            } else if (response.status === 404) {
                setChatData(null);
            } else {
                console.error('Failed to fetch chat data');
            }
        } catch (error) {
            console.error('Error fetching chat data:', error);
        }
        setLoadingChat(false);
    }, [chatid, user?.id, fetchUserInfo]);

    React.useEffect(() => {
        if (chatid && user && !loading) {
            fetchChatData();
        }
    }, [chatid, user, loading, fetchChatData]);

    // WebSocketからのメッセージを処理
    React.useEffect(() => {
        if (lastMessage && lastMessage.type === 'chat_message' && chatData) {
            const newMessage = lastMessage.data as ChatMessage;
            setChatData(prev => {
                if (!prev) return prev;
                // 既に存在するメッセージかチェック
                const messageExists = prev.messages.some(msg => msg.id === newMessage.id);
                if (messageExists) return prev;
                
                return {
                    ...prev,
                    messages: [...prev.messages, newMessage]
                };
            });
        }
    }, [lastMessage, chatData]);

    // メッセージが更新されたときに自動スクロール
    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatData?.messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !chatData || !userType || sending) return;

        setSending(true);
        try {
            const response = await fetch('/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomId: chatData.room.id,
                    message: newMessage,
                    senderType: userType,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setChatData(prev => {
                    if (!prev) return prev;
                    
                    // 既に存在するメッセージかチェック（重複防止）
                    const messageExists = prev.messages.some(msg => msg.id === data.message.id);
                    if (messageExists) return prev;
                    
                    return {
                        ...prev,
                        messages: [...prev.messages, data.message]
                    };
                });
                setNewMessage('');
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
        setSending(false);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };
    
    if (loading || loadingChat || !chatid) {
        return (
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
            <Typography variant='h4'>読み込み中...</Typography>
          </Container>
        );
    }
    
    if(!user){
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
    
    if(!chatData){
        return(
            <Container sx={{height: "85vh"} }>
                <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
                <Typography variant='h4'>このチャットは存在しません</Typography>
            </Container>
        )
    }

    const otherPartyName = userType === 'student' ? companyInfo?.name : studentInfo?.name;
    const otherPartyDetail = userType === 'student' ? companyInfo?.industry : studentInfo?.university;

    return (
        <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column", height: "85vh"}}>
            <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
            <Typography variant='h5'>{otherPartyName || '読み込み中...'}</Typography>
            {otherPartyDetail && (
                <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 2 }}>
                    {otherPartyDetail}
                </Typography>
            )}
            <Box sx={{ flex:1, overflowY: "auto", p:2}}>
                <Stack spacing={1}>
                    {chatData.messages.map((message, index) => {
                        const isMyMessage = message.sender_type === userType;
                        const senderName = message.sender_type === 'student' ? studentInfo?.name : companyInfo?.name;
                        
                        return (
                            <Stack key={index} sx={{alignSelf: isMyMessage ? "flex-end" : "flex-start"}}>
                                <Typography sx={{fontSize:16}}>
                                    {isMyMessage ? 'あなた' : senderName || '読み込み中...'}
                                </Typography>
                                <Card sx={{
                                    p: 2, 
                                    maxWidth: 600, 
                                    width: "fit-content",
                                    bgcolor: isMyMessage ? "primary.main" : "grey.100",
                                    color: isMyMessage ? "white" : "text.primary",
                                    borderRadius: 2,
                                    boxShadow: 1
                                }}>
                                    <Typography>{message.message}</Typography>
                                </Card>
                                <Typography variant="overline" color="text.secondary">
                                    {new Date(message.created_at).toLocaleString("ja-JP")}
                                </Typography>
                            </Stack>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </Stack>
            </Box>
            <Box sx={{p: 2, borderTop: "1px solid #ddd", display: "flex", gap: 1}}>
                <TextField 
                    fullWidth 
                    placeholder='メッセージを入力' 
                    variant='outlined'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                />
                <Button 
                    variant='contained'
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                >
                    {sending ? '送信中...' : '送信'}
                </Button>
            </Box>
        </Container>
    )
}
