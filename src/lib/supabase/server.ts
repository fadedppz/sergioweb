import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client for API routes and Server Components.
 * Reads the user's session from cookies — respects RLS policies.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Silently ignore — this can happen in Server Components
            // where cookies cannot be set (only in Route Handlers / Server Actions)
          }
        },
      },
    }
  );
}

/**
 * Get the current authenticated user from server context.
 * Returns null if not authenticated.
 */
export async function getServerUser() {
  const supabase = await createServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

/**
 * Get the current user's profile (with role) from server context.
 * Returns null if not authenticated.
 */
export async function getServerProfile() {
  const supabase = await createServerSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

/**
 * Check if the current user is an admin.
 * Returns false if not authenticated or not an admin.
 */
export async function isServerAdmin(): Promise<boolean> {
  const profile = await getServerProfile();
  return profile?.role === 'admin';
}
