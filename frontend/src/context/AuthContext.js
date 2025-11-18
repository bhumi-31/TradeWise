// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        checkAuth();
        
        // ✅ Listen for storage changes (when dashboard clears token)
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === null) {
                console.log('🔄 Storage changed - rechecking auth');
                checkAuth();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        // ✅ Also check periodically (for same-tab changes)
        const interval = setInterval(() => {
            const currentToken = localStorage.getItem('token');
            if (!currentToken && isAuthenticated) {
                console.log('⚠️ Token removed - updating auth state');
                setUser(null);
                setIsAuthenticated(false);
            }
        }, 1000);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [isAuthenticated]);

    const checkAuth = () => {
        try {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            console.log('🔍 Checking auth...');
            console.log('Token exists:', !!token);
            console.log('User exists:', !!savedUser);

            if (token && savedUser) {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setIsAuthenticated(true);
                console.log('✅ User authenticated:', userData.username);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                console.log('⚠️ No authentication found');
            }
        } catch (error) {
            console.error('❌ Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        try {
            console.log('📝 Registering user:', username);
            
            const response = await axios.post('http://localhost:3002/api/auth/register', {
                username,
                email,
                password
            });

            console.log('✅ Registration response:', response.data);

            if (response.data.success && response.data.token) {
                const { token, user } = response.data;

                // Save to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('username', user.username);

                console.log('✅ Token saved:', token.substring(0, 30) + '...');
                console.log('✅ User saved:', user.username);

                // Update state
                setUser(user);
                setIsAuthenticated(true);

                return {
                    success: true,
                    message: 'Registration successful'
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Registration failed'
                };
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Logging in user:', email);

            const response = await axios.post('http://localhost:3002/api/auth/login', {
                email,
                password
            });

            console.log('✅ Login response:', response.data);

            if (response.data.success && response.data.token) {
                const { token, user } = response.data;

                // Save to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('username', user.username);

                console.log('✅ Token saved:', token.substring(0, 30) + '...');
                console.log('✅ User saved:', user.username);

                // Update state
                setUser(user);
                setIsAuthenticated(true);

                return {
                    success: true,
                    message: 'Login successful'
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Login failed'
                };
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        console.log('👋 Logging out...');
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        
        setUser(null);
        setIsAuthenticated(false);
        
        console.log('✅ Logout complete');
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        checkAuth  // ✅ Export checkAuth function
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};