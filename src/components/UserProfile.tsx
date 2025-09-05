'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function UserProfile() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">プロフィール</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ユーザーID
          </label>
          <p className="mt-1 text-sm text-gray-900 font-mono">{user.id}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            登録日時
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(user.created_at).toLocaleString('ja-JP')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            最終ログイン
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {user.last_sign_in_at 
              ? new Date(user.last_sign_in_at).toLocaleString('ja-JP')
              : '未設定'
            }
          </p>
        </div>
      </div>

      <button
        onClick={signOut}
        className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        ログアウト
      </button>
    </div>
  )
}
