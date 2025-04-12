"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        genre: '',
        city: '',
        contact: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingBook, setEditingBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData) {
            router.push('/sign-in');
            return;
        }

        setUser(userData);
        fetchBooks(userData.role, userData.id);
    }, []);

    const fetchBooks = async (role, userId) => {
        try {
            const endpoint = role === 'OWNER'
                ? `http://localhost:3001/v1/books/owner?userId=${userId}`
                : `http://localhost:3001/v1/books/rented?userId=${userId}`;

            const response = await fetch(endpoint);

            if (!response.ok) throw new Error('Failed to fetch books');

            const data = await response.json();
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));


        try {
            const response = await fetch('http://localhost:3001/v1/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newBook,
                    ownerId: user.id,
                })
            });

            if (!response.ok) throw new Error('Failed to add book');

            const data = await response.json();
            setBooks([...books, data]);
            setNewBook({ title: '', author: '', genre: '', city: '', contact: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBook = async (bookId, updatedData) => {
        try {
            const response = await fetch(`http://localhost:3001/v1/books/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Failed to update book');

            setBooks(books.map(book =>
                book.id === bookId ? { ...book, ...updatedData } : book
            ));
            setIsEditing(false);
            setEditingBook(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (!confirm("Are you sure you want to delete this book?")) return;

        try {
            const response = await fetch(`http://localhost:3001/v1/books/${bookId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete book');

            setBooks(books.filter(book => book.id !== bookId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">
                Welcome, {user.name} ({user.role})
            </h1>

            {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>}

            {user.role === 'OWNER' ? (
                <div className="space-y-8">
                    {/* Add Book Form */}
                    <section className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
                        <form onSubmit={handleAddBook} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border rounded"
                                        value={newBook.title}
                                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Author *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border rounded"
                                        value={newBook.author}
                                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Genre</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={newBook.genre}
                                        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">City *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border rounded"
                                        value={newBook.city}
                                        onChange={(e) => setNewBook({ ...newBook, city: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Book'}
                            </button>
                        </form>
                    </section>

                    {/* Owner's Book List */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Your Listed Books</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {books.map(book => (
                                <div key={book.id} className="relative border p-4 rounded-lg">
                                    <div className="absolute top-2 right-2 space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingBook(book);
                                                setIsEditing(true);
                                            }}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBook(book.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <h3 className="font-semibold text-lg">{book.title}</h3>
                                    <p className="text-gray-600">{book.author}</p>
                                    <div className="mt-2 text-sm">
                                        <p>Genre: {book.genre || '-'}</p>
                                        <p>Location: {book.city}</p>
                                        <p>Status: {book.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {isEditing && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg w-96">
                                <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateBook(editingBook.id, {
                                        title: editingBook.title,
                                        author: editingBook.author,
                                        genre: editingBook.genre,
                                        city: editingBook.city,
                                        status: editingBook.status
                                    });
                                }}>
                                    <div className="space-y-4">
                                        <div>
                                            <label>Title *</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 border rounded"
                                                value={editingBook.title}
                                                onChange={(e) => setEditingBook({
                                                    ...editingBook,
                                                    title: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1">Author *</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 border rounded"
                                                value={editingBook.author}
                                                onChange={(e) => setEditingBook({
                                                    ...editingBook,
                                                    author: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1">Genre</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={editingBook.genre || ''}
                                                onChange={(e) => setEditingBook({
                                                    ...editingBook,
                                                    genre: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1">City *</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 border rounded"
                                                value={editingBook.city}
                                                onChange={(e) => setEditingBook({
                                                    ...editingBook,
                                                    city: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label>Status</label>
                                            <select
                                                className="w-full p-2 border rounded"
                                                value={editingBook.status}
                                                onChange={(e) => setEditingBook({
                                                    ...editingBook,
                                                    status: e.target.value
                                                })}
                                            >
                                                <option value="AVAILABLE">Available</option>
                                                <option value="RENTED">Rented</option>
                                                <option value="EXCHANGED">Exchanged</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 border rounded"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Seeker's Rented Books */
                <section>
                    <h2 className="text-xl font-semibold mb-4">Your Rented Books</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {books.map(book => (
                            <div key={book.id} className="border p-4 rounded-lg">
                                <h3 className="font-semibold text-lg">{book.title}</h3>
                                <p className="text-gray-600">{book.author}</p>
                                <div className="mt-2 text-sm">
                                    <p>Owner: {book.owner.name}</p>
                                    <p>Contact: {book.contact}</p>
                                    <p>Due Date: {book.dueDate || 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                        {books.length === 0 && <p>No rented books found</p>}
                    </div>
                </section>
            )}
        </div>
    );
};