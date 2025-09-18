import React, { useState } from 'react';

const faqData = [
    {
        question: "How do I make a deposit?",
        answer: "Navigate to the Deposit page. You will find our payment details (e.g., Bitcoin address). After sending the payment, fill out the form on the same page with the amount and transaction proof. An admin will review and credit your account."
    },
    {
        question: "How long does it take for my deposit to be approved?",
        answer: "Deposits are manually approved by our admins. This typically takes between 1-6 hours, but can sometimes be faster. You can check the status of your deposit in your User Dashboard."
    },
    {
        question: "How do I receive my purchased product?",
        answer: "Once a purchase is made, the details of the virtual number or social media account (e.g., login credentials) will be instantly available in your Order History on your User Dashboard."
    },
    {
        question: "What is your refund policy?",
        answer: "All sales are final. We do not offer refunds once a product has been purchased and delivered. If you encounter an issue with a product, please contact support within 24 hours of purchase."
    }
];

const FAQItem: React.FC<{ item: { question: string, answer: string }, isOpen: boolean, toggle: () => void }> = ({ item, isOpen, toggle }) => {
    return (
        <div className="border-b border-gray-800 last:border-b-0">
            <button onClick={toggle} className="w-full text-left flex justify-between items-center p-6 hover:bg-gray-800/50">
                <h3 className={`text-lg font-medium ${isOpen ? 'text-burgundy-400' : 'text-white'}`}>{item.question}</h3>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="px-6 pb-6 text-gray-300">{item.answer}</p>
            </div>
        </div>
    );
};


const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Frequently Asked Questions</h1>
                <p className="text-lg text-gray-400">Find answers to common questions below.</p>
            </div>
            <div className="bg-gray-900 rounded-lg border border-gray-800">
                {faqData.map((item, index) => (
                    <FAQItem key={index} item={item} isOpen={openIndex === index} toggle={() => toggleFAQ(index)} />
                ))}
            </div>
        </div>
    );
};

export default FAQPage;