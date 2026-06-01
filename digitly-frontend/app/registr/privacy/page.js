"use client";
import Link from 'next/link';
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Политика обработки персональных данных</h1>
        <div className="prose max-w-none">
          <p>Текст политики конфиденциальности...</p>
        </div>
      </div>
    </div>
  );
}