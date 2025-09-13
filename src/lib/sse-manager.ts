// SSEコネクション管理システム
type SSEConnection = {
  controller: ReadableStreamDefaultController<Uint8Array>;
  roomId: string;
  userId: string;
}

class SSEManager {
  private connections = new Map<string, SSEConnection[]>()
  private encoder = new TextEncoder()

  // 新しいコネクションを追加
  addConnection(roomId: string, userId: string, controller: ReadableStreamDefaultController<Uint8Array>) {
    const connectionId = `${roomId}-${userId}-${Date.now()}`

    if (!this.connections.has(roomId)) {
      this.connections.set(roomId, [])
    }

    const roomConnections = this.connections.get(roomId)!
    roomConnections.push({ controller, roomId, userId })

    console.log(`SSE connection added for room ${roomId}, user ${userId}. Total connections: ${roomConnections.length}`)

    return connectionId
  }

  // コネクションを削除
  removeConnection(roomId: string, userId: string, controller: ReadableStreamDefaultController<Uint8Array>) {
    const roomConnections = this.connections.get(roomId)
    if (!roomConnections) return

    const index = roomConnections.findIndex(conn => conn.controller === controller)
    if (index !== -1) {
      roomConnections.splice(index, 1)
      console.log(`SSE connection removed for room ${roomId}, user ${userId}. Remaining connections: ${roomConnections.length}`)

      if (roomConnections.length === 0) {
        this.connections.delete(roomId)
      }
    }
  }

  // 特定のルームにメッセージをブロードキャスト
  broadcastToRoom(roomId: string, message: any) {
    const roomConnections = this.connections.get(roomId)
    if (!roomConnections || roomConnections.length === 0) {
      console.log(`No SSE connections for room ${roomId}`)
      return
    }

    const messageData = `data: ${JSON.stringify(message)}\n\n`
    const encodedMessage = this.encoder.encode(messageData)

    // 無効なコネクションを追跡
    const invalidConnections: number[] = []

    roomConnections.forEach((connection, index) => {
      try {
        connection.controller.enqueue(encodedMessage)
        console.log(`Message broadcasted to room ${roomId}, user ${connection.userId}`)
      } catch (error) {
        console.error(`Failed to send message to connection ${index}:`, error)
        invalidConnections.push(index)
      }
    })

    // 無効なコネクションを削除（逆順で削除してインデックスの整合性を保つ）
    invalidConnections.reverse().forEach(index => {
      roomConnections.splice(index, 1)
    })

    if (roomConnections.length === 0) {
      this.connections.delete(roomId)
    }
  }

  // デバッグ情報取得
  getStatus() {
    const status = Array.from(this.connections.entries()).map(([roomId, connections]) => ({
      roomId,
      connectionCount: connections.length,
      userIds: connections.map(conn => conn.userId)
    }))

    return {
      totalRooms: this.connections.size,
      totalConnections: Array.from(this.connections.values()).reduce((sum, conns) => sum + conns.length, 0),
      rooms: status
    }
  }
}

// シングルトンインスタンス
export const sseManager = new SSEManager()