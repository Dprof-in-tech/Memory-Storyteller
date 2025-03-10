/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/memories/[id]/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import Link from 'next/link';
import MemoryDetail from '@/app/components/MemoryDetail';

export default async function MemoryPage({ params }: {params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const memory = await prisma.memory.findUnique({
    where: {
      id: params.id,
    },
    include: {
      photos: true,
      stories: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
  
  if (!memory || memory.userId !== session.user.id) {
    redirect('/dashboard');
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <MemoryDetail memory={memory} />
    </div>
  );
}