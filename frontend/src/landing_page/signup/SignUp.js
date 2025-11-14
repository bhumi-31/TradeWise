// frontend/src/landing_page/signup/SignUp.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        // Call register function from AuthContext
        const result = await register(formData.username, formData.email, formData.password);

        if (result.success) {
            // ✅ Token aur username save karo
            const token = localStorage.getItem('token');
            
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                localStorage.setItem('username', userData.username);
                console.log('✅ Username saved:', userData.username);
            }
            
            console.log('✅ Registration successful');
            console.log('🔑 Token saved');
            
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
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4 fw-bold">Create Your Trading Account</h2>
                            <p className="text-center text-muted mb-4">
                                Join thousands of traders and start your investment journey
                            </p>

                            {/* ✅ Success Message */}
                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="fa fa-check-circle me-2"></i>
                                    <strong>Account created successfully!</strong> You can now access the Dashboard from the navbar.
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setSuccess(false)}
                                    ></button>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="fa fa-exclamation-circle me-2"></i>
                                    {error}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setError('')}
                                    ></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="username" className="form-label fw-semibold">
                                        <i className="fa fa-user me-2"></i>Username
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Choose a unique username"
                                        required
                                        disabled={success}
                                    />
                                    <small className="text-muted">This will be your display name</small>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        <i className="fa fa-envelope me-2"></i>Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                        disabled={success}
                                    />
                                    <small className="text-muted">We'll never share your email</small>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        <i className="fa fa-lock me-2"></i>Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        required
                                        disabled={success}
                                    />
                                    <small className="text-muted">Minimum 6 characters</small>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                        <i className="fa fa-lock me-2"></i>Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        required
                                        disabled={success}
                                    />
                                </div>

                                <div className="mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="terms"
                                            required
                                            disabled={success}
                                        />
                                        <label className="form-check-label" htmlFor="terms">
                                            I agree to the <a href="/terms" className="text-primary">Terms & Conditions</a> and <a href="/privacy" className="text-primary">Privacy Policy</a>
                                        </label>
                                    </div>
                                </div>

                                {!success && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 mb-3"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating Your Account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-rocket me-2"></i>
                                                Create Account
                                            </>
                                        )}
                                    </button>
                                )}

                                {success && (
                                    <div className="text-center p-3 bg-light rounded">
                                        <i className="fa fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                                        <p className="mt-3 mb-0">Redirecting to homepage...</p>
                                    </div>
                                )}

                                <div className="text-center my-3">
                                    <span className="text-muted">OR</span>
                                </div>

                                <div className="d-grid gap-2 mb-3">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        disabled
                                    >
                                        <i className="fa fa-google me-2"></i>
                                        Continue with Google (Coming Soon)
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-4 pt-3 border-top">
                                <p className="text-muted mb-0">
                                    Already have an account?{' '}
                                    <a href="/login" className="text-primary fw-semibold text-decoration-none">
                                        Login here <i className="fa fa-arrow-right"></i>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-4 text-center mb-3">
                            <i className="fa fa-shield-alt fa-2x text-primary mb-2"></i>
                            <h6>Secure Trading</h6>
                            <small className="text-muted">Bank-level security</small>
                        </div>
                        <div className="col-md-4 text-center mb-3">
                            <i className="fa fa-chart-line fa-2x text-success mb-2"></i>
                            <h6>Real-time Data</h6>
                            <small className="text-muted">Live market updates</small>
                        </div>
                        <div className="col-md-4 text-center mb-3">
                            <i className="fa fa-headset fa-2x text-info mb-2"></i>
                            <h6>24/7 Support</h6>
                            <small className="text-muted">Always here to help</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;