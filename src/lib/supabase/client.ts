import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client.
 * Used in client components (hooks, React Context, etc.)
 * This client respects RLS policies and uses the anon key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
