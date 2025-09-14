import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const companyUserId = user.id;

  try {
    // まず企業情報を取得してcompany_idを特定
    const { data: company, error: companyError } = await supabase
      .from('company')
      .select('id')
      .eq('user_id', companyUserId)
      .single();

    if (companyError || !company) {
      console.error('Company not found:', companyError);
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    console.log('Company ID:', company.id);

    // 企業のプロジェクトを取得
    const { data: projects, error: projectsError } = await supabase
      .from('project')
      .select('id, title')
      .eq('company_id', company.id);

    if (projectsError) {
      console.error('Projects error:', projectsError);
      return NextResponse.json({ error: 'Failed to fetch projects', details: projectsError }, { status: 500 });
    }

    console.log('Projects:', projects);

    if (!projects || projects.length === 0) {
      return NextResponse.json([]);
    }

    // プロジェクトIDを抽出
    const projectIds = projects.map(project => project.id);

    // プロジェクトへの応募を取得
    const { data: applications, error: applicationsError } = await supabase
      .from('project_applications')
      .select('*')
      .in('project_id', projectIds)
      .order('applied_at', { ascending: false });

    if (applicationsError) {
      console.error('Applications error:', applicationsError);
      return NextResponse.json({ error: 'Failed to fetch applications', details: applicationsError }, { status: 500 });
    }

    console.log('Applications:', applications);

    if (!applications || applications.length === 0) {
      return NextResponse.json([]);
    }

    // 応募者のユーザー情報を取得
    const userIds = applications.map(app => app.user_id);
    console.log('User IDs to fetch profiles for:', userIds);

    // 応募者のプロファイル情報を取得
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, first_name, last_name, email, avatar_url')
      .in('id', userIds);

    if (profilesError) {
      console.error('Profiles error:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch profiles', details: profilesError }, { status: 500 });
    }

    console.log('Profiles:', profiles);
    console.log('Number of profiles found:', profiles?.length || 0);

    interface ApplicationWithProject {
      id: string;
      project_id: string;
      user_id: string;
      status: "pending" | "approved" | "rejected";
      applied_at: string;
      status_updated_at?: string;
    }

    interface Profile {
      id: string;
      username?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      avatar_url?: string;
    }

    interface Project {
      id: string;
      title: string;
    }

    const result = (applications as ApplicationWithProject[]).map((app) => {
      const project = (projects as Project[])?.find(p => p.id === app.project_id);
      const profile = (profiles as Profile[])?.find(p => p.id === app.user_id);

      // first_name last_name (username) 形式で名前を構築
      let applicantName = '名前不明';
      if (profile) {
        const firstName = profile.first_name || '';
        const lastName = profile.last_name || '';
        const username = profile.username || '';

        if (firstName && lastName) {
          applicantName = username ? `${firstName} ${lastName} (${username})` : `${firstName} ${lastName}`;
        } else if (firstName) {
          applicantName = username ? `${firstName} (${username})` : firstName;
        } else if (lastName) {
          applicantName = username ? `${lastName} (${username})` : lastName;
        } else if (username) {
          applicantName = username;
        } else if (profile.email) {
          applicantName = profile.email;
        }
      }

      return {
        id: app.id,
        projectId: app.project_id,
        projectTitle: project?.title || 'プロジェクト名不明',
        userId: app.user_id,
        applicantName,
        applicantEmail: profile?.email,
        status: app.status,
        appliedAt: app.applied_at,
        statusUpdatedAt: app.status_updated_at
      };
    });

    console.log('Final result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching company applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}