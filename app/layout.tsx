// /app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import AuthProvider from './components/AuthProvider';
import ConditionalLayout from './components/conditionalLayout';
import { ReactNode } from 'react';
import { authOptions } from './api/auth/authOptions';
import TermsConsent from './components/TermsConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Memory Storyteller',
  description: 'Transform your memories into beautiful narratives for your loved one',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConditionalLayout session={session}>
            {children}
          </ConditionalLayout>
          <TermsConsent />
        </AuthProvider>
      </body>
    </html>
  );
}