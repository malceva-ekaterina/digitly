// middleware.js (в корне проекта)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Проверяем куку auth_token (которую вы устанавливаете)
  const authToken = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;
  
  console.log('Middleware check:', { pathname, hasAuthToken: !!authToken });
  
  // Защищённые маршруты (требуют авторизации)
  const protectedPaths = ['/dashboard', '/profile', '/institutions', '/olympiads/create'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Публичные страницы (доступны без авторизации)
  const publicPaths = ['/login', '/registr', '/password/forgot', '/password/reset', '/verify-email'];
  const isPublicPath = publicPaths.includes(pathname) || pathname === '/';
  
  // Если страница защищённая и нет токена → редирект на логин
  if (isProtectedPath && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    console.log('Redirecting to login from:', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Если страница логина и есть токен → редирект на главную
  if (pathname === '/login' && authToken) {
    console.log('Already logged in, redirecting to home');
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