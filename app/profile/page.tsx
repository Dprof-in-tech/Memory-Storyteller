// /app/profile/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/authOptions';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import UserProfile from '../components/userProfile';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      partnerName: true,
      phoneNumber: true,
      partnerPhoneNumber: true,
    },
  });
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <UserProfile user={user} />
    </div>
  );
}