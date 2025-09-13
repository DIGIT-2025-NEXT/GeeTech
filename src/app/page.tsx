import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('profile_type')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      redirect('/profile');
    }
    
    if (profile?.profile_type === 'company') {
      redirect('/company');
    } else {
      redirect('/students');
    }
  } else {
    redirect('/login');
  }
}

