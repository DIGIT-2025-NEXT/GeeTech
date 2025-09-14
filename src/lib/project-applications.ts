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
    // 既に応募済みかチェック
    const { data: existingApplication, error: checkError } = await supabase
      .from('project_applications')
      .select('*')
      .eq('project_id', data.project_id)
      .eq('user_id', data.user_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116は「該当データなし」なので問題なし、それ以外はエラー
      throw checkError;
    }

    if (existingApplication) {
      return {
        success: false,
        error: '既にこのプロジェクトに応募済みです'
      };
    }

    // プロジェクト応募レコードを作成
    const { data: applicationData, error: insertError } = await supabase
      .from('project_applications')
      .insert({
        project_id: data.project_id,
        user_id: data.user_id,
        status: data.status || 'pending',
        applied_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      data: applicationData
    };

  } catch (error) {
    console.error('Error applying to project:', error);
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