import React from 'react';

const PrivacyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto text-gray-300">
             <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 space-y-6 prose prose-invert prose-p:text-gray-300 prose-headings:text-burgundy-400">
                <div>
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support. This may include your username and email address.</p>
                </div>
                <div>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to operate, maintain, and provide the features and functionality of the service, to process transactions, and to communicate with you.</p>
                </div>
                <div>
                    <h2>3. Data Security</h2>
                    <p>We use commercially reasonable safeguards to help keep the information collected through the service secure. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.</p>
                </div>
                <div>
                    <h2>4. Changes to Our Privacy Policy</h2>
                    <p>We may modify or update this Privacy Policy from time to time, so you should review this page periodically. Your continued use of the site after any modification to this Privacy Policy will constitute your acceptance of such modification.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;