export type ProfileType = 'students' | 'company' | 'admin'

export interface UserProfile {
  id: string
  profile_type: ProfileType | null
  first_name: string | null
  last_name: string | null
  email: string | null
  username: string | null
  company_name: string | null
  bio: string | null
  avatar_url: string | null
  website: string | null
  updated_at: string | null
}

export interface AuthUser {
  id: string
  email?: string
  profile_type?: ProfileType
}

export interface AuthSession {
  user: AuthUser
  access_token: string
  refresh_token: string
  expires_at?: number
}