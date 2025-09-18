import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Listing } from '../../types';

const InventoryManagement: React.FC = () => {
    const { listings, addListing, updateListing, deleteListing } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingListing, setEditingListing] = useState<Listing | null>(null);
    const [formData, setFormData] = useState<Omit<Listing, 'id' | 'created_at' | 'status'>>({
        name: '',
        category: '',
        price: 0,
        details: '',
        type: 'social',
        platform: '',
        region: ''
    });

    useEffect(() => {
        if (editingListing) {
            setFormData({
                name: editingListing.name,
                category: editingListing.category,
                price: editingListing.price,
                details: editingListing.details,
                type: editingListing.type,
                platform: editingListing.platform,
                region: editingListing.region || ''
            });
        } else {
            resetForm();
        }
    }, [editingListing]);

    const resetForm = () => {
        setFormData({ name: '', category: '', price: 0, details: '', type: 'social', platform: '', region: '' });
    };

    const handleOpenModal = (listing: Listing | null = null) => {
        setEditingListing(listing);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingListing(null);
        setIsModalOpen(false);
        resetForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingListing) {
            updateListing({ ...editingListing, ...formData });
        } else {
            addListing(formData);
        }
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold text-burgundy-400">Inventory Management</h2>
                <button onClick={() => handleOpenModal()} className="bg-burgundy-800 hover:bg-burgundy-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Add New Listing</button>
            </div>

            <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3 font-semibold">Name</th>
                            <th className="p-3 font-semibold">Category</th>
                            <th className="p-3 font-semibold">Price</th>
                            <th className="p-3 font-semibold">Status</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {listings.map((listing: Listing) => (
                            <tr key={listing.id}>
                                <td className="p-3">{listing.name}</td>
                                <td className="p-3">{listing.category}</td>
                                <td className="p-3">₦{listing.price.toFixed(2)}</td>
                                <td className="p-3 capitalize">{listing.status}</td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => handleOpenModal(listing)} className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded">Edit</button>
                                    <button onClick={() => deleteListing(listing.id)} className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 text-xs rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-white">{editingListing ? 'Edit Listing' : 'Add New Listing'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                             <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Listing Name" required className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors" />
                            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors" />
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" step="0.01" required className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors" />
                            <input type="text" name="platform" value={formData.platform} onChange={handleChange} placeholder="Platform (e.g., Instagram)" required className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors" />
                            <textarea name="details" value={formData.details} onChange={handleChange} placeholder="Listing Details" required rows={3} className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"></textarea>
                            <div className="flex justify-end gap-4 pt-2">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-semibold transition-colors">Cancel</button>
                                <button type="submit" className="bg-burgundy-800 hover:bg-burgundy-700 text-white px-4 py-2 rounded-md font-semibold transition-colors">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;