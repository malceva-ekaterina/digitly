import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const { email, password, remember } = await request.json();
    
    console.log('1. Login attempt for:', email);
    
    // 1. Получаем CSRF cookie от Laravel
    const csrfResponse = await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    });
    
    // Получаем все cookies из ответа
    const csrfCookies = csrfResponse.headers.get('set-cookie');
    console.log('2. CSRF cookies received');
    
    // 2. Отправляем запрос на вход в Laravel
    const loginResponse = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': csrfCookies || '',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await loginResponse.json();
    console.log('3. Login response status:', loginResponse.status);
    
    if (loginResponse.ok && data.token) {
      // Получаем cookies из ответа Laravel (если есть)
      const laravelCookies = loginResponse.headers.get('set-cookie');
      console.log('4. Laravel cookies:', laravelCookies);
      
      // Создаем ответ для клиента
      const nextResponse = NextResponse.json({
        success: true,
        user: data.user,
        token: data.token
      });
      
      // Устанавливаем куку auth_token для Next.js
      const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
      
      nextResponse.cookies.set('auth_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });
      
      // Если Laravel вернул свои куки, передаем их клиенту
      if (laravelCookies) {
        nextResponse.headers.set('Set-Cookie', laravelCookies);
      }
      
      console.log('5. Auth token cookie set successfully');
      return nextResponse;
    }
    
    return NextResponse.json(
      { message: data.message || 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}