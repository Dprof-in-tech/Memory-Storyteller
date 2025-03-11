/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const hideNavbarPaths = ['/', '/register', '/login', '/terms'];
  const isHiddenPath = hideNavbarPaths.includes(pathname);
  
  return (
    <>
      {!isHiddenPath && <Navbar session={session} />}
      <main className={`min-h-screen ${!isHiddenPath ? 'pt-16' : ''} pb-10`}>
        {children}
      </main>
    </>
  );
}