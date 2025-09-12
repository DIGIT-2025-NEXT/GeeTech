
"use client";

import { Box, Button, Container, Stack, TextField, Typography, Card, CardContent} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
        console.log(`Fetching chat data for chatid: ${chatid}, user: ${user?.id}`);
        try {
            const response = await fetch(`/api/chat/messages/${chatid}`);
            console.log(`Initial fetch response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Initial fetch data:', {
                    messagesCount: data.messages?.length || 0,
                    roomStudentId: data.room?.student_id,
                    roomCompanyId: data.room?.company_id,
                    currentUserId: user?.id
                });
                
                setChatData(data);
                
                // ユーザータイプを判定
                if (data.room.student_id === user?.id) {
                    console.log('User type determined: student');
                    setUserType('student');
                } else {
                    console.log('User type determined: company');
                    setUserType('company');
                }

                // 学生と会社の情報を取得
                await fetchUserInfo(data.room.student_id, data.room.company_id);
            } else if (response.status === 404) {
                console.log('Chat room not found (404)');
                setChatData(null);
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch chat data:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error fetching chat data:', error);
        }
        setLoadingChat(false);
    }, [chatid, user?.id, fetchUserInfo]);

    // 破損したSupabaseクッキーをクリアする関数
    const clearSupabaseCookies = React.useCallback(() => {
        if (typeof window !== 'undefined') {
            const cookiesToClear = [
                'sb-access-token',
                'sb-refresh-token', 
                'supabase-auth-token',
                'sb-auth-token'
            ];
            
            cookiesToClear.forEach(cookieName => {
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            });
        }
    }, []);

    React.useEffect(() => {
        if (chatid && user && !loading) {
            fetchChatData();
        }
    }, [chatid, user, loading, fetchChatData]);

    // シンプルなポーリングによるリアルタイム更新
    React.useEffect(() => {
        if (!chatData || !chatid) return;

        console.log(`Setting up polling updates for room: ${chatid} (${userType})`);
        
        const pollForNewMessages = async () => {
            try {
                console.log(`Polling for ${userType} in room ${chatid} - making request...`);
                const response = await fetch(`/api/chat/messages/${chatid}`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                    }
                });
                
                console.log(`Polling response for ${userType}: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`Polling data for ${userType}:`, {
                        messagesCount: data.messages?.length || 0,
                        room: data.room ? 'present' : 'missing'
                    });
                    
                    setChatData(prev => {
                        if (!prev) {
                            console.log(`No previous data for ${userType}, setting new data`);
                            return data;
                        }
                        
                        // メッセージ数または最後のメッセージのIDをチェック
                        const hasNewMessages = 
                            data.messages.length !== prev.messages.length ||
                            (data.messages.length > 0 && prev.messages.length > 0 &&
                             data.messages[data.messages.length - 1].id !== prev.messages[prev.messages.length - 1].id);
                        
                        if (hasNewMessages) {
                            console.log(`New messages detected via polling for ${userType}:`, {
                                oldLength: prev.messages.length,
                                newLength: data.messages.length
                            });
                            return data;
                        }
                        console.log(`No new messages for ${userType}`);
                        return prev;
                    });
                } else {
                    const errorText = await response.text();
                    console.error(`Polling error ${response.status} for ${userType}:`, errorText);
                }
            } catch (error) {
                console.error(`Error polling for new messages (${userType}):`, error);
            }
        };

        // 2秒ごとにポーリング
        const pollInterval = setInterval(pollForNewMessages, 2000);

        return () => {
            console.log(`Stopping polling for ${userType}`);
            clearInterval(pollInterval);
        };
    }, [chatData, chatid, userType]);

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
                // SSEでメッセージが自動的に追加されるので、送信成功時はメッセージをクリアするだけ
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
        <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column",height: "85vh"}}>
        <Box sx={{py:4}}><Link href="/chat">←チャット一覧に戻る</Link></Box>
        <Typography variant='h5'>{otherPartyName}</Typography>
            <Box sx={{ flex:1,overflowY: "auto",p:2}}>
                <Stack spacing={1}>
                    {chatData.messages.map((message: any, index: number) =>
                    message.sender_type === "student" ? (
                    <Stack key={index} sx={{alignSelf: "flex-end"}}>
                        <Typography sx={{fontSize:16}}>{studentInfo?.name}</Typography>
                        <Card sx={{p:1,maxWidth: 600, width: "fit-content",bgcolor:"aqua"}}>
                            <Typography>{message.message}</Typography>
                        </Card>
                        <Typography variant="overline" color="text.secondary">
                            {new Date(message.created_at).toLocaleString("ja-JP")}
                        </Typography>
                    </Stack>
                    ):(
                    <Stack key={index} sx={{alignSelf: "flex-start"}}>
                        <Typography sx={{fontSize:16}}>{companyInfo?.name}</Typography>
                        <Card sx={{p:1,maxWidth: 600, width: "fit-content",bgcolor:"white"}}>
                            <Typography>{message.message}</Typography>
                        </Card>
                        <Typography variant="overline" color="text.secondary">
                            {new Date(message.created_at).toLocaleString("ja-JP")}
                        </Typography>
                    </Stack>
                    ))}
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
                    onKeyDown={handleKeyPress}
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
