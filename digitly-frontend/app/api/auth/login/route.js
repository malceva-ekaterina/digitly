import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, remember } = await request.json();
    
    // Отправляем запрос на бекенд 
    // интеграция с бэкендом
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Создаём ответ с установкой cookie
      const nextResponse = NextResponse.json({ user: data.user });
      
      // Устанавливаем httpOnly cookie с токеном
      nextResponse.cookies.set('auth_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 дней или 1 день
        path: '/',
      });
      
      return nextResponse;
    }
    
    return NextResponse.json({ message: data.message }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}