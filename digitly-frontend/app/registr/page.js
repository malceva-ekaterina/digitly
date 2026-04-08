// не работает сюда перенаправление хз почему 

"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

//  Валидация
const registerSchema = z.object({
  fullname: z.string()
    .min(2, 'ФИО должно содержать минимум 2 символа')
    .max(100, 'ФИО слишком длинное')
    .regex(/^[а-яА-ЯёЁa-zA-Z\s\-]+$/, 'ФИО может содержать только буквы, пробелы и дефис'),
  phone_number: z.string()
    .min(11, 'Введите корректный телефон')
    .regex(/^[\d+\-\s]+$/, 'Телефон может содержать только цифры, + и -'),
  email: z.string()
    .email('Введите корректный email')
    .min(5, 'Email слишком короткий'),
});

export default function Registr() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      phone_number: '',
      email: '',
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');

    // Сохраняем данные в sessionStorage
    const formData = {
      fullname: data.fullname,
      phone_number: data.phone_number,
      email: data.email,
    };
    sessionStorage.setItem('registrationData', JSON.stringify(formData));

    // Переходим на страницу ввода пароля
    router.push('/registr/password');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/bagraund.png')" }}>

      <div className="flex flex-col items-center w-full max-w-[1088px] mx-auto">
        <div className="bg-white rounded-4xl shadow-xl w-full overflow-hidden">

          <div className="flex flex-col md:flex-row">

            <div className="flex-1 p-8 sm:p-10 md:p-12">
              <img
                src="/lock.png"
                alt="Иконка замка"
                className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 mx-auto mb-2"
              />

              <p className="text-center font-sans font-bold text-2xl sm:text-3xl md:text-4xl mb-6 md:mb-8">
                Регистрация
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">

                {/* ФИО */}
                <div className="w-full max-w-[384px]">
                  <p className="font-sans text-sm sm:text-base text-left mb-1">Ваше ФИО</p>
                </div>
                <input
                  type="text"
                  placeholder="Введите Фамилию Имя Отчество"
                  {...register('fullname')}
                  className={`border-2 rounded-xl px-4 py-2 hover:border-gray-300 outline-none w-full max-w-[384px] mb-1 text-xs sm:text-sm md:text-base ${errors.fullname ? 'border-red-500' : 'border-gray-200'
                    }`}
                  style={{ height: '40px' }}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs w-full max-w-[384px] mb-4 text-left">
                    {errors.fullname.message}
                  </p>
                )}

                {/* Телефон */}
                <div className="w-full max-w-[384px]">
                  <p className="font-sans text-sm sm:text-base text-left mb-1">Телефон</p>
                </div>
                <input
                  type="tel"
                  placeholder="Введите телефон"
                  {...register('phone_number')}
                  className={`border-2 rounded-xl px-4 py-2 hover:border-gray-300 outline-none w-full max-w-[384px] mb-1 text-xs sm:text-sm md:text-base ${errors.phone_number ? 'border-red-500' : 'border-gray-200'
                    }`}
                  style={{ height: '40px' }}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-xs w-full max-w-[384px] mb-4 text-left">
                    {errors.phone_number.message}
                  </p>
                )}

                {/* Email */}
                <div className="w-full max-w-[384px]">
                  <p className="font-sans text-sm sm:text-base text-left mb-1">Email</p>
                </div>
                <input
                  type="email"
                  placeholder="Введите Email"
                  {...register('email')}
                  className={`border-2 rounded-xl px-4 py-2 hover:border-gray-300 outline-none w-full max-w-[384px] mb-1 text-xs sm:text-sm md:text-base ${errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                  style={{ height: '40px' }}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs w-full max-w-[384px] mb-4 text-left">
                    {errors.email.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-2.5 rounded-xl bg-red-300 font-sans text-white hover:bg-red-400 transition-colors mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading ? 'Загрузка...' : 'Далее'}
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

            <div className="hidden md:flex flex-1">
              <img
                src="/registr.png"
                alt="registration"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}