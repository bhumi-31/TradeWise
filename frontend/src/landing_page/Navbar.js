// frontend/src/landing_page/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, user } = useAuth(); // ✅ user bhi lo

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
                        {/* ✅ Agar logged in nahi to Signup button */}
                        {!isAuthenticated ? (
                            <li className="nav-item">
                                <Link className="nav-link active" to="/signup">
                                    Signup
                                </Link>
                            </li>
                        ) : (
                            // ✅ Agar logged in hai to Dashboard button
                            <li className="nav-item">
                                <a 
                                    className="nav-link active" 
                                    href="http://localhost:3001"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontWeight: '600' }}
                                >
                                    Dashboard
                                </a>
                            </li>
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