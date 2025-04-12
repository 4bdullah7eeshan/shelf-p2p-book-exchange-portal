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

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [activeSection, setActiveSection] = useState('home');


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData) {
            router.push('/sign-in');
            return;
        }

        setUser(userData);
        fetchBooks(userData.role, userData.id);
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

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

        const formData = new FormData();
        formData.append('title', newBook.title);
        formData.append('author', newBook.author);
        formData.append('genre', newBook.genre);
        formData.append('city', newBook.city);
        formData.append('ownerId', user.id);
        if (file) formData.append('coverImage', file);

        try {
            const response = await fetch('http://localhost:3001/v1/books', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to add book');

            const data = await response.json();
            setBooks([...books, data]);
            setNewBook({ title: '', author: '', genre: '', city: '', contact: '' });
            setFile(null);
            setPreviewUrl(null);
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

    const SidebarButton = ({ icon, label, section }) => (
        <button
            onClick={() => setActiveSection(section)}
            className={`w-full p-4 text-left flex items-center space-x-3 hover:bg-gray-100 rounded-lg ${activeSection === section ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
        >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
        </button>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'home':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Home</h2>
                        <p className="text-gray-600">
                            {user?.role === 'OWNER'
                                ? "Manage your book listings and track their status here."
                                : "Browse your rented books and discover new ones."}
                        </p>
                    </div>
                );

            case 'view':
                return user?.role === 'OWNER' ? (
                    <section className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Listed Books</h2>
                        {/* Existing book list rendering */}
                        {books.length === 0 ? (
                            <div className="text-center p-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">No books listed yet. Add your first book to get started!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {books.map(book => (
                                    <div key={book.id} className="relative border p-4 rounded-lg">
                                        {book.coverUrl && (
                                            <img
                                                src={book.coverUrl}
                                                alt={book.title}
                                                className="w-full h-48 object-cover mb-4 rounded"
                                                loading="lazy"
                                            />
                                        )}
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
                        )}
                    </section>
                ) : (
                    <section className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Your Rented Books</h2>
                        {/* Existing rented books rendering */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {books.map(book => (
                                <div key={book.id} className="border p-4 rounded-lg">
                                    {book.coverUrl && (
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="w-full h-48 object-cover mb-4 rounded"
                                            loading="lazy"
                                        />
                                    )}
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
                );

            case 'add':
                return (
                    <section className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
                        {/* Existing add book form */}
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

                                <div>
                                    <label className="block mb-2">Cover Image</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="w-full p-2 border rounded"
                                        />
                                        {previewUrl && (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        )}
                                    </div>
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
                );

            default:
                return null;
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex min-h-screen">
            
            {/* Sidebar */}
            <div className="w-64 border-r p-4">
                <div className="space-y-2">
                    <h2 className="text-xl font-bold px-4 py-2">Welcome {user.name}!</h2>
                    <div className="border-b mb-4"></div>

                    <SidebarButton
                        icon="🏠"
                        label="Home"
                        section="home"
                    />

                    {user.role === 'OWNER' ? (
                        <>
                            <SidebarButton
                                icon="📚"
                                label="Listed Books"
                                section="view"
                            />
                            <SidebarButton
                                icon="➕"
                                label="Rent A New Book"
                                section="add"
                            />
                        </>
                    ) : (
                        <SidebarButton
                            icon="📖"
                            label="Rented Books"
                            section="view"
                        />
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">
                        Dashboard
                    </h1>

                    {error && (
                        <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">
                            {error}
                        </div>
                    )}

                    {renderContent()}

                    {/* Edit Modal (remains the same) */}
                    {isEditing && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            {/* Existing edit modal content */}
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
            </div>
            
        </div>
    );
};