import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './config';

let browserClient: SupabaseClient | null = null;

/**
 * Supabase browser client. Returns null when env vars are not set,
 * so the app works without Supabase (local state only).
 */
export function getSupabase(): SupabaseClient | null {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(env.url, env.anonKey);
  }

  return browserClient;
}
