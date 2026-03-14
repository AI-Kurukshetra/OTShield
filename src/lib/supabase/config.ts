const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim());
}

export function getSupabaseEnv() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return {
    url: supabaseUrl!.trim(),
    anonKey: supabaseAnonKey!.trim(),
  };
}
