import { NextResponse } from 'next/server';

// URL вашего Laravel бэкенда
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const { email, password, remember } = await request.json();
    
    // Сначала получаем CSRF токен от Laravel
    const csrfResponse = await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    });
    
    // Отправляем запрос на бекенд Laravel
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Создаём ответ с установкой cookie
      const nextResponse = NextResponse.json({ user: data.user });
      
      // Устанавливаем httpOnly cookie с токеном
      // Важно: используем то же имя, что проверяет middleware!
      nextResponse.cookies.set('auth_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
        path: '/',
      });
      
      return nextResponse;
    }
    
    return NextResponse.json({ message: data.message || 'Неверный email или пароль' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}