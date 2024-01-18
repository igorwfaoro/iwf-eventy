'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Footer } from '../components/Footer/Footer';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SessionProvider>
      <Navbar />
      <div className="p-5 pt-12 bg-gray-100 min-h-[calc(100vh-3rem)]">{children}</div>
      <Footer />
    </SessionProvider>
  );
}