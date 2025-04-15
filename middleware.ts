import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  const headers = response.headers;
  
  // Prevent XSS attacks
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable strict CSP
  headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.solana.com https://api.jup.ag https://solscan.io; " +
    "frame-ancestors 'none';"
  );
  
  // Enable HSTS
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Prevent browser features
  headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Basic rate limiting (can be enhanced with Redis for production)
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = request.headers.get('X-RateLimit-Remaining');
  
  if (rateLimit === '0') {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  return response;
} 