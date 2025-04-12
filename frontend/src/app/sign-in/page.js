"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            router.push(data.user.role === 'OWNER' ? '/dashboard' : '/browse'); // handle later
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Sign In</h1>

            <p>Required fields are followed by <strong><span aria-label="required">*</span></strong>.</p>
            
            <form action="" method="post">
                <fieldset>
                    <p>
                        <label htmlFor="user_email">Email: <span aria-label="required">*</span></label>
                        <input type="email" id="user_email" name="user_email" placeholder="johndoe@example.com" required />
                    </p>

                    <p>
                        <label htmlFor="user_password">Password: <span aria-label="required">*</span></label>
                        <input type="password" id="user_password" name="user_password" minLength="6" required />
                    </p>
                </fieldset>
                
                <p>
                    <button type="submit">Sign In</button>
                </p>
            </form>
        </div>
    );
};