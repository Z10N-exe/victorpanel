import { User, Listing, Order, DepositRequest, DepositStatus, SiteSettings } from '../types';

export const MOCK_USERS: User[] = [
  { id: '1', username: 'john_doe', email: 'john.doe@example.com', balance: 150.75 },
  { id: '2', username: 'jane_smith', email: 'jane.smith@example.com', balance: 25.00 },
];

export const MOCK_PRODUCTS: Listing[] = [
  { id: '1', name: 'USA Virtual Number', category: 'Virtual Numbers', price: 5.50, details: 'Receive SMS for verification. Valid for 24 hours.', type: 'number', platform: 'Generic', region: 'USA', status: 'available' },
  { id: '2', name: 'UK Virtual Number', category: 'Virtual Numbers', price: 7.00, details: 'UK-based number for all services.', type: 'number', platform: 'Generic', region: 'UK', status: 'available' },
  { id: '3', name: 'Aged Instagram Account', category: 'Social Accounts', price: 25.00, details: '3 years old, 500+ followers. Email included.', type: 'social', platform: 'Instagram', status: 'available' },
  { id: '4', name: 'Verified Twitter Account', category: 'Social Accounts', price: 150.00, details: 'Blue check verified account. High engagement.', type: 'social', platform: 'Twitter', status: 'available' },
  { id: '5', name: 'Telegram Account (USA)', category: 'Social Accounts', price: 12.00, details: 'USA phone number verified Telegram account.', type: 'social', platform: 'Telegram', region: 'USA', status: 'available' },
];

export const MOCK_ORDERS: Order[] = [
  { id: '1', user_id: '1', listing_id: '3', productName: 'Aged Instagram Account', amount: 25.00, created_at: '2023-10-26', status: 'completed' },
];

export const MOCK_DEPOSIT_REQUESTS: DepositRequest[] = [
  { id: '1', user_id: '2', username: 'jane_smith', amount: 50, proof: 'TXN12345ABC', payment_proof: 'https://example.com/proof.png', status: DepositStatus.PENDING, created_at: '2023-10-27' },
  { id: '2', user_id: '1', username: 'john_doe', amount: 100, proof: 'TXN67890DEF', payment_proof: 'https://example.com/proof2.png', status: DepositStatus.APPROVED, created_at: '2023-10-25' },
];

export const MOCK_SITE_SETTINGS: SiteSettings = {
  bankName: 'Global Digital Bank',
  accountName: 'Victor SMM Services',
  accountNumber: '123-456-7890',
  paymentInstructions: 'After sending payment, please enter the amount and upload a screenshot of the transaction in the form below to submit your deposit request.',
};