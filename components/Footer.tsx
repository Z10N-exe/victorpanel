import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
            <div className="flex-shrink-0">
                <p className="text-white font-bold text-lg">VICTOR'S SMM<span className="text-burgundy-500">PANEL</span></p>
                <p className="text-gray-400 text-sm mt-1">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-4">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-400">
                    <Link to="/marketplace" className="hover:text-white transition-colors text-sm">Marketplace</Link>
                    <Link to="/faq" className="hover:text-white transition-colors text-sm">FAQ</Link>
                    <Link to="/terms" className="hover:text-white transition-colors text-sm">Terms</Link>
                    <Link to="/privacy" className="hover:text-white transition-colors text-sm">Privacy</Link>
                </div>
                 <Link to="/admin-login" className="text-xs text-gray-500 hover:text-burgundy-500 transition-colors font-semibold">Admin</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;