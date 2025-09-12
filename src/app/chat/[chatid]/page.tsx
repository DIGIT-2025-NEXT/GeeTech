
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
            console.log('=== FETCHING USER INFO VIA API ===');
            console.log('Student ID from chat_rooms:', studentId);
            console.log('Company ID from chat_rooms:', companyId);
            
            // サーバーサイドAPIを経由して学生情報を取得（RLS回避）
            console.log('Fetching student info via API...');
            const studentResponse = await fetch(`/api/users/${studentId}`);
            console.log('Student API response status:', studentResponse.status);
            
            let studentName = '学生';
            let university = '大学未設定';
            
            if (studentResponse.ok) {
                const studentData = await studentResponse.json();
                console.log('Student API data:', studentData);
                
                if (studentData.name && studentData.name !== '学生') {
                    studentName = studentData.name;
                    console.log('✓ Got student name from API:', studentName);
                } else {
                    studentName = `学生 (ID: ${studentId.substring(0, 8)})`;
                    console.log('✓ Using API fallback name:', studentName);
                }
                
                if (studentData.university && studentData.university !== '大学未設定') {
                    university = studentData.university;
                    console.log('✓ Got university from API:', university);
                }
            } else {
                console.log('✗ Student API failed, using fallback');
                studentName = `学生 (ID: ${studentId.substring(0, 8)})`;
            }
            
            // 会社情報を直接取得（権限があるはず）
            console.log('Fetching company info...');
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            
            const { data: companyData, error: companyError } = await supabase
                .from('company')
                .select('name, industry')
                .eq('id', companyId)
                .single();
            
            console.log('Company query result:', { data: companyData, error: companyError });
            
            if (companyData && !companyError) {
                setCompanyInfo({ 
                    name: companyData.name || '企業名不明', 
                    industry: companyData.industry || '業界不明' 
                });
                console.log('✓ Set company info:', companyData.name);
            }
            
            console.log('=== FINAL RESULT ===');
            console.log('Student name:', studentName);
            console.log('University:', university);
            
            setStudentInfo({ 
                name: studentName, 
                university: university 
            });
            
        } catch (error) {
            console.error('=== ERROR IN fetchUserInfo ===', error);
            setStudentInfo({ 
                name: `学生 (ID: ${studentId.substring(0, 8)})`, 
                university: '大学未設定' 
            });
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

    // 破損したSupabaseクッキーをクリアする関数（未使用のため削除予定）
    // const clearSupabaseCookies = React.useCallback(() => {
    //     if (typeof window !== 'undefined') {
    //         const cookiesToClear = [
    //             'sb-access-token',
    //             'sb-refresh-token', 
    //             'supabase-auth-token',
    //             'sb-auth-token'
    //         ];
    //         
    //         cookiesToClear.forEach(cookieName => {
    //             document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    //         });
    //     }
    // }, []);

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
        <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column", height: "85vh"}}>
            <Box sx={{py: 2}}>
                <Link href="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
                    ←チャット一覧に戻る
                </Link>
            </Box>
            <Box sx={{ 
                p: 2, 
                borderBottom: "1px solid #ddd", 
                bgcolor: "background.paper",
                boxShadow: 1
            }}>
                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                    {otherPartyName || '読み込み中...'}
                </Typography>
                {otherPartyDetail && (
                    <Typography variant='subtitle2' color='text.secondary' sx={{ mt: 0.5 }}>
                        {otherPartyDetail}
                    </Typography>
                )}
            </Box>
            <Box sx={{ flex:1, overflowY: "auto", p:2}}>
                <Stack spacing={2}>
                    {chatData.messages.map((message: ChatMessage, index: number) => {
                        const isMyMessage = message.sender_type === userType;
                        const senderName = message.sender_type === 'student' ? studentInfo?.name : companyInfo?.name;
                        
                        return (
                            <Stack key={index} sx={{alignSelf: isMyMessage ? "flex-end" : "flex-start"}}>
                                <Typography sx={{fontSize: 14, mb: 0.5, textAlign: isMyMessage ? 'right' : 'left'}}>
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
                                <Typography variant="caption" color="text.secondary" sx={{textAlign: isMyMessage ? 'right' : 'left', mt: 0.5}}>
                                    {new Date(message.created_at).toLocaleString("ja-JP")}
                                </Typography>
                            </Stack>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </Stack>
            </Box>
            <Box sx={{
                p: 2, 
                borderTop: "1px solid #ddd", 
                display: "flex", 
                gap: 2,
                bgcolor: "background.paper",
                boxShadow: "0 -1px 3px rgba(0,0,0,0.1)"
            }}>
                <TextField 
                    fullWidth 
                    placeholder='メッセージを入力してください' 
                    variant='outlined'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={sending}
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        }
                    }}
                />
                <Button 
                    variant='contained'
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    sx={{
                        borderRadius: 2,
                        minWidth: 80,
                        height: 40
                    }}
                >
                    {sending ? '送信中...' : '送信'}
                </Button>
            </Box>
        </Container>
    )
}
