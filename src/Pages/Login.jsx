import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { LogIn, Mail, Lock, Loader, Info, Check, AlertTriangle } from 'lucide-react';
import InputField from '../Components/Input/InputField.jsx'; // Assuming this path is correct
import { GoogleLogin } from "@react-oauth/google";
import Toast from '../Components/Toast/Toast.jsx'; // Assuming you have a Toast component

// Reusing the Google Icon from your registration page
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.218,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const navigate = useNavigate(); // Hook for navigation

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid.";
        }
        if (!formData.password) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            showToast('Please check your input.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const apiUrl = 'http://localhost:3001/api/users/login';
            const response = await axios.post(apiUrl, formData);

            // Store token and user data in local storage
            localStorage.setItem('token', response.data.token);
            
            showToast('Login successful! Redirecting...', 'success');

            // Redirect based on user role
            setTimeout(() => {
                if (response.data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }, 1000); // Delay for toast visibility

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const credential = credentialResponse.credential;

            const apiUrl = 'http://localhost:3001/api/users/google-login';
            const response = await axios.post(apiUrl, { googleToken: credential });

            // Store token and user
            localStorage.setItem('token', response.data.token);

            showToast('Google login successful!', 'success');

            setTimeout(() => {
                if (response.data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }, 1000);
        } catch (error) {
            showToast("Google login failed. Please try again.", "error");
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
            <Toast notification={toast} />
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 animate-slide-up-fade-in">
                    <div className="text-center mb-8">
                        <LogIn className="mx-auto w-12 h-12 text-black" />
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">Welcome Back!</h1>
                        <p className="text-gray-500 mt-2">Sign in to continue to your account.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            icon={<Mail />}
                            style={{ animationDelay: '0.1s' }}
                        />
                        <InputField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                            icon={<Lock />}
                            style={{ animationDelay: '0.2s' }}
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3.5 rounded-lg text-sm font-semibold bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black animate-input-fade-in"
                            style={{ animationDelay: '0.3s' }}
                        >
                            {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                        </button>
                    </form>
                    
                    <div className="relative my-6 animate-input-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300" /></div>
                        <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
                    </div>

                    <div className="animate-input-fade-in" style={{ animationDelay: '0.5s' }}>
                        <GoogleLogin
                            logo_alignment="center" 
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => {
                                showToast("Google login failed", "error");
                            }}
                        />
                    </div>

                     <p className="text-center text-sm text-gray-600 mt-8 animate-input-fade-in" style={{ animationDelay: '0.6s' }}>
                        Don't have an account?{' '}
                        <a href="/register" className="font-semibold text-black hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
