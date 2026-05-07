import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis from UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv();

// General API rate limiter: 20 requests per 10 seconds
const generalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit:general',
});

// Chat API rate limiter: 5 requests per 1 minute
const chatRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit:chat',
});

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ──────────────────────────────────────────────
  // 1. Catch stray Supabase auth codes
  // ──────────────────────────────────────────────
  // If Supabase redirects to the homepage (or any non-callback page) with
  // ?code=, forward it to /auth/callback so we can exchange it for a session.
  // This happens when the Supabase dashboard's Redirect URLs whitelist doesn't
  // include the full callback URL with query params.
  if (
    searchParams.has('code') &&
    !pathname.startsWith('/auth/callback') &&
    !pathname.startsWith('/api/')
  ) {
    const callbackUrl = new URL('/auth/callback', request.url);

    // Preserve all query params (code, next, etc.)
    searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(callbackUrl);
  }

  // ──────────────────────────────────────────────
  // 2. Rate limiting for API routes
  // ──────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    if (pathname.startsWith('/api/chat')) {
      const { success, limit, reset, remaining } = await chatRateLimit.limit(`chat_${ip}`);

      if (!success) {
        return NextResponse.json({ error: 'Too many requests to chat' }, {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        });
      }
    } else {
      const { success, limit, reset, remaining } = await generalRateLimit.limit(`api_${ip}`);

      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        });
      }
    }
  }

  // ──────────────────────────────────────────────
  // 3. Refresh Supabase auth session
  // ──────────────────────────────────────────────
  // This keeps auth cookies valid on every page navigation.
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

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
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
