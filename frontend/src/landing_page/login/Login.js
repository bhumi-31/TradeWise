// frontend/src/landing_page/login/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // ✅ Token aur username save karo
            const token = localStorage.getItem('token');
            
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                localStorage.setItem('username', userData.username);
                console.log('✅ Username saved:', userData.username);
            }
            
            console.log('✅ Login successful');
            console.log('🔑 Token:', token ? token.substring(0, 30) + '...' : 'NOT FOUND');
            
            // ✅ SUCCESS: Show success message
            setSuccess(true);
            
            // ✅ 2 seconds baad home page pe redirect
            setTimeout(() => {
                navigate('/');
            }, 2000);
            
            setIsLoading(false);
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="p-5 border rounded shadow-sm">
                        <h2 className="text-center mb-4">Login to Trading Dashboard</h2>

                        {/* ✅ Success Message */}
                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                <i className="fa fa-check-circle me-2"></i>
                                <strong>Login successful!</strong> You can now access the Dashboard from the navbar.
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setSuccess(false)}
                                ></button>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={success}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    disabled={success}
                                />
                            </div>

                            {!success && (
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logging in...' : 'Login to Dashboard'}
                                </button>
                            )}

                            {success && (
                                <div className="text-center p-3 bg-light rounded">
                                    <i className="fa fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-3 mb-0">Redirecting to homepage...</p>
                                </div>
                            )}
                        </form>

                        <div className="text-center mt-3">
                            <p className="text-muted">
                                Don't have an account?{' '}
                                <a href="/signup" className="text-primary">
                                    Sign up here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;