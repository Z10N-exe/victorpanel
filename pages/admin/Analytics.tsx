import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { DepositStatus, Order } from '../../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-900 p-5 rounded-lg flex items-center gap-4 border border-gray-800">
        <div className="bg-gray-800 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Analytics: React.FC = () => {
    const { users, allOrders, depositRequests } = useAppContext();

    const totalRevenue = useMemo(() => allOrders.reduce((sum, order: Order) => sum + order.amount, 0), [allOrders]);
    const pendingDeposits = useMemo(() => depositRequests.filter(d => d.status === DepositStatus.PENDING).length, [depositRequests]);
    
    // Mock sales data for the chart
    const salesData = [
        { name: 'Mon', sales: 120 },
        { name: 'Tue', sales: 198 },
        { name: 'Wed', sales: 86 },
        { name: 'Thu', sales: 135 },
        { name: 'Fri', sales: 210 },
        { name: 'Sat', sales: 160 },
        { name: 'Sun', sales: 250 },
    ];
    const maxSales = Math.max(...salesData.map(d => d.sales), 1);

    return (
        <div className="space-y-8">
             <h2 className="text-2xl font-semibold text-burgundy-400">Analytics Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₦${totalRevenue.toFixed(2)}`} icon={<DollarIcon />} />
                <StatCard title="Total Orders" value={allOrders.length} icon={<CartIcon />} />
                <StatCard title="Total Users" value={users.length} icon={<UsersIcon />} />
                <StatCard title="Pending Deposits" value={pendingDeposits} icon={<ClockIcon />} />
            </div>
            
            <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Weekly Sales (Demo)</h3>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 h-80 flex items-end justify-around gap-2">
                    {salesData.map(day => (
                        <div key={day.name} className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div 
                                className="w-full bg-burgundy-800 rounded-t-md hover:bg-burgundy-700 transition-all duration-300"
                                style={{ height: `${(day.sales / maxSales) * 100}%` }}
                                title={`₦${day.sales}`}
                            ></div>
                            <span className="text-xs text-gray-400 mt-2 group-hover:text-white transition-colors">{day.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Simple SVG icons for stat cards
const DollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default Analytics;