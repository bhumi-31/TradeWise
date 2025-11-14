// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/auth/me');
            setUser(response.data.user);
            
            // ✅ User data localStorage mein save karo
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('username', response.data.user.username);
            
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await axios.post('http://localhost:3002/api/auth/register', {
                username,
                email,
                password
            });

            if (response.data.success) {
                const newToken = response.data.token;
                localStorage.setItem('token', newToken);
                
                // ✅ User data save karo
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('username', response.data.user.username);
                
                setToken(newToken);
                setUser(response.data.user);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3002/api/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                const newToken = response.data.token;
                localStorage.setItem('token', newToken);
                
                // ✅ User data save karo
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('username', response.data.user.username);
                
                setToken(newToken);
                setUser(response.data.user);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};