'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProfileType } from '@/lib/types/auth'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Avatar
} from '@mui/material'
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material'

export default function ProfileSetupPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profileType, setProfileType] = useState<ProfileType>('students')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    // 既にプロファイルが設定済みのユーザーは適切なホームページにリダイレクト
    if (user) {
      const checkExistingProfile = async () => {
        try {
          const supabase = createClient()
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('profile_type')
            .eq('id', user.id)
            .single()

          if (!error && profile?.profile_type) {
            // 既にプロファイルが設定済みの場合は適切なページにリダイレクト
            if (profile.profile_type === 'company') {
              router.push('/company')
            } else if (profile.profile_type === 'students') {
              router.push('/students')
            } else {
              router.push('/dashboard')
            }
          }
        } catch (profileError) {
          console.error('Error checking existing profile:', profileError)
          // エラーの場合はsetupページを継続表示
        }
      }

      checkExistingProfile()
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('ユーザー情報が見つかりません')
      return
    }

    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setError('必須フィールドを全て入力してください')
      return
    }

    if (profileType === 'company' && !companyName.trim()) {
      setError('企業名を入力してください')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim(),
          company_name: profileType === 'company' ? companyName.trim() : null,
          profile_type: profileType,
          email: user.email,
          updated_at: new Date().toISOString(),
        })

      if (upsertError) {
        throw upsertError
      }

      // プロファイル作成後、適切なページにリダイレクト
      router.push('/dashboard')
    } catch (err) {
      console.error('Profile setup error:', err)
      setError('プロファイルの作成に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            読み込み中...
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ヘッダー */}
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
          <AccountIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          プロファイル設定
        </Typography>
        <Typography variant="h6" color="text.secondary">
          アカウントの初期設定を完了してください
        </Typography>
      </Box>

      {/* ステッパー */}
      <Stepper activeStep={0} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>アカウントタイプ選択</StepLabel>
        </Step>
        <Step>
          <StepLabel>基本情報入力</StepLabel>
        </Step>
        <Step>
          <StepLabel>完了</StepLabel>
        </Step>
      </Stepper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* アカウントタイプ選択 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
              1. アカウントタイプを選択
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card 
                  variant={profileType === 'students' ? 'outlined' : 'elevation'}
                  sx={{ 
                    cursor: 'pointer',
                    border: profileType === 'students' ? 2 : 1,
                    borderColor: profileType === 'students' ? 'primary.main' : 'divider',
                    bgcolor: profileType === 'students' ? 'primary.50' : 'background.paper',
                    '&:hover': { boxShadow: 2 }
                  }}
                  onClick={() => setProfileType('students')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>学生</Typography>
                    <Typography variant="body2" color="text.secondary">
                      就職活動やインターンシップを探している学生向け
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card 
                  variant={profileType === 'company' ? 'outlined' : 'elevation'}
                  sx={{ 
                    cursor: 'pointer',
                    border: profileType === 'company' ? 2 : 1,
                    borderColor: profileType === 'company' ? 'primary.main' : 'divider',
                    bgcolor: profileType === 'company' ? 'primary.50' : 'background.paper',
                    '&:hover': { boxShadow: 2 }
                  }}
                  onClick={() => setProfileType('company')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <BusinessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>企業</Typography>
                    <Typography variant="body2" color="text.secondary">
                      優秀な人材を探している企業・団体向け
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* 基本情報入力 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
              2. 基本情報を入力
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="姓"
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  helperText="例: 田中"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="名"
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  helperText="例: 太郎"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ユーザー名"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  helperText="他のユーザーに表示される名前です"
                />
              </Grid>
              {profileType === 'company' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="企業名"
                    variant="outlined"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    helperText="正式な企業名を入力してください"
                  />
                </Grid>
              )}
            </Grid>
          </Box>

          {/* 送信ボタン */}
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  作成中...
                </>
              ) : (
                'プロファイルを作成'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}