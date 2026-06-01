"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Правильный URL для прокси
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && data.token) {
        // Сохраняем в localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('is_authenticated', 'true');
        
        console.log('Login successful, redirecting...');
        window.location.href = '/';
      } else {
        setError(data.message || 'Неверный email или пароль');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка соединения с сервером: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (  
    <div className="min-h-screen bg-cover bg-center bg-no-repeat grid place-items-center p-4" 
         style={{ backgroundImage: "url('/bagraund.png')" }}>
      
      <div className="flex flex-col items-center w-full max-w-[639px] mx-auto">
        <div className="bg-white rounded-4xl shadow-xl w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          
          <div className="flex flex-col items-center">
            <img src="/lock.png" alt="Иконка замка" className="w-6 sm:w-7 md:w-8" />
            
            <p className="text-center font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-black">Войти в систему</p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
              
              <div className="w-full max-w-[384px]">
                <p className="font-sans text-xl mb-1 text-left mt-4 text-black">Email</p>
              </div>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-gray-200 rounded-xl pl-4 hover:border-gray-300 outline-none w-full max-w-[384px] text-xs sm:text-sm md:text-base"
                style={{ height: '40px' }}
              />

              <div className="w-full max-w-[384px]">
                <p className="font-sans text-xl mb-1 text-left mt-4 text-black">Пароль</p>
              </div>

              <input 
                type="password" 
                placeholder="Пароль" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-gray-200 rounded-xl pl-4 hover:border-gray-300 outline-none w-full max-w-[384px] text-xs sm:text-sm md:text-base"
                style={{ height: '40px' }}
              />
              
              <div className="w-full max-w-[384px] flex items-center mt-4">
                <input 
                  type="checkbox" 
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Запомнить меня
                </label>
              </div>
              
              {error && (
                <p className="text-red-500 text-sm w-full max-w-[384px] mt-2 text-center">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className={`px-6 py-2 rounded-xl bg-red-300 font-sans text-white hover:bg-red-400 transition-colors mt-4 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>
            
            <Link href="/password/forgot" className="hover:underline mt-4 text-sm sm:text-base">
              Забыли пароль?
            </Link>
            
            <button 
              type="button"
              onClick={() => window.history.back()}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Назад
            </button>
          </div>
        </div>
        
        <Link href="/registr" className="mt-4 font-sans text-white text-sm sm:text-base text-center">
          Нет аккаунта? <span className="underline">Зарегистрироваться</span>
        </Link>
      </div>
    </div>
  );
}