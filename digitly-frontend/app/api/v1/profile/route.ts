import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Получаем пользователя из Laravel
    const response = await fetch(`${LARAVEL_API_URL}/api/v1/user`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      const user = data.user || data;
      // Формируем данные профиля
      const profileData = {
        fullname: user.fullname || user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        birth_date: user.birth_date || '',
        study_place: user.study_place || '',
        study_grade: user.study_grade || '',
      };
      return NextResponse.json(profileData);
    }
    
    return NextResponse.json(
      { message: data.message || 'Failed to load profile' },
      { status: response.status }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const body = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Обновляем профиль в Laravel
    const response = await fetch(`${LARAVEL_API_URL}/api/v1/profile`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}