'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      const checkProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
        } else if (!data || !data.first_name || !data.last_name) {
          router.push('/profile/edit')
        }
      }
      checkProfile()
    }
  }, [user, router, supabase])

  return (
    <div>
      <h1>Dashboard</h1>
      <p>ダッシュボードページです。</p>
    </div>
  )
}
