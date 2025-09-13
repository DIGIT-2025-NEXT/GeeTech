import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // セッション確認
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // プロファイル確認
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return Response.json({
      user: session.user,
      profile: profile,
      profileError: profileError?.message
    })

  } catch (error) {
    console.error('Profile setup GET error:', error)
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    
    // セッション確認
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // プロファイルを作成または更新
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        profile_type: body.profile_type,
        first_name: body.first_name || '',
        last_name: body.last_name || '',
        username: body.username || '',
        company_name: body.company_name || null,
        email: session.user.email,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Profile upsert error:', error)
      return Response.json(
        { error: 'Failed to create/update profile: ' + error.message },
        { status: 500 }
      )
    }

    return Response.json({
      message: 'Profile updated successfully',
      profile: data
    })

  } catch (error) {
    console.error('Profile setup POST error:', error)
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}