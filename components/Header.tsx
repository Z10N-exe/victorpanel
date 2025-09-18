import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { isAuthenticated, currentUser, logout, isAdmin, logoutAdmin } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    if(isAdmin) logoutAdmin();
    setIsMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
    }`;
  
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 text-2xl font-semibold text-center rounded-md ${
      isActive ? 'text-burgundy-400' : 'text-gray-300 hover:text-white'
    }`;
    
  const MobileMenu = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
        <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-5 right-5 text-gray-400 hover:text-white"
        >
             <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <div className="flex flex-col space-y-6 text-center">
            <NavLink to="/marketplace" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Marketplace</NavLink>
            {isAuthenticated && (
            <>
                <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/deposit" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Deposit</NavLink>
            </>
            )}
            <NavLink to="/faq" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>FAQ</NavLink>
            <NavLink to="/support" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Support</NavLink>
            {isAdmin && <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>}
        </div>
        <div className="absolute bottom-10 w-full px-5">
             {isAuthenticated && currentUser ? (
                 <div className="text-center">
                    <p className="text-lg font-medium text-white">{currentUser.username}</p>
                    <p className="text-md font-medium text-gray-400">₦{currentUser.balance.toFixed(2)}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 w-full bg-burgundy-800 text-white px-3 py-3 rounded-md text-md font-medium hover:bg-burgundy-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center w-full bg-burgundy-800 text-white px-3 py-3 rounded-md text-md font-medium hover:bg-burgundy-700 transition-colors"
                >
                    Login / Sign Up
                </Link>
            )}
        </div>
    </div>
  );

  return (
    <header className="bg-black/70 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
             <Link to={isAuthenticated ? "/marketplace" : "/"} className="text-white font-bold text-xl tracking-wider">
              VICTOR'S SMM<span className="text-burgundy-500">PANEL</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/marketplace" className={navLinkClass}>Marketplace</NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                  <NavLink to="/deposit" className={navLinkClass}>Deposit</NavLink>
                </>
              )}
              <NavLink to="/faq" className={navLinkClass}>FAQ</NavLink>
              <NavLink to="/support" className={navLinkClass}>Support</NavLink>
               {isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
            </nav>
          </div>
          <div className="hidden md:block">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-4">
                 <span className="text-gray-300 text-sm">
                  Welcome, <span className="font-semibold text-white">{currentUser.username}</span>
                </span>
                <span className="text-gray-300 text-sm">
                  Balance: <span className="font-semibold text-white">₦{currentUser.balance.toFixed(2)}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-burgundy-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-burgundy-700 transition-colors"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && <MobileMenu />}
    </header>
  );
};

export default Header;