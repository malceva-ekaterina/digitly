"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Что-то пошло не так</h1>
            <p className="text-gray-600 mb-6">
              {error?.message || 'Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white py-3 rounded-xl font-medium transition-all"
              >
                Попробовать снова
              </button>
              <Link
                href="/"
                className="block w-full border border-gray-300 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
              >
                Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}