import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000';

// Универсальная функция для проксирования запросов
async function proxyRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  const path = params.path.join('/');
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  
  // Получаем токен из куки или из заголовка Authorization
  let token = request.cookies.get('token')?.value;
  
  // Также проверяем заголовок Authorization (на случай если токен пришел от клиента)
  const authHeader = request.headers.get('authorization');
  if (!token && authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  // Формируем URL для Laravel
  let url = `${LARAVEL_API_URL}/${path}`;
  if (queryString) {
    url += `?${queryString}`;
  }
  
  console.log(`[Proxy] ${method} ${url} -> Token: ${token ? 'Present' : 'Missing'}`);
  
  // Подготавливаем заголовки
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Копируем дополнительные заголовки от клиента (если нужно)
  const clientContentType = request.headers.get('content-type');
  if (clientContentType && clientContentType !== 'application/json') {
    headers['Content-Type'] = clientContentType;
  }
  
  try {
    // Подготавливаем тело запроса для методов POST, PUT, PATCH
    let body: BodyInit | null = null;
    if (method !== 'GET' && method !== 'HEAD' && method !== 'DELETE') {
      // Пытаемся прочитать тело как JSON
      try {
        const clonedRequest = request.clone();
        body = await clonedRequest.text();
      } catch (e) {
        console.error('Error reading request body:', e);
      }
    }
    
    // Отправляем запрос к Laravel
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    
    // Получаем данные ответа
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Создаем ответ для клиента
    const nextResponse = NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
    
    // Если Laravel вернул новые куки (например, при логине), передаем их клиенту
    const laravelCookies = response.headers.get('set-cookie');
    if (laravelCookies) {
      nextResponse.headers.set('Set-Cookie', laravelCookies);
    }
    
    // Если в ответе есть токен (при логине), сохраняем его в куку
    if (data.token) {
      const maxAge = 60 * 60 * 24; // 24 часа по умолчанию
      nextResponse.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });
      console.log('[Proxy] Token saved to cookie');
    }
    
    return nextResponse;
  } catch (error) {
    console.error(`[Proxy Error] ${method} ${url}:`, error);
    return NextResponse.json(
      { 
        message: 'Ошибка соединения с сервером',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// GET запросы
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'GET');
}

// POST запросы
export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'POST');
}

// PUT запросы
export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'PUT');
}

// PATCH запросы
export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'PATCH');
}

// DELETE запросы
export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'DELETE');
}