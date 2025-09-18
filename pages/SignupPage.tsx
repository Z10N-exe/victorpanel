import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const { signUp } = useAppContext();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);

        const success = await signUp(username, email, password);

        if (success) {
            setMessage('Success! Please check your email to confirm your account.');
            setUsername('');
            setEmail('');
            setPassword('');
        } else {
            setError('Could not create account. The email or username may already be in use.');
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
                    <p className="text-gray-400 mb-6">Join our community of digital asset traders.</p>
                </div>
                <form onSubmit={handleSignup} className="space-y-4">
                    {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-3 rounded-md">{error}</p>}
                    {message && <p className="text-green-400 text-sm text-center bg-green-900/50 p-3 rounded-md">{message}</p>}
                    
                    <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Username"
                            className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-3 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email Address"
                            className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-3 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        />
                    </div>
                     <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password (min. 6 characters)"
                            className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-3 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-burgundy-800 text-white px-4 py-3 rounded-md font-semibold hover:bg-burgundy-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-burgundy-400 hover:text-burgundy-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;