import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';

const OrderManagement: React.FC = () => {
    const { allOrders, users } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'disputed'>('all');
    const [sortConfig, setSortConfig] = useState<{ key: 'created_at' | 'amount'; direction: 'ascending' | 'descending' } | null>({ key: 'created_at', direction: 'descending' });

    const userMap = useMemo(() => {
        const map = new Map<string, string>();
        users.forEach(user => map.set(user.id, user.username));
        return map;
    }, [users]);

    const getUserName = (userId: string) => {
        return userMap.get(userId) || 'Unknown User';
    };

    const getListingName = (order: Order) => {
      return order.listings?.name || order.productName || `Listing ID: ${order.listing_id.substring(0, 8)}`;
    }
    
    const getStatusColor = (status: 'pending' | 'completed' | 'disputed') => {
        switch (status) {
            case 'pending': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
            case 'completed': return 'bg-green-900/50 text-green-300 border-green-700';
            case 'disputed': return 'bg-red-900/50 text-red-300 border-red-700';
            default: return 'bg-gray-700 text-gray-300 border-gray-600';
        }
    };
    
    const requestSort = (key: 'created_at' | 'amount') => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: 'created_at' | 'amount') => {
        if (!sortConfig || sortConfig.key !== key) {
            return <span className="ml-1 text-gray-500">↕</span>;
        }
        return <span className="ml-1">{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
    };


    const filteredAndSortedOrders = useMemo(() => {
        let sortableOrders = [...allOrders];

        if (searchTerm.trim() !== '') {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            sortableOrders = sortableOrders.filter(order => {
                const userName = getUserName(order.user_id).toLowerCase();
                const listingName = getListingName(order).toLowerCase();
                const orderId = order.id.toString();

                return (
                    userName.includes(lowerCaseSearchTerm) ||
                    listingName.includes(lowerCaseSearchTerm) ||
                    orderId.includes(lowerCaseSearchTerm)
                );
            });
        }
        
        if (statusFilter !== 'all') {
            sortableOrders = sortableOrders.filter(order => order.status === statusFilter);
        }
        
        if (sortConfig !== null) {
            sortableOrders.sort((a, b) => {
                if (sortConfig.key === 'created_at') {
                    const dateA = new Date(a.created_at).getTime();
                    const dateB = new Date(b.created_at).getTime();
                    return (dateA - dateB) * (sortConfig.direction === 'ascending' ? 1 : -1);
                } else { // amount
                    return (a.amount - b.amount) * (sortConfig.direction === 'ascending' ? 1 : -1);
                }
            });
        } else {
             // Default sort by date descending if no config
            sortableOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        return sortableOrders;
    }, [allOrders, users, searchTerm, statusFilter, sortConfig]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold text-burgundy-400">Order Management</h2>
                 <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full sm:w-auto bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="disputed">Disputed</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search Orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                    />
                </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3 font-semibold">Order ID</th>
                            <th className="p-3 font-semibold">User</th>
                            <th className="p-3 font-semibold">Product Name</th>
                            <th className="p-3 font-semibold cursor-pointer hover:bg-gray-700" onClick={() => requestSort('amount')}>
                                <div className="flex items-center">Price {getSortIndicator('amount')}</div>
                            </th>
                            <th className="p-3 font-semibold">Status</th>
                            <th className="p-3 font-semibold cursor-pointer hover:bg-gray-700" onClick={() => requestSort('created_at')}>
                               <div className="flex items-center">Date {getSortIndicator('created_at')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredAndSortedOrders.length > 0 ? filteredAndSortedOrders.map((order: Order) => (
                            <tr key={order.id}>
                                <td className="p-3 font-mono text-xs">#{order.id.substring(0, 8)}...</td>
                                <td className="p-3">{getUserName(order.user_id)}</td>
                                <td className="p-3">{getListingName(order)}</td>
                                <td className="p-3">₦{order.amount.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3">{new Date(order.created_at).toLocaleDateString()}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center p-6 text-gray-400">
                                    No orders match your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;