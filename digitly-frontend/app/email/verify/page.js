"use client";
import Link from 'next/link';

export default function EmailVerifyPage() {
  return (  
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
         style={{ backgroundImage: "url('/bagraund.png')" }}>
      
      <div className="flex flex-col items-center w-full max-w-[500px] mx-auto">
        <div className="bg-white rounded-4xl shadow-xl w-full px-8 py-12 text-center">
          
          <div className="flex flex-col items-center">
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Проверьте почту
            </h1>
            
            <p className="text-gray-600 mb-4">
              Мы отправили письмо со ссылкой для подтверждения регистрации на ваш email адрес.
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              Пожалуйста, перейдите по ссылке в письме, чтобы активировать аккаунт.
            </p>
            
            <Link 
              href="/login" 
              className="mt-2 text-sm hover:underline"
            >
              ← Вернуться на страницу входа
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}