export enum DepositStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface User {
  id: string; // uuid
  username: string;
  email?: string;
  balance: number;
  created_at?: string;
}

export interface Listing {
  id: string; // uuid
  name: string;
  category: string;
  type: 'social' | 'number';
  platform: string;
  region?: string;
  details: string;
  price: number;
  status: 'available' | 'sold';
  credentials?: string; // encrypted
  created_at?: string;
}

export interface Order {
  id: string; // uuid
  user_id: string;
  listing_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'disputed';
  created_at: string;
  // Joined data for display
  listings?: {
    name: string;
  };
  productName: string; // Keep for compatibility until UI fully migrated
  credentials?: string;
}

export interface DepositRequest {
  id: string; // uuid
  user_id: string;
  amount: number;
  payment_proof: string; // URL
  status: DepositStatus;
  created_at: string;
  // Joined data for display
  users?: {
    username: string;
  };
  username: string; // for admin display
  proof: string; // Keep for compatibility
}

export interface SiteSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  paymentInstructions: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  created_at: string;
}