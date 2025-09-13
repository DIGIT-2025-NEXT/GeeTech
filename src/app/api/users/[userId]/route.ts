import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    
    // Service roleキーを使用して管理者権限でアクセス
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration:', { 
        hasUrl: !!supabaseUrl, 
        hasServiceKey: !!supabaseServiceKey 
      });
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // 管理者権限でSupabaseクライアントを作成（RLS bypass）
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Fetching user info with admin privileges for userId:', userId);

    // まずprofilesテーブルの全体件数を確認
    const { count: totalProfiles, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
    
    console.log('Total profiles in table:', totalProfiles, countError);

    // 特定のユーザーIDでprofileを検索
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    console.log('Server profile query result:', { 
      userId,
      data: profileData, 
      error: profileError,
      errorCode: profileError?.code,
      errorMessage: profileError?.message,
      errorDetails: profileError?.details
    });

    // profileテーブルの全データを確認（最初の10件）
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, username, email')
      .limit(10)
    
    console.log('Sample profiles in table:', { 
      data: allProfiles, 
      error: allError,
      searchingFor: userId
    });

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError.message },
        { status: 500 }
      )
    }

    // studentsテーブルの全体件数を確認
    const { count: totalStudents, error: studentCountError } = await supabase
      .from('students')
      .select('*', { count: 'exact' })
    
    console.log('Total students in table:', totalStudents, studentCountError);

    // 学生情報も取得
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single()

    console.log('Server students query result:', { 
      userId,
      data: studentData, 
      error: studentError,
      errorCode: studentError?.code,
      errorMessage: studentError?.message
    });

    // studentsテーブルの全データを確認（最初の10件）
    const { data: allStudents, error: allStudentsError } = await supabase
      .from('students')
      .select('id, name, university')
      .limit(10)
    
    console.log('Sample students in table:', { 
      data: allStudents, 
      error: allStudentsError,
      searchingFor: userId
    });

    // 名前を組み合わせる
    let displayName = '学生';
    let university = '大学未設定';

    if (profileData && !profileError) {
      const firstName = profileData.first_name || '';
      const lastName = profileData.last_name || '';
      const username = profileData.username || '';
      const email = profileData.email || '';

      if (firstName && lastName) {
        displayName = `${firstName} ${lastName}`;
      } else if (firstName) {
        displayName = firstName;
      } else if (lastName) {
        displayName = lastName;
      } else if (username) {
        displayName = username;
      } else if (email) {
        displayName = email.split('@')[0];
      } else {
        displayName = `学生 (ID: ${userId.substring(0, 8)})`;
      }
    }

    if (studentData && !studentError && studentData.university) {
      university = studentData.university;
    }

    console.log('Server returning user info:', { displayName, university });

    return NextResponse.json({
      name: displayName,
      university: university,
      profile: profileData,
      student: studentData,
      debug: {
        userId,
        totalProfiles,
        totalStudents,
        profileError: profileError?.message,
        studentError: studentError?.message,
        hasServiceKey: !!supabaseServiceKey,
        allProfiles: allProfiles?.slice(0, 3) // 最初の3件のみ
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}