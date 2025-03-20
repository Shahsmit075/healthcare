'use client';

import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

function Navigation() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Lief Healthcare Clock-In
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/clock-in"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Clock In/Out
                </Link>
                <Link
                  href="/history"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  History
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <span className="text-gray-700 px-3 py-2 text-sm">
                  {user.name}
                </span>
                <Link
                  href="/api/auth/logout"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                href="/api/auth/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </UserProvider>
  );
} 