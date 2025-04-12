"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Explore() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
          router.push('/');
        }
      }, [router]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:3001/v1/books');
                if (!response.ok) throw new Error('Failed to fetch books');
                const data = await response.json();
                setBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    if (loading) return <div className="text-center p-4">Loading books...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Explore Available Books</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                    <div key={book.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        

                        {book.coverUrl && (
    <img 
        src={book.coverUrl} 
        alt={book.title}
        className="mb-4 rounded w-full h-100 object-cover rounded-lg shadow-sm"
        loading="lazy"
    />
)}
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{book.title}</h2>
                            <p className="text-gray-600">{book.author}</p>
                        </div>
                        <div className="space-y-2 text-sm pl-4">
                            <div>
                                <span className="font-medium">Genre:</span> {book.genre || 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium">Location:</span> {book.city}
                            </div>
                            <div className={`inline-block px-2 py-1 rounded ${
                                book.status === 'AVAILABLE' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {book.status.toLowerCase()}
                            </div>
                        </div>

                        <div className="mt-4 border-t p-4">
                            <h3 className="font-medium mb-2">Owner Details:</h3>
                            <div className="space-y-1 text-sm">
                                <div>{book.owner.name}</div>
                                <div className="text-blue-600">{book.owner.email}</div>
                                <div className="text-gray-600">{book.owner.mobile}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {books.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No books available for exchange/rent
                </div>
            )}
        </div>
    );
};