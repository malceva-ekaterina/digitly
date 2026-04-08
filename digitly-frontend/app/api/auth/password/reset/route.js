import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, token, password, password_confirmation } = await request.json();
    // интеграция с бэкендом
    const response = await fetch('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, password, password_confirmation }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json({ message: 'Password reset' });
    }
    
    return NextResponse.json({ message: data.message }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}