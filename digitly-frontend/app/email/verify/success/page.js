"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EmailVerifySuccessPage() {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (  
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
         style={{ backgroundImage: "url('/bagraund.png')" }}>
      
      <div className="flex flex-col items-center w-full max-w-[500px] mx-auto">
        <div className="bg-white rounded-4xl shadow-xl w-full px-8 py-12 text-center">
          
          <div className="flex flex-col items-center">
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Email подтвержден!
            </h1>
            
            <p className="text-gray-600 mb-4">
              Ваш аккаунт успешно активирован.
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              Перенаправление на страницу входа через несколько секунд...
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}