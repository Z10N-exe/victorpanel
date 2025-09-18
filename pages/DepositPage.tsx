import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const DepositPage: React.FC = () => {
    const { isAuthenticated, siteSettings, submitDeposit, showNotification } = useAppContext();
    const [amount, setAmount] = useState('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!isNaN(numericAmount) && numericAmount > 0 && proofFile) {
            setIsSubmitting(true);
            await submitDeposit(numericAmount, proofFile);
            setAmount('');
            setProofFile(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
            setIsSubmitting(false);
        }
    };
    
    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(`${fieldName} copied to clipboard!`, 'success');
        }, () => {
            showNotification(`Failed to copy ${fieldName}.`, 'error');
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Manual Deposit</h1>
                <p className="text-lg text-gray-400">Follow the instructions to add funds to your account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h2 className="text-2xl font-semibold mb-4 text-white">1. Payment Details</h2>
                     <div className="text-gray-300 space-y-4">
                        <div className="space-y-1">
                            <p className="font-semibold text-gray-400 text-sm">Bank Name:</p>
                            <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-md">
                                <span className="flex-grow font-mono text-white">{siteSettings.bankName}</span>
                                <button onClick={() => copyToClipboard(siteSettings.bankName, 'Bank Name')} className="p-1 text-gray-400 hover:text-white transition-colors" aria-label="Copy Bank Name"><CopyIcon /></button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-gray-400 text-sm">Account Name:</p>
                             <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-md">
                                <span className="flex-grow font-mono text-white">{siteSettings.accountName}</span>
                                <button onClick={() => copyToClipboard(siteSettings.accountName, 'Account Name')} className="p-1 text-gray-400 hover:text-white transition-colors" aria-label="Copy Account Name"><CopyIcon /></button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-gray-400 text-sm">Account Number:</p>
                             <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-md">
                                <span className="flex-grow font-mono text-white">{siteSettings.accountNumber}</span>
                                <button onClick={() => copyToClipboard(siteSettings.accountNumber, 'Account Number')} className="p-1 text-gray-400 hover:text-white transition-colors" aria-label="Copy Account Number"><CopyIcon /></button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-gray-400 text-sm">Instructions:</p>
                            <p className="text-gray-300">{siteSettings.paymentInstructions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h2 className="text-2xl font-semibold mb-4 text-white">2. Submit Your Deposit</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount Deposited (NGN)</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                placeholder="e.g., 50000.00"
                                className="mt-1 block w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="proof" className="block text-sm font-medium text-gray-300 mb-1">Proof of Payment</label>
                             <input
                                type="file"
                                id="proof"
                                ref={fileInputRef}
                                onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
                                required
                                accept="image/png, image/jpeg, image/gif"
                                className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-burgundy-800 file:text-white hover:file:bg-burgundy-700 transition-all cursor-pointer"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !proofFile || !amount}
                            className="w-full bg-burgundy-800 text-white px-4 py-3 rounded-md font-semibold hover:bg-burgundy-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Deposit Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DepositPage;