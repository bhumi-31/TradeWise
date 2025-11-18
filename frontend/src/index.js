// frontend/src/index.js
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './landing_page/home/HomePage';
import SignUp from './landing_page/signup/SignUp';
import AboutPage from './landing_page/about/AboutPage';
import ProductPage from './landing_page/products/ProductPage';
import PricingPage from './landing_page/pricing/PricingPage';
import SupportPage from './landing_page/support/SupportPage';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import NotFound from './landing_page/NotFound';
import Login from './landing_page/login/Login';

// ✅ Component to handle logout
const LogoutHandler = () => {
  const location = useLocation();
  const { logout, checkAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.get('logout') === 'true') {
      console.log('🚨 LOGOUT DETECTED FROM DASHBOARD');
      console.log('Current token before clear:', localStorage.getItem('token')?.substring(0, 30));
      
      // ✅ FORCE CLEAR - Remove all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      
      // Double check - completely clear storage
      localStorage.clear();
      
      console.log('✅ Token after clear:', localStorage.getItem('token'));
      console.log('✅ All localStorage cleared');
      
      // Update auth state
      if (logout) {
        logout();
      }
      
      // Clean URL immediately
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      console.log('✅ URL cleaned');
      console.log('🔄 Forcing page reload to update navbar...');
      
      // Force reload to update navbar
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [location, logout, checkAuth]);

  return null;
};

// ✅ Main App component
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LogoutHandler />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);