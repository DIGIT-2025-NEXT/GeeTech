import React, { useEffect, useRef, useState } from 'react';

export interface WebSocketMessage {
  type: 'chat_message' | 'user_join' | 'user_leave';
  data: unknown;
  roomId?: string;
  timestamp: number;
}

export function useWebSocket(roomId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = React.useCallback(() => {
    if (!roomId || wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      // 開発環境ではlocalhost、本番環境では適切なWSURLを使用
      // const wsUrl = `ws://localhost:3001/chat/${roomId}`;
      
      // WebSocketの代わりにServer-Sent Events (SSE)を使用
      // WebSocketサーバーがない場合でもリアルタイム更新が可能
      const eventSource = new EventSource(`/api/chat/events/${roomId}`);
      
      eventSource.onopen = () => {
        console.log('SSE connection opened for room:', roomId);
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setIsConnected(false);
        eventSource.close();
        
        // 再接続を試行
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      // EventSourceをWebSocketの代わりに保存
      (wsRef.current as unknown) = eventSource;
      
    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      setIsConnected(false);
    }
  }, [roomId]);

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    const connection = wsRef.current as EventSource | null;
    if (connection) {
      if (connection instanceof EventSource) {
        connection.close();
      }
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  const sendMessage = (message: Omit<WebSocketMessage, 'timestamp'>) => {
    // SSEは一方向通信なので、通常のHTTP POSTでメッセージを送信
    return fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...message,
        roomId,
      }),
    });
  };

  useEffect(() => {
    if (roomId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [roomId, connect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
  };
}