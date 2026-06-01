import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (authToken) {
      // Отправляем запрос на выход в Laravel
      await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
    }
    
    // Создаем ответ и удаляем куку
    const nextResponse = NextResponse.json({ success: true });
    nextResponse.cookies.delete('auth_token');
    
    return nextResponse;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}