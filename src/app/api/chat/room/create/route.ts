import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { studentId, companyId } = body

    if (!studentId || !companyId) {
      return NextResponse.json(
        { error: 'studentId and companyId are required' },
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

    // ユーザーがstudentまたはcompanyのいずれかであることを確認
    let hasPermission = false

    // studentとして作成する場合
    if (user.id === studentId) {
      hasPermission = true
    } else {
      // companyとして作成する場合、company テーブルでuser_idをチェック
      const { data: company } = await supabase
        .from('company')
        .select('id')
        .eq('user_id', user.id)
        .eq('id', companyId)
        .single()
      
      if (company) {
        hasPermission = true
      }
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // 既存のチャットルームがないかチェック
    const { data: existingRoom } = await supabase
      .from('chat_rooms')
      .select('id')
      .eq('student_id', studentId)
      .eq('company_id', companyId)
      .single()

    if (existingRoom) {
      return NextResponse.json(
        { room: existingRoom, existed: true },
        { status: 200 }
      )
    }

    // 新しいチャットルームを作成
    const { data: newRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({
        student_id: studentId,
        company_id: companyId
      })
      .select()
      .single()

    if (roomError) {
      console.error('Error creating room:', roomError)
      return NextResponse.json(
        { error: 'Failed to create chat room' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { room: newRoom, existed: false },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error in chat room create API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}