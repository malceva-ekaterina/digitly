"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Сохраняем в localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Перенаправляем
        window.location.href = '/profile';
      } else {
        setError(data.message || 'Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (  
    <div className="min-h-screen bg-cover bg-center bg-no-repeat grid place-items-center p-4" 
         style={{ backgroundImage: "url('/bagraund.png')" }}>
      
      <div className="flex flex-col items-center w-full max-w-[639px] mx-auto">
        <div className="bg-white rounded-4xl shadow-xl w-full px-4 py-8">
          <div className="flex flex-col items-center">
            <img src="/lock.png" className="w-6 sm:w-7 md:w-8" />
            <p className="font-bold text-2xl sm:text-3xl md:text-4xl">Войти в систему</p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
              <div className="w-full max-w-[384px]">
                <p className="text-sm text-left mb-1 mt-4">Email</p>
              </div>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-gray-200 rounded-xl px-4 outline-none w-full max-w-[384px]"
                style={{ height: '40px' }}
              />

              <div className="w-full max-w-[384px]">
                <p className="text-sm text-left mb-1 mt-4">Пароль</p>
              </div>
              <input 
                type="password" 
                placeholder="Пароль" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-gray-200 rounded-xl px-4 outline-none w-full max-w-[384px]"
                style={{ height: '40px' }}
              />
              
              {error && (
                <p className="text-red-500 text-sm w-full max-w-[384px] mt-2 text-center">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#312C85] to-[#8E51FF] text-white mt-4"
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>
            
            <Link href="/registr" className="mt-4 text-sm">
              Нет аккаунта? Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}