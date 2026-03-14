import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/src/lib/supabase/server';

export default async function Home() {
  const supabase = await getServerSupabase();

  if (!supabase) {
    redirect('/dashboard');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? '/dashboard' : '/login');
}
