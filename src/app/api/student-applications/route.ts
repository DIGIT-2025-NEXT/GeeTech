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
    const { data: companies, error } = await supabase
      .from('company')
      .select('id, name, participants_id, adoptedid, rejectedid');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }

    const applications: {
      id: number;
      companyName: string;
      status: "Reviewing" | "Accepted" | "Rejected";
    }[] = [];

    companies.forEach((company, index) => {
      const participantsId = company.participants_id || [];
      const adoptedId = company.adoptedid || [];
      const rejectedId = company.rejectedid || [];

      if (participantsId.includes(studentId)) {
        applications.push({
          id: index + 1,
          companyName: company.name,
          status: "Reviewing"
        });
      } else if (adoptedId.includes(studentId)) {
        applications.push({
          id: index + 1,
          companyName: company.name,
          status: "Accepted"
        });
      } else if (rejectedId.includes(studentId)) {
        applications.push({
          id: index + 1,
          companyName: company.name,
          status: "Rejected"
        });
      }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}