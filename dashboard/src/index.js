// dashboard/src/index.js
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";  // ✅ Dashboard component

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('🚀 Dashboard initializing...');
    console.log('📍 Current URL:', window.location.href);
    
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const usernameFromUrl = urlParams.get('username');

    console.log('🔍 URL Parameters:');
    console.log('  - Token:', tokenFromUrl ? 'Present ✅' : 'Missing ❌');
    console.log('  - Username:', usernameFromUrl || 'Missing ❌');

    // Check localStorage
    let tokenInStorage = localStorage.getItem('token');
    let usernameInStorage = localStorage.getItem('username');

    console.log('💾 LocalStorage:');
    console.log('  - Token:', tokenInStorage ? 'Present ✅' : 'Missing ❌');
    console.log('  - Username:', usernameInStorage || 'Missing ❌');

    // If token in URL, save to localStorage
    if (tokenFromUrl && usernameFromUrl) {
      console.log('💾 Saving credentials from URL to localStorage...');
      
      localStorage.setItem('token', tokenFromUrl);
      localStorage.setItem('username', usernameFromUrl);
      
      console.log('✅ Token saved!');
      console.log('   First 50 chars:', tokenFromUrl.substring(0, 50) + '...');
      
      // Clean URL (remove token from address bar)
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      console.log('✅ URL cleaned');
      
      // Update variables
      tokenInStorage = tokenFromUrl;
      usernameInStorage = usernameFromUrl;
    }

    // Final check
    if (!tokenInStorage || !usernameInStorage) {
      console.error('❌ No authentication found!');
      console.log('Please login from: http://localhost:3000/login');
    } else {
      console.log('✅ Authentication ready!');
      console.log('   Username:', usernameInStorage);
    }

    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>Loading dashboard...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);