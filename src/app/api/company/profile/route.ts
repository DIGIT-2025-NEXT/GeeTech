// 企業プロファイル管理API
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // セッション確認
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // プロファイル情報を取得
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .eq('profile_type', 'company')
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    
    // セッション確認
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 企業プロファイルの更新
    const { data, error } = await supabase
      .from('profiles')
      .update({
        company_name: body.company_name,
        bio: body.bio,
        website: body.website,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
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