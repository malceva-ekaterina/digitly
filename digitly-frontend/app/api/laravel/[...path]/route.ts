import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000';

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  // Получаем путь из параметров
  let path = params.path.join('/');
  
  // Убираем лишний 'api' если он есть в начале (так как Laravel уже имеет /api в маршрутах)
  if (path.startsWith('api/')) {
    path = path.substring(4); // убираем 'api/'
  }
  
  // Формируем URL для Laravel
  let url = `${LARAVEL_API_URL}/${path}`;
  
  console.log(`[Proxy] ${method} ${url}`);
  
  try {
    // Получаем тело запроса для POST
    let body = null;
    if (method === 'POST') {
      try {
        const clonedRequest = request.clone();
        body = await clonedRequest.text();
        console.log(`[Proxy] Body: ${body}`);
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
    }
    
    console.log(`[Proxy] Sending to Laravel...`);
    
    // Отправляем запрос к Laravel
    const response = await fetch(url, {
      method,
      headers,
      body: body || undefined,
    });
    
    console.log(`[Proxy] Response status: ${response.status}`);
    
    // Получаем данные ответа
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log(`[Proxy] Non-JSON response: ${text.substring(0, 200)}`);
      return NextResponse.json(
        { message: 'Сервер вернул неверный ответ', details: text.substring(0, 200) },
        { status: 500 }
      );
    }
    
    // Создаем ответ для клиента
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    
    // Если в ответе есть токен (при логине), сохраняем его
    if (data.token) {
      console.log('[Proxy] Token received, saving to cookie');
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
    console.error(`[Proxy Error]:`, error);
    return NextResponse.json(
      { message: 'Ошибка соединения с сервером: ' + String(error) },
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