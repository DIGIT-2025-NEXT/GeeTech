import { createClient } from './supabase/client';
import type { Tables } from './types_db';

type ProjectApplication = Tables<'project_applications'>;
type ProjectApplicationInsert = {
  project_id: string;
  user_id: string;
  status?: string;
};

export async function applyToProject(data: ProjectApplicationInsert): Promise<{ success: boolean; error?: string; data?: ProjectApplication }> {
  const supabase = createClient();

  try {
    console.log('applyToProject called with data:', data);

    // 既に応募済みかチェック
    console.log('Checking for existing applications...');
    const { data: existingApplication, error: checkError } = await supabase
      .from('project_applications')
      .select('*')
      .eq('project_id', data.project_id)
      .eq('user_id', data.user_id)
      .single();

    console.log('Existing application check:', { existingApplication, checkError });

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116は「該当データなし」なので問題なし、それ以外はエラー
      console.error('Check error (not PGRST116):', checkError);
      throw checkError;
    }

    let applicationData;

    if (existingApplication) {
      // 既存の応募がある場合
      if (existingApplication.status === 'pending') {
        console.log('Application already pending');
        return {
          success: false,
          error: 'このプロジェクトには既に応募済みです（ステータス: 審査中）'
        };
      } else if (existingApplication.status === 'approved') {
        console.log('Application already approved');
        return {
          success: false,
          error: 'このプロジェクトには既に応募済みです（ステータス: 承認済み）'
        };
      } else if (existingApplication.status === 'rejected') {
        // 不承認の場合は再応募として既存レコードを更新
        console.log('Updating rejected application to pending...');
        const { data: updatedData, error: updateError } = await supabase
          .from('project_applications')
          .update({
            status: 'pending',
            applied_at: new Date().toISOString(),
            status_updated_at: null // ステータス更新日時をリセット
          })
          .eq('id', existingApplication.id)
          .select()
          .single();

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }

        applicationData = updatedData;
        console.log('Application updated successfully:', applicationData);
      }
    } else {
      // 新規応募の場合
      console.log('Creating new application...');
      const insertData = {
        project_id: data.project_id,
        user_id: data.user_id,
        status: data.status || 'pending',
        applied_at: new Date().toISOString()
      };
      console.log('Insert data:', insertData);

      const { data: insertedData, error: insertError } = await supabase
        .from('project_applications')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      applicationData = insertedData;
      console.log('New application created successfully:', applicationData);
    }

    // プロジェクトと企業情報を取得して通知を送信
    try {
      // プロジェクト情報を取得
      const { data: projectData, error: projectError } = await supabase
        .from('project')
        .select('id, title, company_id')
        .eq('id', data.project_id)
        .single();

      if (projectError) {
        console.error('Error fetching project for notification:', projectError);
      } else if (projectData?.company_id) {
        // 企業情報を取得
        const { data: companyData, error: companyError } = await supabase
          .from('company')
          .select('id, name, user_id')
          .eq('id', projectData.company_id)
          .single();

        if (companyError) {
          console.error('Error fetching company for notification:', companyError);
        } else if (companyData?.user_id) {
          // 応募者の情報を取得
          const { data: applicantData, error: applicantError } = await supabase
            .from('profiles')
            .select('username, first_name, email')
            .eq('id', data.user_id)
            .single();

          const applicantName = applicantData?.username || applicantData?.first_name || applicantData?.email || '匿名ユーザー';

          // 企業側に通知を送信
          await supabase.rpc('send_notification', {
            p_recipient_id: companyData.user_id,
            p_actor_id: data.user_id,
            p_title: `新しい応募: ${projectData.title}`,
            p_body: `${applicantName}さんがプロジェクト「${projectData.title}」に応募しました。ダッシュボードから確認できます。`,
            p_link: '/dashboard'
          });

          console.log('Notification sent to company user:', companyData.user_id);
        }
      }
    } catch (notificationError) {
      console.error('Failed to send application notification:', notificationError);
      // 通知エラーは応募処理の成功には影響させない
    }

    return {
      success: true,
      data: applicationData
    };

  } catch (error) {
    console.error('Error applying to project:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);

    if (error && typeof error === 'object') {
      console.error('Error keys:', Object.keys(error));
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : '応募処理中にエラーが発生しました'
    };
  }
}

export async function getUserApplications(userId: string): Promise<{ success: boolean; data?: ProjectApplication[]; error?: string }> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('project_applications')
      .select(`
        *,
        project:project_id (
          id,
          title,
          description,
          company:company_id (
            id,
            name,
            logo
          )
        )
      `)
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || []
    };

  } catch (error) {
    console.error('Error fetching user applications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '応募履歴の取得中にエラーが発生しました'
    };
  }
}

export async function getProjectApplications(projectId: string): Promise<{ success: boolean; data?: ProjectApplication[]; error?: string }> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('project_applications')
      .select(`
        *,
        user:user_id (
          id,
          email
        )
      `)
      .eq('project_id', projectId)
      .order('applied_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || []
    };

  } catch (error) {
    console.error('Error fetching project applications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'プロジェクト応募者の取得中にエラーが発生しました'
    };
  }
}