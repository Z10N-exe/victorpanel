import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAppContext();

    return (
        <div className="flex flex-col items-center justify-center text-center py-20 md:py-32">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                Welcome to Victor's SMM<span className="text-burgundy-500">PANEL</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
                Your premier destination for high-quality virtual numbers and social media accounts. Get started in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                    <Link
                        to="/marketplace"
                        className="bg-burgundy-800 text-white font-semibold px-8 py-3 rounded-md text-lg hover:bg-burgundy-700 transition-transform transform hover:scale-105"
                    >
                        Go to Marketplace
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/signup"
                            className="bg-burgundy-800 text-white font-semibold px-8 py-3 rounded-md text-lg hover:bg-burgundy-700 transition-transform transform hover:scale-105"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/marketplace"
                            className="bg-gray-800 text-gray-300 font-semibold px-8 py-3 rounded-md text-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                        >
                            Explore Services
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default LandingPage;