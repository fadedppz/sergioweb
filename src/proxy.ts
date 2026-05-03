import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
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
  // Use x-forwarded-for if available, fallback to localhost
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  if (request.nextUrl.pathname.startsWith('/api/chat')) {
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
  } else if (request.nextUrl.pathname.startsWith('/api/')) {
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

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};
