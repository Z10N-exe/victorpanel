import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DepositPage from './pages/DepositPage';
import FAQPage from './pages/FAQPage';
import SupportPage from './pages/SupportPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAppContext();
  return isAdmin ? <>{children}</> : <Navigate to="/admin-login" replace />;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


const NotificationToastContainer = () => {
    const { notifications } = useAppContext();
    if (!notifications.length) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {notifications.map(notification => (
                <NotificationToast key={notification.id} message={notification.message} type={notification.type} />
            ))}
        </div>
    );
};

const NotificationToast: React.FC<{ message: string; type: 'success' | 'error' | 'info' }> = ({ message, type }) => {
    const baseClasses = 'px-4 py-3 rounded-md shadow-lg text-white font-semibold animate-fade-in-out';
    const typeClasses = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    };
    return <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>;
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-black text-white font-sans flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />

              <Route path="/faq" element={<FAQPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route 
                path="/admin" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <NotificationToastContainer />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;