import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Order, DepositRequest, DepositStatus } from '../types';
import { Navigate, useNavigate } from 'react-router-dom';

// SVG Icons for the new dashboard navigation
// Fix: Removed hardcoded `h-6 w-6` from className to allow parent to control it fully.
const OrdersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

// Fix: Removed hardcoded `h-6 w-6` from className to allow parent to control it fully.
const DepositIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// Fix: Removed hardcoded `h-6 w-6` from className to allow parent to control it fully.
const ProfileIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

// Main Dashboard Component
const DashboardPage: React.FC = () => {
    const { isAuthenticated, currentUser, orders, depositRequests } = useAppContext();
    const [activeView, setActiveView] = useState<'orders' | 'deposits' | 'profile'>('orders');
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const navigate = useNavigate();

    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/" replace />;
    }

    const userOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const userDeposits = [...depositRequests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const getStatusChipClasses = (status: DepositStatus) => {
        switch (status) {
            case DepositStatus.PENDING: return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
            case DepositStatus.APPROVED: return 'bg-green-900/50 text-green-300 border-green-700';
            case DepositStatus.REJECTED: return 'bg-red-900/50 text-red-300 border-red-700';
            default: return 'bg-gray-700 text-gray-300 border-gray-600';
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'orders':
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                        {userOrders.length > 0 ? userOrders.map((order: Order) => (
                            <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">{order.listings?.name || order.productName}</p>
                                    <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold text-white">₦{order.amount.toFixed(2)}</p>
                                     {order.credentials ? (
                                        <button onClick={() => setViewingOrder(order)} className="text-xs text-burgundy-400 hover:text-burgundy-300 font-semibold">
                                            View Details
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-500">Processing</span>
                                    )}
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-400 py-8">No orders yet.</p>}
                    </div>
                );
            case 'deposits':
                return (
                     <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Deposit History</h2>
                        {userDeposits.length > 0 ? userDeposits.map((deposit: DepositRequest) => (
                             <div key={deposit.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">₦{deposit.amount.toFixed(2)}</p>
                                    <p className="text-sm text-gray-400">{new Date(deposit.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className={`text-xs font-bold capitalize px-3 py-1 rounded-full border ${getStatusChipClasses(deposit.status)}`}>
                                    {deposit.status}
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-400 py-8">No deposit history.</p>}
                    </div>
                );
            case 'profile':
                return (
                    <div className="space-y-4">
                         <h2 className="text-xl font-semibold text-white">Profile Details</h2>
                         <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-3">
                            <p><span className="font-semibold text-gray-400">Username:</span> {currentUser.username}</p>
                            <p><span className="font-semibold text-gray-400">Email:</span> {currentUser.email || 'Not provided'}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    // Fix: Corrected the type for the icon prop to be more specific.
    // React.ReactElement is too generic and doesn't inform TypeScript that the component accepts a className prop.
    // By using React.ReactElement<{ className?: string }>, we solve the type error with React.cloneElement.
    const NavItem: React.FC<{ view: 'orders' | 'deposits' | 'profile'; label: string; icon: React.ReactElement<{ className?: string }> }> = ({ view, label, icon }) => (
        <button onClick={() => setActiveView(view)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <div className={`p-3 rounded-lg ${activeView === view ? 'bg-gray-800' : 'bg-gray-900'}`}>
                {React.cloneElement(icon, { className: `h-6 w-6 ${activeView === view ? 'text-white' : ''}`})}
            </div>
            <span className={`text-xs font-semibold ${activeView === view ? 'text-white' : ''}`}>{label}</span>
        </button>
    );

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header Greeting */}
            <div>
                <h1 className="text-3xl font-bold text-white">Hello, {currentUser.username}!</h1>
                <p className="text-gray-400">Welcome back to your dashboard.</p>
            </div>
            
            {/* Balance Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-400">Current Balance</p>
                        <p className="text-4xl font-bold text-white">₦{currentUser.balance.toFixed(2)}</p>
                    </div>
                    <button onClick={() => navigate('/deposit')} className="bg-burgundy-800 hover:bg-burgundy-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        Deposit Funds
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-around items-center">
                <NavItem view="orders" label="Orders" icon={<OrdersIcon />} />
                <NavItem view="deposits" label="Deposits" icon={<DepositIcon />} />
                <NavItem view="profile" label="Profile" icon={<ProfileIcon />} />
            </div>

            {/* Content Area */}
            <div className="min-h-[200px]">
                {renderContent()}
            </div>

            {/* Order Details Modal */}
            {viewingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-white">Order Details: {viewingOrder.listings?.name || viewingOrder.productName}</h3>
                        <div className="bg-gray-800 p-4 rounded-md">
                            <p className="text-gray-300 font-semibold">Credentials:</p>
                            <pre className="text-white whitespace-pre-wrap break-all mt-2 font-mono text-sm">{viewingOrder.credentials}</pre>
                        </div>
                        <div className="flex justify-end mt-6"><button onClick={() => setViewingOrder(null)} className="bg-burgundy-800 hover:bg-burgundy-700 text-white px-6 py-2 rounded font-semibold transition-colors">Close</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
