"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-blue-600 mb-6">
            Welcome to Fable Flow
          </h1>
          <p className="text-xl text-gray-600 mb-8">
          Where books travel, not gather dust.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/sign-up" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Fable Flow?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3">Discover Books</h3>
              <p className="text-gray-600">Explore a vast collection of books from your local community</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-3">Share & Exchange</h3>
              <p className="text-gray-600">Give life to your read books by sharing them with others</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-3">Local Community</h3>
              <p className="text-gray-600">Connect with book lovers in your neighborhood</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="py-6">
              <div className="text-blue-600 text-2xl font-bold mb-2">1</div>
              <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
              <p className="text-gray-600">Create your free account</p>
            </div>
            <div className="py-6">
              <div className="text-blue-600 text-2xl font-bold mb-2">2</div>
              <h3 className="text-lg font-semibold mb-2">List or Find Books</h3>
              <p className="text-gray-600">Share your books or discover new ones</p>
            </div>
            <div className="py-6">
              <div className="text-blue-600 text-2xl font-bold mb-2">3</div>
              <h3 className="text-lg font-semibold mb-2">Connect & Exchange</h3>
              <p className="text-gray-600">Arrange pickups and share stories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-xl italic text-gray-700">
            “Fable Flow transformed how I share books with my community. It is like having a library right in my neighborhood!”
          </blockquote>
          <p className="mt-4 font-semibold text-blue-600">- Sarah, Book Enthusiast</p>
        </div>
      </section>
    </div>
  );
}