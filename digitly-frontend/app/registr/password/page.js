"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// Валидация
const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Пароль должен быть минимум 8 символов')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Пароль должен содержать буквы и цифры'),
  confirmPassword: z.string(),
  agree: z.boolean().refine(val => val === true, 'Необходимо согласие с условиями')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export default function RegitrPassword() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Получаем данные из sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem('registrationData');
    if (data) {
      setRegistrationData(JSON.parse(data));
    } else {
      // Если нет данных, возвращаем на первый шаг
      router.push('/registr');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      agree: false
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      // Отправка данных на сервер
      // интеграция с бэкендом
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fullname: registrationData?.fullname,
          phone_number: registrationData?.phone_number,
          email: registrationData?.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Очищаем sessionStorage
        sessionStorage.removeItem('registrationData');
        // Перенаправляем на страницу "Проверьте почту"
        router.push('/email/verify');
      } else {
        setServerError(result.message || 'Ошибка регистрации');
      }
    } catch (error) {
      setServerError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors) => {
    console.log('Ошибки валидации:', errors);
  };

  return (  
    <div className="min-h-screen bg-cover bg-center bg-no-repeat grid place-items-center p-4" 
      style={{ backgroundImage: "url('/bagraund.png')" }}>

      <div className="flex flex-col items-center w-full max-w-[639px] mx-auto">
        <div className="bg-white rounded-4xl w-full px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">

          <div className="flex flex-col items-center">

            <img 
              src="/lock.png" 
              alt="Иконка замка" 
              className="w-6 sm:w-7 md:w-8"
            />

            <p className="text-center font-sans font-bold text-2xl sm:text-3xl md:text-4xl">
              Регистрация
            </p>
            
            {registrationData && (
              <p className="text-sm text-gray-500 mt-2">
                {registrationData.email}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full flex flex-col items-center">

              {/* Поле Пароль */}
              <div className="w-full max-w-[384px]">
                <p className="font-sans text-sm sm:text-base text-left mt-4 mb-1">Пароль</p>
              </div>
              <input 
                type="password" 
                placeholder="Придумайте пароль" 
                {...register('password')}
                className={`border-2 rounded-xl px-4 py-2 hover:border-gray-300 outline-none w-full max-w-[384px] mb-1 text-xs sm:text-sm md:text-base ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
                style={{ height: '40px' }}
              />
              {errors.password && (
                <p className="text-red-500 text-xs w-full max-w-[384px] mb-4 text-left">
                  {errors.password.message}
                </p>
              )}

              {/* Поле Повторите пароль */}
              <div className="w-full max-w-[384px]">
                <p className="font-sans text-sm sm:text-base text-left mt-2 mb-1">Повторите пароль</p>
              </div>
              <input 
                type="password" 
                placeholder="Введите пароль" 
                {...register('confirmPassword')}
                className={`border-2 rounded-xl px-4 py-2 hover:border-gray-300 outline-none w-full max-w-[384px] mb-1 text-xs sm:text-sm md:text-base ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                }`}
                style={{ height: '40px' }}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs w-full max-w-[384px] mb-4 text-left">
                  {errors.confirmPassword.message}
                </p>
              )}

              {/* Чекбокс согласия */}
              <div className="w-full max-w-[384px] flex items-start mt-4 mb-4">
                <input 
                  type="checkbox" 
                  {...register('agree')}
                  className="w-4 h-4 mr-2 mt-0.5"
                />
                <label className="font-sans text-xs sm:text-sm text-gray-600 text-left">
                  Я соглашаюсь с условиями обработки персональных данных
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-xs w-full max-w-[384px] mb-2 text-left">
                  {errors.agree.message}
                </p>
              )}

              {/* Ошибка сервера */}
              {serverError && (
                <p className="text-red-500 text-sm w-full max-w-[384px] mb-4 text-center">
                  {serverError}
                </p>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className={`px-6 py-2 rounded-xl bg-red-300 font-sans text-white hover:bg-red-400 transition-colors mt-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
              
              {/* Кнопка назад */}
              <button 
                type="button"
                onClick={() => router.back()}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Назад
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}