"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const id = searchParams.get('id');
      const hash = searchParams.get('hash');
      const expires = searchParams.get('expires');
      const signature = searchParams.get('signature');
      
      if (!id || !hash) {
        setStatus('error');
        setMessage('Неверная ссылка для подтверждения');
        return;
      }
      // интеграция с бекендом
      try {
        const response = await fetch(
          `api/v1/email/verify`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        
        if (response.ok) {
          setStatus('success');
          // Перенаправляем на страницу успеха
          router.push('/email/verify/success');
        } else {
          const data = await response.json();
          setStatus('error');
          setMessage(data.message || 'Ссылка недействительна или истек срок действия');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Ошибка соединения с сервером');
      }
    };
    
    verifyEmail();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
           style={{ backgroundImage: "url('/bagraund.png')" }}>
        <div className="bg-white rounded-4xl shadow-xl w-full max-w-[500px] p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-red-300 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Подтверждение email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
           style={{ backgroundImage: "url('/bagraund.png')" }}>
        <div className="bg-white rounded-4xl shadow-xl w-full max-w-[500px] px-8 py-12 text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ошибка подтверждения</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link href="/registr" className="hover:underline">
              Зарегистрироваться заново
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}