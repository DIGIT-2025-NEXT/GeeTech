import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { studentId, companyId } = await request.json()

    if (!studentId || !companyId) {
      return NextResponse.json(
        { error: 'studentId and companyId are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('student_likes')
      .insert({
        student_id: studentId,
        company_id: companyId,
      })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already liked this company' },
          { status: 409 }
        )
      }
      console.error('Error adding like:', error)
      return NextResponse.json(
        { error: 'Failed to add like' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/likes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { error } = await supabase
      .from('student_likes')
      .delete()
      .eq('student_id', studentId)
      .eq('company_id', companyId)

    if (error) {
      console.error('Error removing like:', error)
      return NextResponse.json(
        { error: 'Failed to remove like' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/likes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('student_likes')
      .select(`
        company_id,
        company:company_id (
          id,
          name,
          industry,
          description,
          features,
          logo,
          is_verified
        )
      `)
      .eq('student_id', studentId)

    if (error) {
      console.error('Error fetching likes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch likes' },
        { status: 500 }
      )
    }

    const likedCompanies = data?.map(item => item.company).filter(Boolean) || []

    return NextResponse.json({ companies: likedCompanies }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/likes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}