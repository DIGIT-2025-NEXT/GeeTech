import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // 現在のユーザーを取得
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('Create profile API - User:', user ? `${user.id} (${user.email})` : 'No user')
    console.log('Create profile API - Auth error:', authError)

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です', details: authError?.message },
        { status: 401 }
      )
    }

    // 既存のプロフィールをチェック
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    console.log('Create profile API - Existing profile:', { existingProfile, error: checkError })

    if (existingProfile) {
      // 既存プロフィールがあるが profile_type が設定されていない場合は更新
      if (!existingProfile.profile_type) {
        console.log('Create profile API - Updating existing profile with profile_type')
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ profile_type: 'students', updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .select()
          .single()

        console.log('Create profile API - Profile update result:', { updatedProfile, error: updateError })

        if (updateError) {
          return NextResponse.json(
            { error: 'プロフィール更新に失敗しました', details: updateError.message },
            { status: 500 }
          )
        }

        return NextResponse.json(
          {
            message: 'プロフィールが更新されました',
            profile: updatedProfile
          },
          { status: 200 }
        )
      }

      return NextResponse.json(
        {
          message: 'プロフィールは既に存在します',
          profile: existingProfile
        },
        { status: 200 }
      )
    }

    // 新しいプロフィールを作成（デフォルトでstudents）
    const profileData = {
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
    }

    console.log('Create profile API - Inserting profile:', profileData)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    console.log('Create profile API - Insert result:', { profile, error: profileError })

    if (profileError) {
      console.error('Create profile API - Profile creation error:', profileError)
      return NextResponse.json(
        {
          error: 'プロフィール作成に失敗しました',
          details: profileError.message,
          code: profileError.code
        },
        { status: 500 }
      )
    }

    // user_metadataも更新
    const { error: userUpdateError } = await supabase.auth.updateUser({
      data: { profile_type: 'students' }
    })

    console.log('Create profile API - User metadata update result:', { error: userUpdateError })

    if (userUpdateError) {
      console.error('Create profile API - User metadata update error:', userUpdateError)
      // プロフィールは作成されているので、metadataの更新失敗は警告のみ
    }

    return NextResponse.json(
      {
        message: 'プロフィールが作成されました',
        profile
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create profile API - Unexpected error:', error)
    return NextResponse.json(
      {
        error: '予期せぬエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}