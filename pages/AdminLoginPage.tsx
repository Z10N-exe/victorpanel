import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginAdmin } = useAppContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const success = await loginAdmin(email, password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Incorrect credentials. Access denied.');
            setPassword('');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
                    <p className="text-gray-400 mb-6">Enter credentials to access the dashboard.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email Address"
                            autoComplete="email"
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
                            autoComplete="current-password"
                            className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-3 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-burgundy-800 text-white px-4 py-3 rounded-md font-semibold hover:bg-burgundy-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Authenticate'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;