"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);

    // Redirect logic
    if (user && pathname === '/') {
      router.push('/dashboard');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    if (pathname !== '/') router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/"
            className="flex items-center gap-2 group hover:scale-105 transition-transform"
            aria-label="Fable Flow Home"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 6.253C13.176 5.476 14.754 5 16.5 5C18.247 5 19.825 5.476 21 6.253V20.253C19.825 19.476 18.247 19 16.5 19C14.754 19 13.176 19.476 12 20.253M12 6.253C10.824 5.476 9.246 5 7.5 5C5.754 5 4.176 5.476 3 6.253V20.253C4.176 19.476 5.754 19 7.5 19C9.246 19 10.824 19.476 12 20.253M12 6.253V20.253" />
              </svg>
            </div>

            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Fable Flow
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/explore" className="hover:text-blue-600">
                  Explore
                </Link>
                <Link href="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="hover:text-blue-600">
                  Sign In
                </Link>
                <Link href="/sign-up" className="hover:text-blue-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}