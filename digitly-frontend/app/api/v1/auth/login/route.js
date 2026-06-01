import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const { email, password, remember } = await request.json();
    
    console.log('1. Попытка входа для:', email);
    
    // Получаем CSRF токен
    const csrfResponse = await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('2. CSRF ответ:', csrfResponse.status);
    
    // Получаем cookies из ответа CSRF
    const csrfCookies = csrfResponse.headers.get('set-cookie');
    console.log('3. CSRF cookies:', csrfCookies);
    
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': csrfCookies || ''
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('4. Ответ от бэкенда:', response.status, data);
    
    if (response.ok && data.token) {
      // Создаем ответ с данными пользователя
      const nextResponse = NextResponse.json({ 
        success: true,
        user: data.user 
      });
      
      // Устанавливаем куку auth_token
      const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
      
      nextResponse.cookies.set('auth_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });
      
      console.log('5. Кука auth_token установлена');
      
      return nextResponse;
    }
    
    return NextResponse.json(
      { message: data.message || 'Неверный email или пароль' }, 
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера: ' + error.message }, 
      { status: 500 }
    );
  }
}