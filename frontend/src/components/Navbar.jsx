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
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Fable Flow
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