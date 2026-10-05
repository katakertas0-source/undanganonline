import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Returns a privileged Supabase client for server-side operations (API routes, Webhooks).
 * Bypasses Row Level Security (RLS) safely on the server without exposing secrets to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    throw new Error('[Security] getSupabaseAdmin cannot and must never be called on client-side components!');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (
    !supabaseUrl ||
    !supabaseServiceRoleKey ||
    supabaseUrl.includes('your-project-id') ||
    supabaseServiceRoleKey.includes('your-service-role-key')
  ) {
    return null;
  }

  if (cachedAdminClient) return cachedAdminClient;

  cachedAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAdminClient;
}
