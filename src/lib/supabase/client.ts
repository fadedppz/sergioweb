import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client (singleton).
 * Using a singleton prevents multiple GoTrue instances from competing
 * for the same localStorage token, which was causing the "logged out"
 * flicker and admin auth jankiness.
 */
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}
