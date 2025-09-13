import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface ChatRoomWithInfo {
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
  } | null;
  company: {
    id: string;
    name: string;
    industry: string;
  } | null;
}

export async function GET() {
  try {
    console.log('Chat rooms API called');
    const supabase = await createClient()

    // ユーザー認証確認
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth check:', { user: user?.id, authError });
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return NextResponse.json(
        { error: 'Unauthorized', details: authError?.message },
        { status: 401 }
      )
    }

    // ユーザーのタイプを判定（studentかcompanyか）
    console.log('Checking user type for user:', user.id);
    const { data: company, error: companyError } = await supabase
      .from('company')
      .select('id')
      .eq('user_id', user.id)
      .single()
    
    console.log('Company check result:', { company, companyError });

    let rooms: ChatRoomWithInfo[] = []
    let userType: 'student' | 'company' = 'student'
    
    if (company) {
      userType = 'company'
      console.log('Fetching rooms for company:', company.id);
      
      // 企業ユーザーの場合 - 基本情報のみ取得
      const { data: companyRooms, error: roomsError } = await supabase
        .from('chat_rooms')
        .select('id, student_id, company_id, created_at, updated_at')
        .eq('company_id', company.id)
        .order('updated_at', { ascending: false })

      console.log('Company rooms query result:', { companyRooms, roomsError });

      if (roomsError) {
        console.error('Error fetching company rooms:', roomsError)
        return NextResponse.json(
          { error: 'Failed to fetch chat rooms', details: roomsError.message },
          { status: 500 }
        )
      }

      if (companyRooms && companyRooms.length > 0) {
        // 学生と会社の情報を別途取得
        const roomsWithInfo = await Promise.all(
          companyRooms.map(async (room) => {
            console.log('Company room - fetching info for student_id:', room.student_id);
            
            // サーバーサイドでは直接profilesテーブルにアクセス可能（RLSをバイパス）
            const [profileResult, studentResult, companyResult] = await Promise.all([
              supabase.from('profiles').select('first_name, last_name, username, email').eq('id', room.student_id).single(),
              supabase.from('students').select('university').eq('id', room.student_id).single(),
              supabase.from('company').select('id, name, industry').eq('id', room.company_id).single()
            ])
            
            console.log('Company API Profile query result:', { 
              studentId: room.student_id,
              profileData: profileResult.data, 
              profileError: profileResult.error 
            });
            
            let studentName = '学生';
            
            if (profileResult.data && !profileResult.error) {
              console.log('Company API - Profile data fields:', {
                first_name: profileResult.data.first_name,
                last_name: profileResult.data.last_name,
                username: profileResult.data.username,
                email: profileResult.data.email
              });
              
              const firstName = profileResult.data.first_name || '';
              const lastName = profileResult.data.last_name || '';
              const username = profileResult.data.username || '';
              const email = profileResult.data.email || '';
              
              if (firstName && lastName) {
                studentName = `${firstName} ${lastName}`;
                console.log('✓ Company API got full name:', studentName);
              } else if (firstName) {
                studentName = firstName;
                console.log('✓ Company API got first name:', studentName);
              } else if (lastName) {
                studentName = lastName;
                console.log('✓ Company API got last name:', studentName);
              } else if (username) {
                studentName = username;
                console.log('✓ Company API got username:', studentName);
              } else if (email) {
                studentName = email.split('@')[0];
                console.log('✓ Company API got name from email:', studentName);
              } else {
                studentName = `学生 (ID: ${room.student_id.substring(0, 8)})`;
                console.log('✓ Company API using ID fallback:', studentName);
              }
            } else {
              studentName = `学生 (ID: ${room.student_id.substring(0, 8)})`;
              console.log('✗ Company API profile not found, using fallback:', studentName);
            }
            
            return {
              ...room,
              students: {
                id: room.student_id,
                name: studentName,
                university: studentResult.data?.university || '大学未設定'
              },
              company: companyResult.data
            }
          })
        )
        rooms = roomsWithInfo
      }
    } else {
      console.log('Fetching rooms for student:', user.id);
      
      // 学生ユーザーの場合 - 基本情報のみ取得
      const { data: studentRooms, error: roomsError } = await supabase
        .from('chat_rooms')
        .select('id, student_id, company_id, created_at, updated_at')
        .eq('student_id', user.id)
        .order('updated_at', { ascending: false })

      console.log('Student rooms query result:', { studentRooms, roomsError });

      if (roomsError) {
        console.error('Error fetching student rooms:', roomsError)
        return NextResponse.json(
          { error: 'Failed to fetch chat rooms', details: roomsError.message },
          { status: 500 }
        )
      }

      if (studentRooms && studentRooms.length > 0) {
        // 学生と会社の情報を別途取得
        const roomsWithInfo = await Promise.all(
          studentRooms.map(async (room) => {
            console.log('Student room - fetching info for student_id:', room.student_id);
            
            const [profileResult, studentResult, companyResult] = await Promise.all([
              supabase.from('profiles').select('first_name, last_name, username, email').eq('id', room.student_id).single(),
              supabase.from('students').select('university').eq('id', room.student_id).single(),
              supabase.from('company').select('id, name, industry').eq('id', room.company_id).single()
            ])
            
            console.log('Student API Profile query result:', { 
              studentId: room.student_id,
              profileData: profileResult.data, 
              profileError: profileResult.error 
            });
            
            let studentName = '学生';
            
            if (profileResult.data && !profileResult.error) {
              console.log('Student API - Profile data fields:', {
                first_name: profileResult.data.first_name,
                last_name: profileResult.data.last_name,
                username: profileResult.data.username,
                email: profileResult.data.email
              });
              
              const firstName = profileResult.data.first_name || '';
              const lastName = profileResult.data.last_name || '';
              const username = profileResult.data.username || '';
              const email = profileResult.data.email || '';
              
              if (firstName && lastName) {
                studentName = `${firstName} ${lastName}`;
                console.log('✓ Student API got full name:', studentName);
              } else if (firstName) {
                studentName = firstName;
                console.log('✓ Student API got first name:', studentName);
              } else if (lastName) {
                studentName = lastName;
                console.log('✓ Student API got last name:', studentName);
              } else if (username) {
                studentName = username;
                console.log('✓ Student API got username:', studentName);
              } else if (email) {
                studentName = email.split('@')[0];
                console.log('✓ Student API got name from email:', studentName);
              } else {
                studentName = `学生 (ID: ${room.student_id.substring(0, 8)})`;
                console.log('✓ Student API using ID fallback:', studentName);
              }
            } else {
              studentName = `学生 (ID: ${room.student_id.substring(0, 8)})`;
              console.log('✗ Student API profile not found, using fallback:', studentName);
            }
            
            return {
              ...room,
              students: {
                id: room.student_id,
                name: studentName,
                university: studentResult.data?.university || '大学未設定'
              },
              company: companyResult.data
            }
          })
        )
        rooms = roomsWithInfo
      }
    }

    // 各ルームの最新メッセージを取得
    const roomsWithLastMessage = await Promise.all(
      (rooms || []).map(async (room) => {
        const { data: lastMessage } = await supabase
          .from('chat_messages')
          .select('message, created_at, sender_type')
          .eq('room_id', room.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        return {
          ...room,
          lastMessage: lastMessage || null
        }
      })
    )

    console.log('Final result:', { 
      roomsCount: roomsWithLastMessage.length,
      userType 
    });

    return NextResponse.json({ 
      rooms: roomsWithLastMessage,
      userType: userType
    }, { status: 200 })

  } catch (error) {
    console.error('Error in chat rooms API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}