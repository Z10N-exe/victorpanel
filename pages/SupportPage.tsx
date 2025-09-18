import React from 'react';
import { useAppContext } from '../context/AppContext';

const SupportPage: React.FC = () => {
  const { showNotification } = useAppContext();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Support ticket submitted! We will get back to you shortly.", 'success');
    // In a real app, this would submit to a backend service.
    // Here we can reset the form.
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-lg text-gray-400">Need help? We're here for you.</p>
      </div>
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
        <p className="text-gray-300 mb-6 text-center">
          Have an issue with an order or a question? Fill out the form below. Our team typically responds within 24 hours.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              required
              className="mt-1 block w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              id="message"
              rows={5}
              required
              className="mt-1 block w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-2 text-white focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-burgundy-800 text-white px-4 py-3 rounded-md font-semibold hover:bg-burgundy-700 transition-colors"
          >
            Create Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportPage;