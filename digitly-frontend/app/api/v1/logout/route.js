import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    
    const response = await fetch(`${BACKEND_URL}/api/v1/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': cookieHeader
      }
    });
    
    // Создаем ответ и удаляем куку auth_token
    const nextResponse = NextResponse.json({ success: true });
    nextResponse.cookies.delete('auth_token');
    
    return nextResponse;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' }, 
      { status: 500 }
    );
  }
}