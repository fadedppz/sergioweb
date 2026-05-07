import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Auth callback handler — processes email confirmation links from Supabase.
 *
 * Flow:
 *  1. User clicks a link in their email (signup confirm or password reset).
 *  2. Supabase redirects here with a `code` query param.
 *  3. We exchange the code for a session and redirect to the right page.
 *
 * For password resets, the intended destination (`/reset-password`) is passed
 * via `?next=` query param. As a fallback (if Supabase strips it), we also
 * check for an `ee_reset` cookie that the client sets before requesting the
 * reset email.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // Determine the redirect destination.
    // Priority: explicit ?next= param → ee_reset cookie → default.
    let redirectPath: string;

    if (next !== '/') {
      // The ?next= param survived — use it directly.
      redirectPath = next;
    } else if (request.cookies.get('ee_reset')?.value === '1') {
      // Supabase stripped the query param, but the cookie tells us
      // this is a password reset flow.
      redirectPath = '/reset-password';
    } else {
      // Default — likely a signup confirmation.
      redirectPath = '/account/confirmed';
    }

    const response = NextResponse.redirect(`${origin}${redirectPath}`);

    // Clear the ee_reset cookie now that we've used it.
    response.cookies.set('ee_reset', '', { path: '/', maxAge: 0 });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
