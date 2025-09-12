// 学生プロファイル管理API（認証ミドルウェア使用例）
import { NextRequest } from 'next/server'
import { withRoleAuth } from '@/lib/middleware/api-auth'
import { createClient } from '@/lib/supabase/server'

// 学生ユーザーのみアクセス可能なエンドポイント
export const GET = withRoleAuth(['students', 'admin'])(
  async (request: NextRequest, context) => {
    try {
      const supabase = await createClient()
      
      // プロファイル情報とスキル情報を取得
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_skills (
            skill_id,
            skills (
              skill_name,
              icon_name
            )
          )
        `)
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
      console.error('Student profile GET error:', error)
      return Response.json(
        { error: 'サーバーエラーが発生しました' },
        { status: 500 }
      )
    }
  }
)

export const PUT = withRoleAuth(['students'])(
  async (request: NextRequest, context) => {
    try {
      const body = await request.json()
      const supabase = await createClient()

      // 学生プロファイルの更新
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: body.first_name,
          last_name: body.last_name,
          username: body.username,
          bio: body.bio,
          website: body.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', context.userId)
        .eq('profile_type', 'students') // セキュリティのため、プロファイルタイプも確認
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
      console.error('Student profile PUT error:', error)
      return Response.json(
        { error: 'サーバーエラーが発生しました' },
        { status: 500 }
      )
    }
  }
)