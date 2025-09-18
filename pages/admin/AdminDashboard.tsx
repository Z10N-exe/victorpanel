import React, { useState } from 'react';
import UserManagement from './UserManagement';
import InventoryManagement from './InventoryManagement';
import OrderManagement from './OrderManagement';
import SiteSettings from './SiteSettings';
import Analytics from './Analytics';

type AdminTab = 'users' | 'inventory' | 'orders' | 'settings' | 'analytics';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

    const renderContent = () => {
        switch (activeTab) {
            case 'analytics':
                return <Analytics />;
            case 'users':
                return <UserManagement />;
            case 'inventory':
                return <InventoryManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'settings':
                return <SiteSettings />;
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{tabId: AdminTab; label: string}> = ({ tabId, label}) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-3 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${activeTab === tabId ? 'border-b-2 border-burgundy-500 text-white' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}
        >
            {label}
        </button>
    )

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <div className="border-b border-gray-800">
                <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
                    <TabButton tabId="analytics" label="Analytics" />
                    <TabButton tabId="users" label="Users & Deposits" />
                    <TabButton tabId="inventory" label="Inventory" />
                    <TabButton tabId="orders" label="Orders" />
                    <TabButton tabId="settings" label="Site Settings" />
                </div>
            </div>
            <div className="bg-gray-900/50 p-4 md:p-6 rounded-lg border border-gray-800 min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;