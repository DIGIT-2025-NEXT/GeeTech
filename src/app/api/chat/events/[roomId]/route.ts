import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params
  
  try {
    // まず認証チェック
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // ルームへのアクセス権限を確認
    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return new Response('Room not found', { status: 404 })
    }

    // ユーザーがこのルームにアクセス権限があるかチェック
    let hasAccess = false
    if (room.student_id === user.id) {
      hasAccess = true
    } else {
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
      return new Response('Access denied', { status: 403 })
    }
  } catch (error) {
    console.error('Authentication error in SSE:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
  
  // Server-Sent Events のヘッダー設定
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Cache-Control',
  }

  const encoder = new TextEncoder()
  let controller: ReadableStreamDefaultController<Uint8Array>

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl
      
      // 接続確認メッセージ
      const connectMessage = `data: ${JSON.stringify({
        type: 'connected',
        roomId,
        timestamp: Date.now()
      })}\n\n`
      
      controller.enqueue(encoder.encode(connectMessage))
      
      // 定期的にkeep-aliveメッセージを送信
      const keepAlive = setInterval(() => {
        try {
          const keepAliveMessage = `data: ${JSON.stringify({
            type: 'keep-alive',
            timestamp: Date.now()
          })}\n\n`
          controller.enqueue(encoder.encode(keepAliveMessage))
        } catch (error) {
          console.error('Keep-alive error:', error)
          clearInterval(keepAlive)
        }
      }, 30000) // 30秒ごと

      // シンプルなキープアライブ機能のみ実装
      const setupSimpleSSE = () => {
        try {
          // 接続終了時のクリーンアップ
          request.signal.addEventListener('abort', () => {
            clearInterval(keepAlive)
            try {
              controller.close()
            } catch {
              // Already closed
            }
          })
          
        } catch (error) {
          console.error('Error setting up SSE:', error)
        }
      }

      setupSimpleSSE()
    }
  })

  return new Response(stream, { headers })
}