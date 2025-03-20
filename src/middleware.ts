import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired(async function middleware(req: NextRequest) {
  return NextResponse.next();
});

// Only apply to specific paths that require authentication
export const config = {
  matcher: [
    // Customize this pattern based on which routes need authentication
    '/protected/:path*',
    '/dashboard/:path*',
    '/clock-in/:path*',
    '/history/:path*',
    '/api/user/:path*',
    '/api/clock-in/:path*',
    '/api/dashboard/:path*',
    // Don't include the auth routes themselves
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 