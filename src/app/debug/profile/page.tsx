'use client'

import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { Container, Typography, Paper, Box, Button } from '@mui/material'

export default function DebugProfilePage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [userMetadata, setUserMetadata] = useState<Record<string, unknown> | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setProfileLoading(false)
        return
      }

      const supabase = createClient()

      try {
        // プロフィールデータを取得
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        console.log('Debug - Profile data:', { profileData, error: profileError })
        setProfile(profileData)

        // ユーザーメタデータを取得
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUserMetadata(currentUser?.user_metadata || {})

      } catch (error) {
        console.error('Debug - Error fetching data:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleCreateProfile = async () => {
    const response = await fetch('/api/auth/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    console.log('Create profile result:', result)
    window.location.reload()
  }

  if (loading || profileLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Please log in to view profile debug info</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Debug Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Authentication Data
          </Typography>
          <Box sx={{ fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify({
              id: user.id,
              email: user.email,
              created_at: user.created_at,
              user_metadata: userMetadata
            }, null, 2)}
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile Database Data
          </Typography>
          {profile ? (
            <Box sx={{ fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(profile, null, 2)}
            </Box>
          ) : (
            <>
              <Typography color="warning.main" gutterBottom>
                No profile found in database
              </Typography>
              <Button variant="contained" onClick={handleCreateProfile}>
                Create Profile
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  )
}