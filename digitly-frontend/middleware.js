import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;
  
  // Защищённые маршруты (требуют авторизации)
  const protectedPaths = ['/dashboard', ];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Публичные страницы (доступны без авторизации)
  const publicPaths = ['/login', '/registr', '/password/forgot', '/password/reset', '/verify-email', '/profile'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Если страница защищённая и нет токена → редирект на логин
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Если страница публичная и есть токен → редирект на главную
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/registr', '/password/:path*', '/verify-email', '/dashboard/:path*', '/profile/:path*'],
};