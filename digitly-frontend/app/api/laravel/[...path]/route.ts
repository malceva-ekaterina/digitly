import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000';

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log('=== PROXY POST ===');
  console.log('Path segments:', params.path);
  
  const path = params.path.join('/');
  const url = `${LARAVEL_API_URL}/api/${path}`;
  console.log('Target URL:', url);
  
  try {
    const body = await request.json();
    console.log('Body:', body);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Laravel response status:', response.status);
    
    const data = await response.json();
    console.log('Laravel response data:', data);
    
    const nextResponse = NextResponse.json(data);
    
    if (data.token) {
      nextResponse.cookies.set('token', data.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      console.log('Token saved to cookie');
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Server error: ' + String(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log('=== PROXY GET ===');
  console.log('Path segments:', params.path);
  
  const path = params.path.join('/');
  const url = `${LARAVEL_API_URL}/api/${path}`;
  console.log('Target URL:', url);
  
  try {
    const token = request.cookies.get('token')?.value;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}