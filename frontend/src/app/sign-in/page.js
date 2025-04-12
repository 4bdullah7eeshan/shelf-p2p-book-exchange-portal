"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function SignIn() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = {
            email: e.currentTarget.user_email.value,
            password: e.currentTarget.user_password.value
        };

        try {
            const response = await fetch('http://localhost:3001/v1/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Sign in failed');
            }

            // Store user data
            localStorage.setItem('user', JSON.stringify(data));

            // Redirect based on role
            router.push(data.role === 'OWNER' ? '/dashboard' : '/dashboard'); // handle later

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl text-center font-bold mb-4">Sign In</h1>
            {error && <div className="text-red-500 mb-4 p-2 rounded bg-red-50">{error}</div>}


            <p className="mb-4 text-gray-600">Required fields are followed by <strong><span className="text-red-500" aria-label="required">*</span></strong>.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <fieldset className="space-y-4" disabled={isSubmitting}>
                    <p>
                        <label className="block mb-2 font-medium" htmlFor="user_email">Email: <span className="text-red-500" aria-label="required">*</span></label>
                        <input type="email" id="user_email" name="user_email" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" placeholder="johndoe@example.com" required />
                    </p>

                    <p>
                        <label className="block mb-2 font-medium" htmlFor="user_password">Password: <span className="text-red-500" aria-label="required">*</span></label>
                        <input className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" type="password" id="user_password" name="user_password" minLength="6" required />
                    </p>
                </fieldset>

                <p>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                </p>
            </form>

            <p className="mt-4 text-center text-gray-600">
                Do not have an account yet?{' '}
                <Link className="text-blue-500 hover:text-blue-700" href="/sign-up">
                    Sign up
                </Link>
            </p>
        </div>
    );
};