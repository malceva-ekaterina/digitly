import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request) {
  try {
    // Проксируем запрос к Laravel бэкенду
    const response = await fetch(`${BACKEND_URL}/api/v1/user`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: data.message }, { status: response.status });
    }
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}