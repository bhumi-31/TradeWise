// frontend/src/landing_page/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('👋 Logging out from frontend...');
        
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        
        // Update auth context
        logout();
        
        console.log('✅ Logged out successfully');
        
        // Redirect to home
        navigate('/');
        
        // Show confirmation
        setTimeout(() => {
            alert('Logged out successfully!');
        }, 100);
    };

    return (
        <nav className="navbar navbar-expand-lg border-bottom">
            <div className="container p-2">
                <Link className="navbar-brand" to="/">
                    <img src="media/images/logo.jpeg" style={{ width: "20%" }} alt="Logo" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-lg-0 ms-auto">
                        {/* ✅ Show different options based on login status */}
                        {!isAuthenticated ? (
                            // ❌ Not logged in - Show Signup button
                            <li className="nav-item">
                                <Link className="nav-link active" to="/signup">
                                    Signup
                                </Link>
                            </li>
                        ) : (
                            // ✅ Logged in - Show Dashboard and Logout
                            <>
                                <li className="nav-item">
                                    <a 
                                        className="nav-link active" 
                                        href={`http://localhost:3001?token=${localStorage.getItem('token')}&username=${localStorage.getItem('username')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontWeight: '600' }}
                                    >
                                        Dashboard
                                    </a>
                                </li>
                                
                                {/* ✅ NEW: Logout Button */}
                                <li className="nav-item">
                                    <button 
                                        className="nav-link active btn btn-link"
                                        onClick={handleLogout}
                                        style={{ 
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            border: 'none',
                                            background: 'none',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                        
                        <li className="nav-item">
                            <Link className="nav-link active" to="/about">
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/product">
                                Product
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/pricing">
                                Pricing
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/support">
                                Support
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;