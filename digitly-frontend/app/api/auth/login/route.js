import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('Login attempt for:', email);
    
    // Получаем CSRF cookie
    await fetch(`${LARAVEL_API_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
    });
    
    // Отправляем запрос на вход
    const response = await fetch(`${LARAVEL_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('Login response status:', response.status);
    
    if (response.ok && data.token) {
      const nextResponse = NextResponse.json({
        token: data.token,
        user: data.user
      });
      
      // Сохраняем токен в cookie
      nextResponse.cookies.set('token', data.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      
      return nextResponse;
    }
    
    return NextResponse.json(
      { message: data.message || 'Invalid credentials' },
      { status: response.status }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error: ' + String(error) },
      { status: 500 }
    );
  }
}