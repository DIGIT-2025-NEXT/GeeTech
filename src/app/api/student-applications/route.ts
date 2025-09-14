import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const studentId = user.id;

  try {
    // プロジェクト応募データを取得
    const { data: projectApplications, error: projectError } = await supabase
      .from('project_applications')
      .select('*')
      .eq('user_id', studentId)
      .order('applied_at', { ascending: false });

    if (projectError) {
      console.error('Project applications error:', projectError);
      return NextResponse.json({ error: 'Failed to fetch applications', details: projectError }, { status: 500 });
    }

    console.log('Project applications data:', projectApplications);

    if (!projectApplications || projectApplications.length === 0) {
      return NextResponse.json([]);
    }

    // プロジェクトIDを抽出
    const projectIds = projectApplications.map(app => app.project_id);

    // プロジェクト情報を取得
    const { data: projects, error: projectsError } = await supabase
      .from('project')
      .select('*')
      .in('id', projectIds);

    if (projectsError) {
      console.error('Projects error:', projectsError);
      return NextResponse.json({ error: 'Failed to fetch projects', details: projectsError }, { status: 500 });
    }

    console.log('Projects data:', projects);

    // 企業IDを抽出
    const companyIds = projects?.map(project => project.company_id) || [];

    // 企業情報を取得
    const { data: companies, error: companiesError } = await supabase
      .from('company')
      .select('id, name, logo')
      .in('id', companyIds);

    if (companiesError) {
      console.error('Companies error:', companiesError);
      return NextResponse.json({ error: 'Failed to fetch companies', details: companiesError }, { status: 500 });
    }

    console.log('Companies data:', companies);

    interface ProjectApplication {
      id: string;
      project_id: string;
      user_id: string;
      status: string;
      applied_at: string;
      status_updated_at?: string;
    }

    interface Project {
      id: string;
      title: string;
      company_id: string;
    }

    interface Company {
      id: string;
      name: string;
      logo?: string;
    }

    const applications: {
      id: string;
      projectTitle?: string;
      companyName: string;
      status: "pending" | "approved" | "rejected";
      appliedAt?: string;
      type: "project";
    }[] = [];

    // データを結合
    (projectApplications as ProjectApplication[]).forEach((app) => {
      const project = (projects as Project[])?.find(p => p.id === app.project_id);
      const company = (companies as Company[])?.find(c => c.id === project?.company_id);

      console.log('Processing application:', app, 'project:', project, 'company:', company);

      applications.push({
        id: app.id,
        projectTitle: project?.title || 'プロジェクト名不明',
        companyName: company?.name || '企業名不明',
        status: app.status || 'pending',
        appliedAt: app.applied_at,
        type: 'project'
      });
    });

    console.log('Final applications array:', applications);

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}