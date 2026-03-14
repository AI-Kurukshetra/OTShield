import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/src/lib/supabase/server';

export async function POST() {
  const supabase = await getServerSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: 'SUPABASE_NOT_CONFIGURED' },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', message: 'Not authenticated' },
      { status: 401 },
    );
  }

  const userId = user.id;

  const [assetsResult, alertsResult, exportsResult] = await Promise.all([
    supabase.from('ot_assets').delete().eq('user_id', userId),
    supabase.from('ot_alerts').delete().eq('user_id', userId),
    supabase.from('ot_siem_exports').delete().eq('user_id', userId),
  ]);

  if (assetsResult.error) {
    console.warn('[OTShield API] reset-workspace assets:', assetsResult.error.message);
  }
  if (alertsResult.error) {
    console.warn('[OTShield API] reset-workspace alerts:', alertsResult.error.message);
  }
  if (exportsResult.error) {
    console.warn('[OTShield API] reset-workspace exports:', exportsResult.error.message);
  }

  return NextResponse.json({ success: true });
}
