import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function useProfileCreation() {
  const { user, loading } = useAuth()
  const [profileChecked, setProfileChecked] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)

  useEffect(() => {
    const checkAndCreateProfile = async () => {
      if (loading || !user || profileChecked) return

      const supabase = createClient()

      try {
        // Check if profile exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, profile_type')
          .eq('id', user.id)
          .single()

        console.log('Profile check result:', { profile, error })

        if (profile) {
          console.log('Existing profile details:', {
            id: profile.id,
            profile_type: profile.profile_type,
            email: user.email
          })
        }

        if (!profile) {
          console.log('Creating profile for user:', user.id)

          // Create profile via API
          const response = await fetch('/api/auth/create-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })

          const result = await response.json()
          console.log('Profile creation API result:', result)

          if (response.ok) {
            setProfileCreated(true)
            console.log('Profile created successfully via API')
          } else {
            // Fallback: direct database insert
            console.log('API failed, trying direct insert')
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                profile_type: 'students',
                first_name: null,
                last_name: null,
                username: null,
                company_name: null,
                bio: null,
                avatar_url: null,
                website: null,
                updated_at: new Date().toISOString()
              })
              .select()

            console.log('Direct insert result:', { newProfile, error: insertError })

            if (!insertError) {
              setProfileCreated(true)
            }
          }
        } else {
          console.log('Profile already exists')
          setProfileCreated(true)
        }
      } catch (error) {
        console.error('Error in profile check/creation:', error)
      } finally {
        setProfileChecked(true)
      }
    }

    checkAndCreateProfile()
  }, [user, loading, profileChecked])

  return { profileChecked, profileCreated }
}