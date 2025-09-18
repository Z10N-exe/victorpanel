import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Listing } from '../types';
import { useNavigate } from 'react-router-dom';

const ListingCard: React.FC<{ listing: Listing; onPurchase: (listing: Listing) => void; }> = ({ listing, onPurchase }) => {
    const { isAuthenticated } = useAppContext();
    const canPurchase = isAuthenticated && listing.status === 'available';

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-6 flex flex-col hover:border-burgundy-700 transition-all duration-300 group">
            <h3 className="text-lg font-bold text-white mb-2">{listing.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-burgundy-400 mb-4">{listing.category}</p>
            <p className="text-gray-300 flex-grow mb-4 text-sm">{listing.details}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                <p className="text-2xl font-bold text-white">₦{listing.price.toFixed(2)}</p>
                <button 
                    onClick={() => onPurchase(listing)}
                    disabled={!canPurchase}
                    className={`px-5 py-2 rounded-md font-semibold transition-all text-sm duration-300 ${
                        canPurchase 
                        ? 'bg-burgundy-800 text-white hover:bg-burgundy-700 group-hover:scale-105'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    title={!isAuthenticated ? "Please log in to purchase" : listing.status !== 'available' ? "Out of stock" : ""}
                >
                    {listing.status === 'available' ? `Buy Now` : 'Out of Stock'}
                </button>
            </div>
        </div>
    )
};

const HomePage: React.FC = () => {
    const { listings, listingsLoading, listingsError, purchaseListing, isAuthenticated, showNotification } = useAppContext();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<string>('All');
    const [countryFilter, setCountryFilter] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    const handlePurchaseClick = (listing: Listing) => {
        if (!isAuthenticated) {
            showNotification('Please log in to purchase products.', 'info');
            navigate('/login');
            return;
        }
        purchaseListing(listing.id);
    };

    const categories = useMemo(() => {
        if (!listings) return ['All'];
        const uniqueCategories = new Set(listings.map(p => p.category));
        return ['All', ...Array.from(uniqueCategories)];
    }, [listings]);

    const isVirtualNumberCategory = useMemo(() => {
      return filter.toLowerCase().includes('virtual');
    }, [filter]);

    const countries = useMemo(() => {
        if (!listings || !isVirtualNumberCategory) return [];
        const countrySet = new Set<string>();
        listings.forEach(p => {
            if (p.category.toLowerCase().includes('virtual') && p.region) {
                countrySet.add(p.region);
            }
        });
        return ['All', ...Array.from(countrySet).sort()];
    }, [listings, isVirtualNumberCategory]);

    const filteredListings = useMemo(() => {
        if (!listings) return [];
        return listings
            .filter(p => p.status === 'available')
            .filter(p => filter === 'All' || p.category === filter)
            .filter(p => !isVirtualNumberCategory || countryFilter === 'All' || p.region === countryFilter)
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [listings, filter, countryFilter, searchTerm, isVirtualNumberCategory]);
    
    const paginatedListings = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredListings, currentPage]);

    const totalPages = useMemo(() => Math.ceil(filteredListings.length / ITEMS_PER_PAGE), [filteredListings]);
    
    useEffect(() => { setCurrentPage(1); }, [filter, countryFilter, searchTerm]);

    useEffect(() => { if (!isVirtualNumberCategory) setCountryFilter('All'); }, [filter, isVirtualNumberCategory]);

    return (
        <div className="space-y-10">
            <div className="text-center pt-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Marketplace</h1>
                <p className="text-lg text-gray-400">Your one-stop shop for digital assets.</p>
            </div>

            {listingsError && (
                <div className="p-4 rounded-md text-center bg-red-900/50 border border-red-700 text-red-200">
                    <p className="font-semibold">Error Loading Listings</p>
                    <p className="text-sm">Could not load live services: {listingsError}.</p>
                </div>
            )}
            
            <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <input type="text" placeholder="Search for products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-3 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors" />
                <div className="flex gap-2 flex-wrap justify-center pt-2">
                    {categories.slice(0, 5).map(category => (
                        <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${filter === category ? 'bg-burgundy-800 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{category}</button>
                    ))}
                </div>
                 {isVirtualNumberCategory && countries.length > 1 && (
                    <div className="flex gap-2 flex-wrap justify-center border-t border-gray-800 pt-4 mt-2">
                        {countries.map(country => (
                            <button key={country} onClick={() => setCountryFilter(country)} className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${countryFilter === country ? 'bg-burgundy-800 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{country}</button>
                        ))}
                    </div>
                 )}
            </div>
            
            {listingsLoading ? ( <div className="text-center py-10 text-gray-400">Loading services...</div> ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedListings.length > 0 ? paginatedListings.map(listing => (
                            <ListingCard key={listing.id} listing={listing} onPurchase={handlePurchaseClick} />
                        )) : ( <p className="text-center text-gray-400 md:col-span-2 lg:col-span-3 py-10">No products match your criteria.</p> )}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-semibold transition-colors">Previous</button>
                            <span className="text-gray-300 font-medium">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-semibold transition-colors">Next</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;