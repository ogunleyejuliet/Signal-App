import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, getUserFromToken } from './lib/auth/tokens';

function readSessionFromRequest(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));

  if (!match) return null;

  const token = match.split('=').slice(1).join('=');
  return getUserFromToken(token);
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const sessionUser = readSessionFromRequest(request);

  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/report');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if (isProtected && !sessionUser) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && sessionUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};