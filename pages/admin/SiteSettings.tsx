import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SiteSettings as SiteSettingsType } from '../../types';

const SiteSettings: React.FC = () => {
    const { siteSettings, updateSiteSettings } = useAppContext();
    const [settings, setSettings] = useState<SiteSettingsType>(siteSettings);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await updateSiteSettings(settings);
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-burgundy-400">Site Settings</h2>
            
            <div className="space-y-6 max-w-2xl">
                <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-1">Bank Name</label>
                    <input
                        type="text"
                        id="bankName"
                        name="bankName"
                        value={settings.bankName}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-md p-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        placeholder="e.g., Global Digital Bank"
                    />
                </div>
                 <div>
                    <label htmlFor="accountName" className="block text-sm font-medium text-gray-300 mb-1">Account Name</label>
                    <input
                        type="text"
                        id="accountName"
                        name="accountName"
                        value={settings.accountName}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-md p-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        placeholder="e.g., Victor SMM Services"
                    />
                </div>
                 <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
                    <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={settings.accountNumber}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-md p-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        placeholder="e.g., 123-456-7890"
                    />
                </div>
                <div>
                    <label htmlFor="paymentInstructions" className="block text-sm font-medium text-gray-300 mb-1">
                        Payment Instructions
                    </label>
                    <p className="text-xs text-gray-400 mb-2">This text will be displayed below the account details on the deposit page.</p>
                    <textarea
                        id="paymentInstructions"
                        name="paymentInstructions"
                        value={settings.paymentInstructions}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-md p-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                        placeholder="Enter payment instructions here."
                    ></textarea>
                </div>
                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-burgundy-800 hover:bg-burgundy-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SiteSettings;