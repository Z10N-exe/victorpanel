import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAppContext();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const success = await login(email, password);

        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid login credentials. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400 mb-6">Login to access your dashboard.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-3 rounded-md">{error}</p>}
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
                            placeholder="Password"
                            className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-3 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-burgundy-800 text-white px-4 py-3 rounded-md font-semibold hover:bg-burgundy-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-burgundy-400 hover:text-burgundy-300">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;