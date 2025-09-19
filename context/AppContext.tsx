import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { User, Listing, Order, DepositRequest, SiteSettings, DepositStatus } from '../types';
import { MOCK_SITE_SETTINGS } from '../data/mockData';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  users: User[];
  listings: Listing[];
  listingsLoading: boolean;
  listingsError: string | null;
  orders: Order[]; // User-specific orders
  allOrders: Order[]; // All orders for admin
  depositRequests: DepositRequest[];
  siteSettings: SiteSettings;
  notifications: Notification[];

  login: (email: string, password: string) => Promise<boolean>;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  purchaseListing: (listingId: string) => Promise<boolean>;
  submitDeposit: (amount: number, proofFile: File) => Promise<void>;
  updateUserBalance: (userId: string, newBalance: number) => Promise<void>;
  processDeposit: (requestId: string, newStatus: DepositStatus.APPROVED | DepositStatus.REJECTED) => Promise<void>;
  addListing: (listing: Omit<Listing, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateListing: (listing: Listing) => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
  updateSiteSettings: (newSettings: SiteSettings) => Promise<void>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [users, setUsers] = useState<User[]>([]); // For admin
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState<boolean>(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]); // For Admin
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(MOCK_SITE_SETTINGS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newNotification: Notification = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  useEffect(() => {
    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) fetchUserProfile(session.user.id);
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) setCurrentUser(data);
    else if (error) console.error('Error fetching user profile:', error.message);
  };
  
  useEffect(() => {
    const fetchListings = async () => {
        setListingsLoading(true);
        const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
        if (data) setListings(data);
        if (error) setListingsError(error.message);
        setListingsLoading(false);
    };
    fetchListings();

    const listingSub = supabase.channel('public:listings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, fetchListings)
      .subscribe();
      
    return () => { supabase.removeChannel(listingSub).catch(() => {}); };
  }, []);
  
  useEffect(() => {
    if (!currentUser) {
        setOrders([]);
        // Keep admin deposit requests if admin is logged in but has no user profile
        if(!isAdmin) setDepositRequests([]);
        return;
    }
    const fetchUserData = async () => {
        const { data: orderData } = await supabase.from('orders').select('*, listings(name)').eq('user_id', currentUser.id);
        const { data: depositData } = await supabase.from('deposits').select('*').eq('user_id', currentUser.id);
        if (orderData) setOrders(orderData);
        if (depositData && !isAdmin) setDepositRequests(depositData);
    };
    fetchUserData();

    const channelSuffix = currentUser.id;
    const ordersSub = supabase.channel(`user-orders-${channelSuffix}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${currentUser.id}` }, fetchUserData)
        .subscribe();
    const depositsSub = supabase.channel(`user-deposits-${channelSuffix}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits', filter: `user_id=eq.${currentUser.id}` }, fetchUserData)
        .subscribe();
    const userSub = supabase.channel(`user-balance-${channelSuffix}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${currentUser.id}`}, (payload) => setCurrentUser(payload.new as User))
        .subscribe();
        
    return () => {
        supabase.removeChannel(ordersSub).catch(() => {});
        supabase.removeChannel(depositsSub).catch(() => {});
        supabase.removeChannel(userSub).catch(() => {});
    }
  }, [currentUser, isAdmin]);
  
  useEffect(() => {
    if (isAdmin) {
      const fetchAdminData = async () => {
        const { data: usersData } = await supabase.from('users').select('*');
        const { data: depositsData } = await supabase.from('deposits').select('*, users(username)');
        const { data: ordersData } = await supabase.from('orders').select('*, listings(name)');
        
        if (usersData) setUsers(usersData);
        
        if (depositsData) {
          const formattedDeposits = depositsData.map((d: any) => ({
            ...d,
            username: d.users?.username || 'Unknown User',
            proof: d.payment_proof,
          }));
          setDepositRequests(formattedDeposits);
        }
        
        if (ordersData) {
          const formattedOrders = ordersData.map((o: any) => ({
            ...o,
            productName: o.listings?.name || 'Unknown Listing',
          }));
          setAllOrders(formattedOrders);
        }
      };
      fetchAdminData();
      
      const adminDepositsSub = supabase.channel('admin-deposits')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits' }, fetchAdminData).subscribe();
      const adminUsersSub = supabase.channel('admin-users')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAdminData).subscribe();
      const adminOrdersSub = supabase.channel('admin-orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchAdminData).subscribe();

      return () => {
        supabase.removeChannel(adminDepositsSub).catch(() => {});
        supabase.removeChannel(adminUsersSub).catch(() => {});
        supabase.removeChannel(adminOrdersSub).catch(() => {});
      }
    } else {
        setUsers([]);
        setAllOrders([]);
    }
  }, [isAdmin]);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      // Assuming a single row with id=1 for settings
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) {
        setSiteSettings(data);
      } else {
        console.warn('Could not fetch site settings, using default mock data.', error?.message);
      }
    };
    fetchSiteSettings();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error('Login error:', error.message);
        showNotification(error.message, 'error');
        return false;
    }
    showNotification('Logged in successfully!', 'success');
    return true;
  }

  const signUp = async (username: string, email: string, password: string): Promise<boolean> => {
    // The manual insert into 'public.users' has been removed from here.
    // A database trigger ('handle_new_user') is already set up to automatically
    // create a user profile when a new user signs up in 'auth.users'.
    // Attempting to insert from the client-side caused the RLS violation error
    // and was redundant.
    
    // We pass the username in options.data, which the trigger can then access.
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username },
        },
    });

    if (error) {
        console.error('Signup error:', error.message);
        showNotification(error.message, 'error');
        return false;
    }
    
    // The previous manual profile insertion logic has been removed.
    // The trigger handles profile creation, so no further action is needed here.
    
    showNotification('Signup successful! Please check your email for a confirmation link.', 'success');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    if (email === '123@gmail.com' && password === 'Ratking345') {
        setIsAdmin(true);
        return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdmin(false);
  
  const purchaseListing = async (listingId: string) => {
    if (!currentUser) return false;
    try {
        const { error } = await supabase.functions.invoke('purchase', { body: { listing_id: listingId } });
        if (error) throw new Error(error.message);
        showNotification('Purchase successful!', 'success');
        return true;
    } catch (e: any) {
        showNotification(`Purchase failed: ${e.message}`, 'error');
        return false;
    }
  };

  const submitDeposit = async (amount: number, proofFile: File) => {
    if (!currentUser) return;
    try {
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(fileName, proofFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('payment-proofs').getPublicUrl(fileName);
        const { error: insertError } = await supabase.from('deposits').insert({ user_id: currentUser.id, amount, payment_proof: data.publicUrl, status: DepositStatus.PENDING });
        if (insertError) throw insertError;
        showNotification('Deposit request submitted successfully.', 'success');
    } catch (e: any) { showNotification(`Deposit failed: ${e.message}`, 'error'); }
  };

  const updateUserBalance = async (userId: string, newBalance: number) => {
      const { error } = await supabase.from('users').update({ balance: newBalance }).eq('id', userId);
      if (error) {
        showNotification(`Failed to update balance: ${error.message}`, 'error');
      } else {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: newBalance } : null);
        }
        showNotification(`Balance updated for user.`, 'success');
      }
  };

  const processDeposit = async (requestId: string, newStatus: DepositStatus.APPROVED | DepositStatus.REJECTED) => {
    const { error } = await supabase.functions.invoke('process-deposit', { body: { request_id: requestId, status: newStatus } });
    if (error) showNotification(`Failed to process deposit: ${error.message}`, 'error');
    else showNotification(`Deposit request has been ${newStatus}.`, 'success');
  };

  const addListing = async (listingData: Omit<Listing, 'id' | 'created_at' | 'status'>) => {
    const { data, error } = await supabase.from('listings').insert({ ...listingData, status: 'available' }).select().single();
    if (error) {
      showNotification(`Failed to add listing: ${error.message}`, 'error');
    } else if (data) {
      setListings(prev => [data, ...prev]);
      showNotification('Listing added successfully.', 'success');
    }
  };

  const updateListing = async (updatedListing: Listing) => {
    const { error } = await supabase.from('listings').update(updatedListing).eq('id', updatedListing.id);
    if (error) {
      showNotification(`Failed to update listing: ${error.message}`, 'error');
    } else {
      setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
      showNotification('Listing updated successfully.', 'success');
    }
  };

  const deleteListing = async (listingId: string) => {
    const { error } = await supabase.from('listings').delete().eq('id', listingId);
    if (error) {
      showNotification(`Failed to delete listing: ${error.message}`, 'error');
    } else {
      setListings(prev => prev.filter(l => l.id !== listingId));
      showNotification('Listing deleted successfully.', 'success');
    }
  };
  
  const updateSiteSettings = async (newSettings: SiteSettings) => {
    const oldSettings = siteSettings;
    setSiteSettings(newSettings); // Optimistic UI update

    // Assuming a single row with id=1 for settings
    const { error } = await supabase.from('site_settings').update(newSettings).eq('id', 1);

    if (error) {
      showNotification(`Failed to update settings: ${error.message}`, 'error');
      setSiteSettings(oldSettings); // Revert on failure
    } else {
      showNotification('Site settings updated successfully!', 'success');
    }
  };

  const value = {
    isAuthenticated: !!session,
    isAdmin,
    currentUser, users, listings, listingsLoading, listingsError, orders, allOrders, depositRequests, siteSettings, notifications,
    login, signUp, logout, loginAdmin, logoutAdmin, purchaseListing, submitDeposit, updateUserBalance, processDeposit, addListing, updateListing, deleteListing, updateSiteSettings, showNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};