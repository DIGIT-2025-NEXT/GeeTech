import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const supabase = await createClient()

    // ユーザー認証確認
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // チャットルームの存在確認とアクセス権限確認
    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Chat room not found' },
        { status: 404 }
      )
    }

    // ユーザーがこのルームにアクセス権限があるかチェック
    console.log('Access check:', {
      userId: user.id,
      roomStudentId: room.student_id,
      roomCompanyId: room.company_id,
      isStudent: room.student_id === user.id
    });

    let hasAccess = false
    if (room.student_id === user.id) {
      console.log('Access granted: User is the student in this room');
      hasAccess = true
    } else {
      // 企業ユーザーの場合、company テーブルでuser_idをチェック
      console.log('Checking company access for user:', user.id);
      const { data: company, error: companyError } = await supabase
        .from('company')
        .select('id')
        .eq('user_id', user.id)
        .eq('id', room.company_id)
        .single()
      
      console.log('Company check result:', { company, companyError });
      
      if (company) {
        console.log('Access granted: User is the company in this room');
        hasAccess = true
      }
    }

    console.log('Final access result:', hasAccess);

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // メッセージを取得（作成日時順にソート）
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select(`
        id,
        sender_id,
        sender_type,
        message,
        created_at,
        updated_at
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      room: room,
      messages: messages || [] 
    }, { status: 200 })

  } catch (error) {
    console.error('Error in chat messages API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}