import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000';

// Добавьте это для отладки
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log('[DEBUG] Received POST request');
  console.log('[DEBUG] params.path:', params.path);
  console.log('[DEBUG] URL:', request.url);
  
  const path = params.path.join('/');
  console.log('[DEBUG] Joined path:', path);
  
  // Формируем URL для Laravel
  const url = `${LARAVEL_API_URL}/api/${path}`;
  console.log('[DEBUG] Target Laravel URL:', url);
  
  try {
    const body = await request.json();
    console.log('[DEBUG] Request body:', body);
    
    // Отправляем запрос к Laravel
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('[DEBUG] Laravel response status:', response.status);
    
    const data = await response.json();
    console.log('[DEBUG] Laravel response data:', data);
    
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    
    // Если есть токен, сохраняем в cookie
    if (data.token) {
      console.log('[DEBUG] Token found, saving to cookie');
      nextResponse.cookies.set('token', data.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
    }
    
    return nextResponse;
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера: ' + String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log('[DEBUG] Received GET request');
  console.log('[DEBUG] params.path:', params.path);
  
  const path = params.path.join('/');
  const url = `${LARAVEL_API_URL}/api/${path}`;
  console.log('[DEBUG] Target Laravel URL:', url);
  
  try {
    const token = request.cookies.get('token')?.value;
    console.log('[DEBUG] Token from cookie:', token ? 'Present' : 'Missing');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    console.log('[DEBUG] Laravel response status:', response.status);
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}