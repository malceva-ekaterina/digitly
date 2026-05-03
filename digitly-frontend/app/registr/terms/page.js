"use client";
import Link from 'next/link';
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Пользовательское соглашение</h1>
        <div className="prose max-w-none">
          <p>Текст пользовательского соглашения...</p>
        </div>
      </div>
    </div>
  );
}