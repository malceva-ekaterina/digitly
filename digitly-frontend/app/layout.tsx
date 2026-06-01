import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Цифрус - Образовательная платформа",
  description: "Онлайн олимпиады и методические материалы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}