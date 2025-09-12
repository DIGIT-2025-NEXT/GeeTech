// 企業プロファイル管理API（認証ミドルウェア使用例）
import { NextRequest } from 'next/server'
import { withRoleAuth } from '@/lib/middleware/api-auth'
import { createClient } from '@/lib/supabase/server'

// 企業ユーザーのみアクセス可能なエンドポイント
export const GET = withRoleAuth(['company', 'admin'])(
  async (request: NextRequest, context) => {
    try {
      const supabase = await createClient()
      
      // プロファイル情報を取得
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', context.userId)
        .single()

      if (error) {
        return Response.json(
          { error: 'プロファイルの取得に失敗しました' },
          { status: 500 }
        )
      }

      return Response.json({ profile })

    } catch (error) {
      console.error('Company profile GET error:', error)
      return Response.json(
        { error: 'サーバーエラーが発生しました' },
        { status: 500 }
      )
    }
  }
)

export const PUT = withRoleAuth(['company'])(
  async (request: NextRequest, context) => {
    try {
      const body = await request.json()
      const supabase = await createClient()

      // 企業プロファイルの更新
      const { data, error } = await supabase
        .from('profiles')
        .update({
          company_name: body.company_name,
          bio: body.bio,
          website: body.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', context.userId)
        .eq('profile_type', 'company') // セキュリティのため、プロファイルタイプも確認
        .select()
        .single()

      if (error) {
        return Response.json(
          { error: 'プロファイルの更新に失敗しました' },
          { status: 500 }
        )
      }

      return Response.json({ 
        message: 'プロファイルが更新されました',
        profile: data 
      })

    } catch (error) {
      console.error('Company profile PUT error:', error)
      return Response.json(
        { error: 'サーバーエラーが発生しました' },
        { status: 500 }
      )
    }
  }
)