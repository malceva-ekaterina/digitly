// middleware.js (в корне проекта)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Проверяем наличие сессионной куки Laravel (не auth_token!)
  const sessionCookie = request.cookies.get('laravel_session')?.value;
  const xsrfCookie = request.cookies.get('XSRF-TOKEN')?.value;
  const { pathname } = request.nextUrl;
  
  // Защищённые маршруты (требуют авторизации)
  const protectedPaths = ['/dashboard', '/profile', '/institutions', '/olympiads/create'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Публичные страницы (доступны без авторизации)
  const publicPaths = ['/login', '/registr', '/password/forgot', '/password/reset', '/verify-email'];
  const isPublicPath = publicPaths.includes(pathname) || pathname === '/';
  
  // Если страница защищённая и нет сессии → редирект на логин
  if (isProtectedPath && !sessionCookie && !xsrfCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Если страница публичная (кроме главной) и есть сессия → редирект на главную
  if (isPublicPath && pathname !== '/' && (sessionCookie || xsrfCookie)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login', 
    '/registr', 
    '/password/:path*', 
    '/verify-email', 
    '/dashboard/:path*', 
    '/profile/:path*',
    '/institutions/:path*',
    '/olympiads/create'
  ],
};