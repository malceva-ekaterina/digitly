import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000';

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  const path = params.path.join('/');
  
  console.log(`[Proxy] ==== START ${method} /api/laravel/${path} ====`);
  console.log(`[Proxy] LARAVEL_API_URL: ${LARAVEL_API_URL}`);
  
  // Формируем URL для Laravel
  let url = `${LARAVEL_API_URL}/${path}`;
  console.log(`[Proxy] Target URL: ${url}`);
  
  try {
    // Получаем тело запроса для POST
    let body = null;
    let bodyString = '';
    if (method === 'POST') {
      try {
        const clonedRequest = request.clone();
        bodyString = await clonedRequest.text();
        body = bodyString;
        console.log(`[Proxy] Request body: ${bodyString}`);
      } catch (e) {
        console.error('Error reading body:', e);
      }
    }
    
    // Подготавливаем заголовки
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    // Добавляем токен если есть
    const token = request.cookies.get('token')?.value;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[Proxy] Token found');
    } else {
      console.log('[Proxy] No token found');
    }
    
    console.log(`[Proxy] Sending ${method} request to Laravel...`);
    
    // Отправляем запрос к Laravel
    const response = await fetch(url, {
      method,
      headers,
      body: body ? body : undefined,
    });
    
    console.log(`[Proxy] Laravel response status: ${response.status}`);
    
    // Получаем данные ответа
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    console.log(`[Proxy] Response data:`, data);
    
    // Создаем ответ для клиента
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    
    // Если в ответе есть токен (при логине), сохраняем его в куку
    if (data.token) {
      console.log('[Proxy] Token received, saving to cookie');
      nextResponse.cookies.set('token', data.token, {
        httpOnly: true,
        secure: false, // Для localhost ставим false
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
    }
    
    console.log(`[Proxy] ==== END ${method} /api/laravel/${path} ====`);
    return nextResponse;
    
  } catch (error) {
    console.error(`[Proxy Error] ${method} ${url}:`, error);
    return NextResponse.json(
      { 
        message: 'Ошибка соединения с сервером',
        error: String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'POST');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'GET');
}