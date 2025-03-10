// /app/dashboard/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/authOptions';
import { redirect } from 'next/navigation';
import Dashboard from '../components/dashboard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Dashboard />
    </div>
  );
}