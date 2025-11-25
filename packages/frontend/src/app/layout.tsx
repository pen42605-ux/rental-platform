import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: '好房網 | 找到理想的家',
  description: '台灣最優質的租屋平台，提供套房、雅房、整層出租，快速找到理想住所',
  keywords: '租屋, 套房, 雅房, 租房, 房源, 租屋網',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
      </body>
    </html>
  );
}


