/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import Link from 'next/link';
import StoryDetail from '@/app/components/StoryDetail';

export default async function StoryPage({ params }: { params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const story = await prisma.story.findUnique({
    where: {
      id: params.id,
    },
    include: {
      memory: {
        select: {
          id: true,
          title: true,
          date: true,
          location: true,
        },
      },
    },
  });
  
  if (!story || story.userId !== session.user.id) {
    redirect('/dashboard');
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href={`/memories/${story.memory.id}`} className="text-indigo-600 hover:text-indigo-800">
          &larr; Back to Memory
        </Link>
      </div>
      
      <StoryDetail story={story} />
    </div>
  );
}