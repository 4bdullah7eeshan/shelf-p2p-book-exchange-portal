"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = {
            name: e.currentTarget.user_full_name.value,
            mobile: e.currentTarget.user_phone_number.value,
            email: e.currentTarget.user_email.value,
            password: e.currentTarget.user_password.value,
            role: e.currentTarget.user_role.value.toUpperCase()
        };

        try {
            const response = await fetch('/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/sign-in');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1  className="text-2xl font-bold mb-4">Sign Up</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <p>Required fields are followed by <strong><span aria-label="required">*</span></strong>.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <fieldset>
                    <p>
                        <label className="block mb-2" htmlFor="user_full_name">Full Name: <span className="text-red-500" aria-label="required">*</span></label>
                        <input className="w-full p-2 border rounded" type="text" id="user_full_name" name="user_full_name" placeholder="John Doe" required />
                    </p>

                    <p>
                        <label className="block mb-2" htmlFor="user_phone_number">Phone Number (+91):</label>
                        <input className="w-full p-2 border rounded" type="tel" id="user_phone_number" name="user_phone_number" pattern="[0-9]{10}" placeholder="9999999999" />
                    </p>

                    <p>
                        <label className="block mb-2" htmlFor="user_email">Email: <span className="text-red-500" aria-label="required">*</span></label>
                        <input className="w-full p-2 border rounded" type="email" id="user_email" name="user_email" placeholder="johndoe@example.com" required />
                    </p>

                    <p>
                        <label className="block mb-2" htmlFor="user_password">Password: <span className="text-red-500" aria-label="required">*</span></label>
                        <input className="w-full p-2 border rounded" type="password" id="user_password" name="user_password" minLength="6" required />
                    </p>

                    <p>
                        <label className="block mb-2" htmlFor="user_role">Select a role: <span aria-label="required">*</span></label>
                        <select className="w-full p-2 border rounded" name="user_role" required>
                            <option value="SEEKER">Seeker</option>
                            <option value="OWNER">Owner</option>
                        </select>
                    </p>
                </fieldset>
                
                <p>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Sign Up'}
                    </button>
                </p>
            </form>
        </div>
    );
};