import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const companyId = searchParams.get('companyId')

    if (!studentId || !companyId) {
      return NextResponse.json(
        { error: 'studentId and companyId are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('student_likes')
      .select('id')
      .eq('student_id', studentId)
      .eq('company_id', companyId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ isLiked: false }, { status: 200 })
      }
      console.error('Error checking like:', error)
      return NextResponse.json(
        { error: 'Failed to check like status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ isLiked: !!data }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/likes/check:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}