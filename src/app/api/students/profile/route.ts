// 学生プロファイル管理API
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
      .eq('id', user.id)
      .eq('profile_type', 'students')
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
      .eq('id', user.id)
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

export async function POST(request: NextRequest) {
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

    const { name, university, bio, skills, avatar } = body

    // 必須フィールドの検証
    if (!name || !university || !bio) {
      return Response.json(
        { error: '必須フィールドが不足しています' },
        { status: 400 }
      )
    }

    // studentsテーブルにデータを挿入
    const { data: student, error } = await supabase
      .from('students')
      .insert({
        id: user.id,
        name: name.trim(),
        university: university.trim(),
        bio: bio.trim(),
        skills: skills || [],
        avatar: avatar?.trim() || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)

      // 重複エラーの場合
      if (error.code === '23505') {
        return Response.json(
          { error: 'このユーザーの学生プロフィールは既に存在します' },
          { status: 409 }
        )
      }

      return Response.json(
        { error: 'プロフィール作成に失敗しました', details: error.message },
        { status: 500 }
      )
    }

    return Response.json(
      { message: 'プロフィールが正常に作成されました', student },
      { status: 201 }
    )
  } catch (error) {
    console.error('Student profile POST error:', error)
    return Response.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}