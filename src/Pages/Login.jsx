import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, Lock, Mail, Loader, Info, Check, AlertTriangle, Eye, EyeOff, User } from 'lucide-react';

// Re-using the GoogleIcon from your registration page for consistency
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.218,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

// Self-contained InputField component
function InputField({ id, label, type = 'text', value, onChange, error, icon, placeholder, style }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === 'password';

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    return (
        <div className="animate-input-fade-in" style={style}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    {React.cloneElement(icon, { className: 'w-5 h-5' })}
                </span>
                <input
                    id={id}
                    name={id}
                    type={isPassword ? (isPasswordVisible ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`block w-full pl-10 pr-10 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                />
                {isPassword && (
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                        {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}

// Self-contained SocialButton component
function SocialButton({ provider, onClick, icon }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300"
        >
            {icon}
            <span>Sign in with {provider}</span>
        </button>
    );
}


export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'info' });
        }, 3000);
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
        if (!formData.password) {
            newErrors.password = "Password is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Implemented Google Login logic
    const handleGoogleLogin = () => {
        // This must match the callback route on your backend
        const redirectUri = 'http://localhost:3001/api/auth/google/callback'; 

        // Your Google Client ID from environment variables
        // FIX: Changed from import.meta.env to process.env to resolve build warning
        const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;

        // The permissions you request from the user
        const scope = 'profile email';

        // Construct the URL to redirect the user to Google for authentication
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

        // Redirect the user to the Google login page
        window.location.href = authUrl;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            showToast('Please correct the errors in the form.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // This URL must match the login route in your User-Router.js
            const apiUrl = 'http://localhost:3001/api/users/login'; 
            const response = await axios.post(apiUrl, formData);
            
            // On successful login, you get a token and user data.
            // You should save the token (e.g., in localStorage) and redirect the user.
            localStorage.setItem('authToken', response.data.token);
            
            showToast('Login successful! Redirecting...', 'success');
            
            // Here you would typically redirect the user to a dashboard
            // For now, we'll just clear the form.
            // window.location.href = '/dashboard';
            
            setFormData({ email: '', password: '' });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
            <Toast notification={toast} />
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 animate-slide-up-fade-in">
                    <div className="text-center mb-8">
                        <LogIn className="mx-auto w-12 h-12 text-black" />
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">Sign In</h1>
                        <p className="text-gray-500 mt-2">Welcome back! Please sign in to continue.</p>
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

                        <div className="flex items-center justify-between animate-input-fade-in" style={{ animationDelay: '0.3s' }}>
                            <a href="#" className="text-sm font-medium text-black hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3.5 rounded-lg text-sm font-semibold bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black animate-input-fade-in"
                            style={{ animationDelay: '0.4s' }}
                        >
                            {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                        </button>
                    </form>
                    
                    <div className="relative my-6 animate-input-fade-in" style={{ animationDelay: '0.5s' }}>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300" /></div>
                        <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
                    </div>

                    <div className="animate-input-fade-in" style={{ animationDelay: '0.6s' }}>
                        <SocialButton provider="Google" onClick={handleGoogleLogin} icon={<GoogleIcon />}/>
                    </div>
                     <p className="mt-8 text-center text-sm text-gray-500 animate-input-fade-in" style={{ animationDelay: '0.7s' }}>
                        Don't have an account?{' '}
                        {/* This link should point to your registration page route */}
                        <a href="/register" className="font-semibold text-black hover:underline">
                           Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Re-using the Toast component from your registration page
function Toast({ notification }) {
    const { show, message, type } = notification;
    if (!show) return null;
    const toastStyles = {
        info: { bg: 'bg-blue-500', icon: <Info className="w-5 h-5" /> },
        success: { bg: 'bg-green-500', icon: <Check className="w-5 h-5" /> },
        error: { bg: 'bg-red-500', icon: <AlertTriangle className="w-5 h-5" /> },
    };
    const style = toastStyles[type] || toastStyles.info;
    return (
        <div className={`fixed top-5 right-5 ${style.bg} text-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-down z-50`}>
            {style.icon}
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

