"use client";

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from './useProfile'

export function useAccessControl(allowedTypes: string[]) {
  const router = useRouter()
  const { user, profile, loading, error } = useProfile()

  // アクセス権限をメモ化して計算
  const hasAccess = useMemo(() => {
    if (loading || !user || !profile) return false
    const userProfileType = profile.profile_type
    return userProfileType && allowedTypes.includes(userProfileType)
  }, [loading, user, profile, allowedTypes])

  // ローディング状態をメモ化
  const isLoading = useMemo(() => {
    return loading || !user || !profile || (profile && !hasAccess)
  }, [loading, user, profile, hasAccess])

  useEffect(() => {
    // ローディング中は何もしない
    if (loading) return

    // エラーがある場合はエラーページにリダイレクト
    if (error) {
      console.error('Profile error:', error)
      return
    }

    // 未認証の場合はログインページにリダイレクト
    if (!user) {
      console.log('🚫 No user, redirecting to login')
      router.replace('/login')
      return
    }

    // プロファイルが存在しない場合はプロファイル作成ページにリダイレクト
    if (!profile) {
      console.log('🚫 No profile, redirecting to profile creation')
      router.replace('/profile/create')
      return
    }

    // profile_typeが許可されていない場合はアクセス拒否
    if (!hasAccess) {
      const userProfileType = profile.profile_type
      console.log('👤 User profile_type:', userProfileType)
      console.log('🔐 Allowed types:', allowedTypes)
      console.log('🚫 Access denied for profile_type:', userProfileType, '- redirecting to unauthorized')
      router.replace('/unauthorized')
      return
    }

    console.log('✅ Access granted for profile_type:', profile.profile_type)
  }, [user, profile, loading, error, hasAccess, router, allowedTypes])

  return { 
    loading: isLoading, 
    user, 
    profile,
    error,
    hasAccess
  }
}