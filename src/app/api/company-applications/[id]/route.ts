import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: applicationId } = await context.params;
  const { status } = await request.json();

  // ステータスの値をバリデーション
  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status. Must be "approved" or "rejected"' }, { status: 400 });
  }

  try {
    // 応募情報を取得して、企業の所有するプロジェクトかどうか確認
    const { data: application, error: appError } = await supabase
      .from('project_applications')
      .select(`
        *,
        project:project_id (
          id,
          company_id,
          title
        )
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      console.error('Application not found:', appError);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // 企業情報を取得
    const { data: company, error: companyError } = await supabase
      .from('company')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (companyError || !company) {
      console.error('Company not found:', companyError);
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // プロジェクトが企業のものかチェック
    if (application.project?.company_id !== company.id) {
      return NextResponse.json({ error: 'Unauthorized to update this application' }, { status: 403 });
    }

    // ステータスを更新
    const { data: updatedApplication, error: updateError } = await supabase
      .from('project_applications')
      .update({
        status: status,
        status_updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update application status', details: updateError }, { status: 500 });
    }

    // 通知を送信（オプション）
    try {
      await supabase.rpc('send_notification', {
        p_recipient_id: application.user_id,
        p_actor_id: user.id,
        p_title: `応募結果通知: ${application.project?.title}`,
        p_body: status === 'approved' ? 'おめでとうございます！応募が承認されました。' : '申し訳ございませんが、今回は見送らせていただきます。',
        p_link: `/dashboard`
      });
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // 通知エラーは致命的でないため、レスポンスには影響させない
    }

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: `応募ステータスを「${status === 'approved' ? '承認' : '不承認'}」に更新しました`
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}