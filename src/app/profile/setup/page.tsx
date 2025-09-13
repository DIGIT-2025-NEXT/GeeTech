'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProfileType } from '@/lib/types/auth'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              プロファイル設定
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              アカウントの設定を完了してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* プロファイルタイプ選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                アカウントタイプ *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="students"
                    checked={profileType === 'students'}
                    onChange={(e) => setProfileType(e.target.value as ProfileType)}
                    className="mr-2"
                  />
                  学生
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="company"
                    checked={profileType === 'company'}
                    onChange={(e) => setProfileType(e.target.value as ProfileType)}
                    className="mr-2"
                  />
                  企業
                </label>
              </div>
            </div>

            {/* 名前入力 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  名 *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  姓 *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* ユーザー名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                ユーザー名 *
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* 企業名（企業選択時のみ表示） */}
            {profileType === 'company' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  企業名 *
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '作成中...' : 'プロファイルを作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}