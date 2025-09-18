import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto text-gray-300">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 space-y-6 prose prose-invert prose-p:text-gray-300 prose-headings:text-burgundy-400">
                <div>
                    <h2>1. Introduction</h2>
                    <p>Welcome to Victor's SMM Panel. By accessing our website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                </div>
                <div>
                    <h2>2. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials on Victor's SMM Panel's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                </div>
                <div>
                    <h2>3. Disclaimer</h2>
                    <p>The materials on Victor's SMM Panel's website are provided on an 'as is' basis. Victor's SMM Panel makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </div>
                 <div>
                    <h2>4. All Sales Final</h2>
                    <p>All purchases made on Victor's SMM Panel are final. We do not offer refunds for any products or services once the order is completed and delivered. Please ensure you have selected the correct product before completing your purchase.</p>
                </div>
                <div>
                    <h2>5. Governing Law</h2>
                    <p>These terms and conditions are governed by and construed in accordance with the laws of our jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;