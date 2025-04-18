"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function Explore() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [socket, setSocket] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
          router.push('/');
        }
      }, [router]);

      useEffect(() => {
        const newSocket = io('https://shelf-p2p-book-exchange-portal.onrender.com', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnection: true,
            timeout: 10000,
            secure: true,
            reconnectionAttempts: 5,
        });
        setSocket(newSocket);

        return () => {
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.off('error');
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('https://shelf-p2p-book-exchange-portal.onrender.com/v1/books');
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

    useEffect(() => {
        if (!socket) return;

        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user?.id) {
            socket.emit('register', user.id);
        }

        socket.on('new-book', (newBook) => {
            setBooks(prevBooks => [newBook, ...prevBooks]);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            socket.off('new-book');
            socket.off('connect_error');
        };
    }, [socket]);

    if (loading) return <div className="text-center p-4">Loading books...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Explore</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map(book => (
                    <div key={book.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        

                        {book.coverUrl && (
    <img 
        src={book.coverUrl} 
        alt={book.title}
        className="w-full h-100 object-cover rounded-lg shadow-sm"
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
                            <h3 className="mb-2">Owner Details</h3>
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