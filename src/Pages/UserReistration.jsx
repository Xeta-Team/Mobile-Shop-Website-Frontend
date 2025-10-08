import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { UserPlus, Lock, Mail, User, Loader } from 'lucide-react';
import { useNavigate, Link } from 'react-router'; // Added Link for navigation

// --- Inlined Components ---

// A basic InputField component.
const InputField = ({ id, label, type, value, onChange, error, icon, style, placeholder }) => (
    <div className="relative animate-input-fade-in" style={style}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                {icon}
            </span>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

// A basic Toast component.
const Toast = ({ notification }) => {
    if (!notification.show) return null;

    const baseStyle = "fixed top-5 right-5 w-full max-w-sm p-4 rounded-lg shadow-lg text-white flex items-center z-50 transition-transform duration-300 transform";
    const typeStyles = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500"
    };

    return (
        <div className={`${baseStyle} ${typeStyles[notification.type] || typeStyles.info} ${notification.show ? 'translate-x-0' : 'translate-x-full'}`}>
            <p className="flex-grow">{notification.message}</p>
        </div>
    );
};

// PasswordStrengthMeter component definition
const PasswordStrengthMeter = ({ strength }) => {
    // strength is expected to be a number from 0 to 5
    const getWidth = () => `${(strength / 5) * 100}%`;
    
    let color = 'bg-gray-200';
    let label = '';

    if (strength === 1) {
        color = 'bg-red-500';
        label = 'Very Weak';
    } else if (strength === 2) {
        color = 'bg-orange-500';
        label = 'Weak';
    } else if (strength === 3) {
        color = 'bg-yellow-500';
        label = 'Moderate';
    } else if (strength === 4) {
        color = 'bg-blue-500';
        label = 'Strong';
    } else if (strength === 5) {
        color = 'bg-green-500';
        label = 'Very Strong';
    }

    return (
        <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-300 ${color}`} 
                    style={{ width: getWidth() }}
                ></div>
            </div>
            {strength > 0 && (
                <p className={`text-xs mt-1 font-medium ${color.replace('bg', 'text')}`}>
                    Strength: {label}
                </p>
            )}
        </div>
    );
};


// --- Main Registration Page Component ---

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();
    const googleButtonRef = useRef(null);
    
    
    const GOOGLE_CLIENT_ID = "517039507690-8v2ehel95r5gosvnen8u9mfq66knklni.apps.googleusercontent.com";
    const IS_CLIENT_ID_VALID = GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID";
    const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'info' });
        }, 3000);
    };

    // Google Sign-In SDK Initialization
    useEffect(() => {
        if (!IS_CLIENT_ID_VALID) return;

        // Function to handle the successful credential response
        const handleCredentialResponse = async (response) => {
            if (response.credential) {
                await handleGoogleSuccess(response.credential);
            }
        };

        // Load the Google Platform Library
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = () => {
            if (window.google) {
                // Initialize the Google Identity Service
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                });

                // Render the Google Sign-in button
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { 
                        theme: "outline", 
                        size: "large", 
                        type: "standard", 
                        text: "signup_with" 
                    }
                );
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const handleGoogleSuccess = async (googleToken) => {
        setIsSubmitting(true);
        try {
            const apiUrl = 'http://localhost:3001/api/users/google-login';
            
            // NOTE: In a real application, you would send the token to your backend for verification and authentication.
            const response = await axios.post(apiUrl, { googleToken });
            
            const { token } = response.data;
            if (token) {
                // IMPORTANT: Use Firestore for persistence instead of localStorage in a real Canvas app environment.
                localStorage.setItem('token', token); 
                showToast(response.data.message || 'Login successful!', 'success');
                navigate('/'); 
            } else {
                 showToast('Login successful, but no token received.', 'error');
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Google login failed. Please try again.";
            showToast(errorMessage, 'error');
            console.error("Google Login Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const checkPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        setPasswordStrength(score);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        
        // Update form data state
        setFormData(prev => ({ ...prev, [id]: value }));

        let newErrors = { ...errors };

        // 1. Clear error immediately for any field the user is typing in, unless it's the email field (which needs re-validation)
        if (id !== 'email' && newErrors[id]) {
            newErrors[id] = null;
        }

        // 2. Real-time Email Validation (Updated for @gmail.com)
        if (id === 'email') {
            if (!value.trim()) {
                newErrors.email = "Email is required.";
            } else if (!GMAIL_REGEX.test(value)) {
                newErrors.email = "Email address must be a valid @gmail.com account.";
            } else {
                
                newErrors.email = null;
            }
        }
        
   
        if (id === 'password') {
            checkPasswordStrength(value);
             if (value.length < 8 && value.length > 0) {
                 newErrors.password = "Password must be at least 8 characters.";
            } else if (value.length === 0) {
                newErrors.password = "Password is required.";
            } else {
                newErrors.password = null;
            }
        }

        const currentPassword = (id === 'password') ? value : formData.password;
        const currentConfirmPassword = (id === 'confirmPassword') ? value : formData.confirmPassword;
        
        if (id === 'password' || id === 'confirmPassword') {
            if (currentPassword !== currentConfirmPassword && (currentPassword.length > 0 || currentConfirmPassword.length > 0)) {
                newErrors.confirmPassword = "Passwords do not match.";
            } else if (newErrors.confirmPassword && currentPassword === currentConfirmPassword) {
                newErrors.confirmPassword = null;
            }
        }
        
        if (id === 'username' && !value.trim()) newErrors.username = "Username is required.";
        if (id === 'firstName' && !value.trim()) newErrors.firstName = "First name is required.";
        if (id === 'lastName' && !value.trim()) newErrors.lastName = "Last name is required.";
        
        setErrors(newErrors);
    };

    // This checks if any form field is empty or has an associated error message
    const isFormInvalid = useMemo(() => {
        const requiredFields = ['username', 'firstName', 'lastName', 'email', 'password', 'confirmPassword'];
        
        // Check if any required field is empty
        const isAnyFieldEmpty = requiredFields.some(field => !formData[field].trim());

        // Check if there are any errors (where error value is not null)
        const hasActiveErrors = Object.values(errors).some(error => error !== null);

        // Additionally, explicitly check email format and password match if fields are non-empty but errors haven't been triggered yet
        const isEmailInvalid = formData.email.trim() && !GMAIL_REGEX.test(formData.email);
        const isPasswordMismatch = formData.password.length > 0 && formData.password !== formData.confirmPassword;
        const isPasswordTooShort = formData.password.length > 0 && formData.password.length < 8;

        return isAnyFieldEmpty || hasActiveErrors || isEmailInvalid || isPasswordMismatch || isPasswordTooShort;
    }, [formData, errors]);

    const validateForm = () => {
        // This function is for final submission validation (redundant with isFormInvalid, but good practice)
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required.";
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
        
        // Ensure final check still includes email validation (Updated for @gmail.com)
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!GMAIL_REGEX.test(formData.email)) {
            newErrors.email = "Email address must be a valid @gmail.com account.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Use the final validation check before submission
        if (!validateForm()) {
            showToast('Please correct the errors in the form.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const { confirmPassword, ...payload } = formData;
            const apiUrl = 'http://localhost:3001/api/users/register'; 
            
            // NOTE: To prevent registration with fake but valid-looking emails (like 123@gmail.com), 
            // the backend must send an email verification link upon successful registration. 
            // The account remains inactive until the link is clicked.
            const response = await axios.post(apiUrl, payload);
            
            // Success message changed to reflect the required verification step
            showToast('Registration successful! Please check your email to verify your account.', 'success');
            
            setFormData({ username: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
            setPasswordStrength(0);
            
            // Navigate to login page, but the user won't be able to log in until verified by the server.
            navigate('/login'); 

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            showToast(errorMessage, 'error');
            console.error("Registration Error:", error);
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
                        <UserPlus className="mx-auto w-12 h-12 text-black" />
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">Create Your Account</h1>
                        <p className="text-gray-500 mt-2">Join us to start your journey.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            id="username"
                            label="Username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            error={errors.username}
                            icon={<User size={20}/>}
                            style={{ animationDelay: '0.1s' }}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                id="firstName"
                                label="First Name"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                error={errors.firstName}
                                icon={<User size={20}/>}
                                style={{ animationDelay: '0.15s' }}
                            />
                            <InputField
                                id="lastName"
                                label="Last Name"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                error={errors.lastName}
                                icon={<User size={20}/>}
                                style={{ animationDelay: '0.2s' }}
                            />
                        </div>
                        <InputField
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="you@gmail.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            icon={<Mail size={20}/>}
                            style={{ animationDelay: '0.3s' }}
                        />
                        <div className="animate-input-fade-in" style={{ animationDelay: '0.4s' }}>
                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                error={errors.password}
                                icon={<Lock size={20}/>}
                            />
                            <PasswordStrengthMeter strength={passwordStrength} />
                        </div>
                         <InputField
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={errors.confirmPassword}
                            icon={<Lock size={20}/>}
                            style={{ animationDelay: '0.5s' }   }
                        />

                        <button
                            type="submit"
                            // Button is disabled if submitting, or if the form is generally invalid
                            disabled={isSubmitting || isFormInvalid}
                            className="w-full px-6 py-3.5 rounded-lg text-sm font-semibold bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black animate-input-fade-in"
                            style={{ animationDelay: '0.6s' }}
                        >
                            {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                            <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                        </button>
                    </form>
                    
                    <div className="relative my-6 animate-input-fade-in" style={{ animationDelay: '0.7s' }}>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300" /></div>
                        <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
                    </div>

                    <div className="animate-input-fade-in flex justify-center" style={{ animationDelay: '0.8s' }}>
                        {IS_CLIENT_ID_VALID ? (
                            <div ref={googleButtonRef} className="w-full flex justify-center">
                                {/* Google Sign-in button will be rendered here by the SDK */}
                            </div>
                        ) : (
                            <div className="text-red-500 text-center text-sm p-4 border border-red-300 rounded-lg w-full">
                                Please replace **"YOUR_GOOGLE_CLIENT_ID"** with your actual Google Client ID in the code to enable Google Login.
                            </div>
                        )}
                    </div>
                    
                    {/* NEW: Privacy Policy Disclaimer */}
                    <p className="text-center text-xs text-gray-500 mt-6 animate-input-fade-in" style={{ animationDelay: '0.9s' }}>
                        Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our&nbsp;
                        <Link to="/privacy-policy" className="font-semibold text-black hover:text-gray-700 transition-colors duration-200 underline">
                            privacy policy
                        </Link>
                        .
                    </p>

                    {/* NEW: Log in Link */}
                    <p className="text-center text-sm text-gray-600 mt-4 animate-input-fade-in" style={{ animationDelay: '1.0s' }}>
                        Already have an account?&nbsp;
                        <Link to="/login" className="font-bold text-black hover:text-gray-700 transition-colors duration-200">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
