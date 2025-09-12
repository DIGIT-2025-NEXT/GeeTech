'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Container, Paper, Typography, Button, Box, Avatar, Divider } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getNext10, Event } from '@/lib/mock' // Import Event type and getNext10

export default function EventsPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([]) // State to store events

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getNext10()
      setEvents(fetchedEvents)
    }
    fetchEvents()
  }, []) // Fetch events on component mount

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography align="center">読み込み中...</Typography>
      </Container>
    )
  }

  if (!user) {
    return null // リダイレクト中
  }

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          イベント一覧
        </Typography>

        {events.length === 0 ? (
          <Typography align="center">イベントがありません。</Typography>
        ) : (
          <Box>
            {events.map((event) => (
              <Box key={event.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  日時: {new Date(event.starts_on).toLocaleString('ja-JP')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  場所: {event.venue || '未定'}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box textAlign="center">
          <Button
            variant="contained"
            color="error"
            onClick={handleSignOut}
            size="large"
          >
            ログアウト
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
