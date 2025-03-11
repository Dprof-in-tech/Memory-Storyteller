import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { redirect } from 'next/navigation';
import MemoryForm from '@/app/components/MemoryForm';

export default async function AddMemoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold mb-6">Add a New Memory</h1>
      <MemoryForm />
    </div>
  );
}