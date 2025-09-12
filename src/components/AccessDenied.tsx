'use client'

import { useRouter } from 'next/navigation'

export default function AccessDenied() {
  const router = useRouter()

  const handleHomeClick = () => {
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
      <div className="mb-6">
        <svg 
          className="mx-auto h-16 w-16 text-red-500"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        アクセス権限がありません
      </h2>
      
      <p className="text-gray-600 mb-6">
        このページにアクセスする権限がありません。<br />
        サイト管理者にお問い合わせください。
      </p>

      <button
        onClick={handleHomeClick}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        トップページにに戻る
      </button>
    </div>
  )
}