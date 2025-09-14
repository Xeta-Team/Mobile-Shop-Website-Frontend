import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Lock, Mail, User, Loader, Info, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import SocialButton from '../Components/Buttons/SocialButton';
import InputField from '../Components/Input/InputField.jsx';
import Toast from '../Components/Toast/Toast.jsx';
import { useNavigate } from 'react-router';

///// ***** Need to varify the email user provide when normal registration *****

// SVG Icon for Google
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.218,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function RegistrationPage() {
    // FIX: Updated state to match the database model
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
        if (id === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        setPasswordStrength(score);
    };

    // FIX: Updated validation for the new fields
    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required.";
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid.";
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
    
    const handleGoogleLogin = () => {
    // It must match the one in my Auth-Router.js file.
    const redirectUri = 'http://localhost:3001/api/auth/google/callback'; //

    // This is your Google Client ID. We will set this up in the next step.
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // These are the permissions you request from the user.
    const scope = 'profile email';

    // This constructs the URL that sends the user to Google for authentication.
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    
    // This command actually sends the user to the Google login page.
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
            // The payload now includes all the necessary fields that match the backend model
            const { confirmPassword, ...payload } = formData;
            const apiUrl = 'http://localhost:3001/api/users/register'; 
            const response = await axios.post(apiUrl, payload);
            showToast(response.data.message || 'Registration successful!', 'success');
            setFormData({ username: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
            setPasswordStrength(0);
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
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
                            icon={<User />}
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
                                icon={<User />}
                                style={{ animationDelay: '0.15s' }}
                            />
                            <InputField
                                id="lastName"
                                label="Last Name"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                error={errors.lastName}
                                icon={<User />}
                                style={{ animationDelay: '0.2s' }}
                            />
                        </div>
                        <InputField
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            icon={<Mail />}
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
                                icon={<Lock />}
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
                            icon={<Lock />}
                            style={{ animationDelay: '0.5s' }}
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
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

                    <div className="animate-input-fade-in" style={{ animationDelay: '0.8s' }}>
                        <SocialButton provider="Google" onClick={handleGoogleLogin} icon={<GoogleIcon />}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PasswordStrengthMeter({ strength }) {
    const strengthLevels = [
        { label: 'Weak', color: 'bg-red-500' }, { label: 'Weak', color: 'bg-red-500' },
        { label: 'Fair', color: 'bg-orange-500' }, { label: 'Good', color: 'bg-yellow-500' },
        { label: 'Strong', color: 'bg-green-500' }, { label: 'Very Strong', color: 'bg-green-500' },
    ];
    return (
        <div className="mt-2 flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${strength > 0 ? strengthLevels[strength].color : ''}`}
                    style={{ width: `${(strength / 5) * 100}%` }}
                />
            </div>
            <span className="text-xs font-semibold text-gray-600 w-24 text-right">
                {strength > 0 ? strengthLevels[strength].label : ''}
            </span>
        </div>
    );
}

