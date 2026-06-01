import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request) {
  try {
    // Получаем токен из куки
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No auth_token cookie found');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    console.log('Auth token found, fetching user from Laravel');
    
    // Запрашиваем пользователя из Laravel с токеном
    const response = await fetch(`${BACKEND_URL}/api/v1/user`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    const data = await response.json();
    console.log('Laravel user response status:', response.status);
    
    if (response.ok) {
      return NextResponse.json(data.user || data);
    }
    
    return NextResponse.json(
      { message: data.message || 'Not authenticated' },
      { status: 401 }
    );
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}