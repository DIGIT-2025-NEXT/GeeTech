import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sseManager } from '@/lib/sse-manager'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { roomId, message, senderType } = body

    if (!roomId || !message || !senderType) {
      return NextResponse.json(
        { error: 'roomId, message, and senderType are required' },
        { status: 400 }
      )
    }

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
    let hasAccess = false
    if (senderType === 'student' && room.student_id === user.id) {
      hasAccess = true
    } else if (senderType === 'company') {
      // 企業ユーザーの場合、company テーブルでuser_idをチェック
      const { data: company } = await supabase
        .from('company')
        .select('id')
        .eq('user_id', user.id)
        .eq('id', room.company_id)
        .single()
      
      if (company) {
        hasAccess = true
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // メッセージを保存
    const { data: newMessage, error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: user.id,
        sender_type: senderType,
        message: message
      })
      .select()
      .single()

    if (messageError) {
      console.error('Error saving message:', messageError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // チャットルームの更新日時を更新
    await supabase
      .from('chat_rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', roomId)

    // SSEでリアルタイムブロードキャスト
    try {
      const broadcastMessage = {
        type: 'chat_message',
        data: newMessage,
        roomId: roomId,
        timestamp: Date.now()
      }

      sseManager.broadcastToRoom(roomId, broadcastMessage)
      console.log(`Message broadcasted via SSE for room ${roomId}`)
    } catch (sseError) {
      console.error('SSE broadcast error:', sseError)
      // SSEエラーは送信処理を失敗させない
    }

    return NextResponse.json({ message: newMessage }, { status: 201 })

  } catch (error) {
    console.error('Error in chat send API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}