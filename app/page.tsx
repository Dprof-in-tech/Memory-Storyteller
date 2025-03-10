import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/authOptions';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-full">
          <div className="text-center flex flex-col gap-4">
            <h1 className="flex flex-col gap-3 text-4xl font-extrabold tracking-tight text-gray-700 sm:text-5xl md:text-6xl">
              <span className="">Memory Storyteller</span>
              <span className=" text-indigo-600">Share your love story, one memory at a time</span>
            </h1>
            <p className=" max-w-xl mx-auto text-base text-gray-500 sm:text-lg">
              Transform your cherished memories into beautiful narratives and surprise your loved one with stories that matter.
            </p>
            <div className=" max-w-md mx-auto sm:flex sm:justify-center mt-8">
              {session ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <div className="rounded-md shadow">
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}