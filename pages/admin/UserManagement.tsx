import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { User, DepositRequest, DepositStatus } from '../../types';

const UserManagement: React.FC = () => {
    const { users, depositRequests, updateUserBalance, processDeposit } = useAppContext();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newBalance, setNewBalance] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: 'username' | 'balance'; direction: 'ascending' | 'descending' } | null>(null);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setNewBalance(user.balance.toString());
    };

    const handleUpdateBalance = () => {
        if (selectedUser && newBalance !== '') {
            const balanceValue = parseFloat(newBalance);
            if (!isNaN(balanceValue)) {
                updateUserBalance(selectedUser.id, balanceValue);
                setSelectedUser(null);
                setNewBalance('');
            }
        }
    };
    
     const getStatusColor = (status: DepositStatus) => {
        switch (status) {
            case DepositStatus.PENDING: return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
            case DepositStatus.APPROVED: return 'bg-green-900/50 text-green-300 border-green-700';
            case DepositStatus.REJECTED: return 'bg-red-900/50 text-red-300 border-red-700';
            default: return 'bg-gray-700 text-gray-300 border-gray-600';
        }
    };

    const requestSort = (key: 'username' | 'balance') => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: 'username' | 'balance') => {
        if (!sortConfig || sortConfig.key !== key) {
            return <span className="ml-1 text-gray-500">↕</span>;
        }
        return <span className="ml-1">{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
    };


    const filteredAndSortedUsers = useMemo(() => {
        let sortableUsers = [...users];
        
        if (searchTerm) {
            sortableUsers = sortableUsers.filter(user => 
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        if (sortConfig !== null) {
            sortableUsers.sort((a, b) => {
                if (sortConfig.key === 'username') {
                    return a.username.localeCompare(b.username) * (sortConfig.direction === 'ascending' ? 1 : -1);
                } else { // balance
                    return (a.balance - b.balance) * (sortConfig.direction === 'ascending' ? 1 : -1);
                }
            });
        }

        return sortableUsers;
    }, [users, searchTerm, sortConfig]);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-burgundy-400">Deposit Requests</h2>
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                         <thead className="bg-gray-800">
                            <tr>
                                <th className="p-3 font-semibold">User</th>
                                <th className="p-3 font-semibold">Amount</th>
                                <th className="p-3 font-semibold">Proof</th>
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {depositRequests.map((req: DepositRequest) => (
                                <tr key={req.id}>
                                    <td className="p-3">{req.users?.username || req.username}</td>
                                    <td className="p-3">₦{req.amount.toFixed(2)}</td>
                                    <td className="p-3"><a href={req.payment_proof} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Proof</a></td>
                                    <td className="p-3">{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs font-bold capitalize rounded-full border ${getStatusColor(req.status)}`}>{req.status}</span></td>
                                    <td className="p-3">
                                        {req.status === DepositStatus.PENDING && (
                                            <div className="flex gap-2">
                                                <button onClick={() => processDeposit(req.id, DepositStatus.APPROVED)} className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 text-xs rounded">Approve</button>
                                                <button onClick={() => processDeposit(req.id, DepositStatus.REJECTED)} className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 text-xs rounded">Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h2 className="text-2xl font-semibold text-burgundy-400">User Management</h2>
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 lg:w-1/3 bg-gray-800 border-2 border-gray-700 rounded-md px-4 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                    />
                </div>
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-x-auto">
                     <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="p-3 font-semibold">ID</th>
                                <th className="p-3 font-semibold cursor-pointer hover:bg-gray-700" onClick={() => requestSort('username')}>
                                    <div className="flex items-center">Username {getSortIndicator('username')}</div>
                                </th>
                                <th className="p-3 font-semibold">Email</th>
                                <th className="p-3 font-semibold cursor-pointer hover:bg-gray-700" onClick={() => requestSort('balance')}>
                                    <div className="flex items-center">Balance {getSortIndicator('balance')}</div>
                                </th>
                                <th className="p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredAndSortedUsers.map((user: User) => (
                                <tr key={user.id}>
                                    <td className="p-3 truncate max-w-[50px] font-mono text-xs">{user.id}</td>
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">₦{user.balance.toFixed(2)}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleSelectUser(user)} className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded">Edit Balance</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-white">Edit Balance for {selectedUser.username}</h3>
                        <input
                            type="number"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white mb-4 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        />
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setSelectedUser(null)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-semibold transition-colors">Cancel</button>
                            <button onClick={handleUpdateBalance} className="bg-burgundy-800 hover:bg-burgundy-700 text-white px-4 py-2 rounded-md font-semibold transition-colors">Save</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserManagement;