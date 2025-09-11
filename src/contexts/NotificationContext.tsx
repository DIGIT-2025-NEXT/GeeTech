"use client"

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/lib/types_db'
import { useAuth } from './AuthContext'

type Notification = Tables<'notifications'>

export type SendNotificationParams = {
  recipient_id: string;
  title: string;
  body: string;
  link?: string;
  icon_url?: string;
};

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  sendNotification: (params: SendNotificationParams) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient()
  const { user } = useAuth() // AuthContextからユーザー情報を取得
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // ユーザーが変更されたら（ログアウトなど）、状態をリセット
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [user])

  const fetchNotifications = useCallback(async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notifications:', error)
      return
    }

    setNotifications(data || [])
    const unread = data?.filter(n => !n.is_read).length || 0
    setUnreadCount(unread)
  }, [supabase, user])

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user, fetchNotifications])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Change received!', payload)
          // リアルタイム更新を検知したら再取得
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user, fetchNotifications])

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
    } else {
      fetchNotifications()
    }
  }

  const markAllAsRead = async () => {
    if (!user) return
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', user.id)
      .eq('is_read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
    } else {
      fetchNotifications()
    }
  }

  const sendNotification = useCallback(async (params: SendNotificationParams) => {
    if (!user) {
      throw new Error("認証されていません。通知を送信できませんでした。");
    }

    // バリデーション
    if (!params.recipient_id || !params.title || !params.body) {
      throw new Error("受信者ID、タイトル、本文は必須です。");
    }

    const { error } = await supabase.rpc('send_notification', {
      p_recipient_id: params.recipient_id,
      p_actor_id: user.id,
      p_title: params.title,
      p_body: params.body,
      p_link: params.link,
      p_icon_url: params.icon_url,
    });

    if (error) {
      console.error('Error sending notification:', error);
      throw new Error(`通知の送信に失敗しました: ${error.message}`);
    }
    // 成功した場合、受信者側のリアルタイム更新に任せるので、ここでは何もしない
  }, [supabase, user]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, sendNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
