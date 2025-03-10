/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/components/ConditionalLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { ReactNode } from 'react';

export default function ConditionalLayout({ 
  children, 
  session 
}: { 
  children: ReactNode;
  session: any;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/register' || pathname === '/login';
  
  return (
    <>
      {!isHomePage && <Navbar session={session} />}
      <main className={`min-h-screen ${!isHomePage ? 'pt-16' : ''} pb-10`}>
        {children}
      </main>
    </>
  );
}