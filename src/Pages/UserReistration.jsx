import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Lock, Mail, User, Loader, Info, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';

// --- Supabase Client Setup (for social logins) ---
const supabase = window.supabase ? window.supabase.createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY) : null;

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
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [passwordStrength, setPasswordStrength] = useState(0);

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
        if (password.length > 8) score++;
        if (password.match(/[a-z]/)) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^A-Za-z0-9]/)) score++;
        setPasswordStrength(score);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
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

    const handleSocialLogin = async (provider) => {
        if (!supabase) {
            showToast("Authentication service is not available.", "error");
            return;
        }
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider.toLowerCase(),
            });

            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            showToast(`Failed to log in with ${provider}. Please try again.`, 'error');
            console.error(`Error with ${provider} login:`, error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            showToast('Please correct the errors in the form.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare the data payload, excluding the confirmPassword field
            const { confirmPassword, ...payload } = formData;
            
            // Your backend API endpoint for registration
            const apiUrl = 'http://localhost:3001/api/auth/register'; 

            // Send the registration data to your backend
            const response = await axios.post(apiUrl, payload);

            showToast(response.data.message || 'Registration successful!', 'success');
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
            setPasswordStrength(0);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <style>
                {`
                    @keyframes slide-up-fade-in {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slide-up-fade-in {
                        animation: slide-up-fade-in 0.6s ease-out forwards;
                    }

                    @keyframes input-fade-in {
                        from { opacity: 0; transform: translateX(-10px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    .animate-input-fade-in {
                        opacity: 0; /* Start hidden */
                        animation: input-fade-in 0.5s ease-out forwards;
                    }
                `}
            </style>
            <Toast notification={toast} />
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 animate-slide-up-fade-in">
                    <div className="text-center mb-8">
                        <UserPlus className="mx-auto w-12 h-12 text-black" />
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">Create Your Account</h1>
                        <p className="text-gray-500 mt-2">Join us to start shopping for the best mobile devices.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            id="fullName"
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            error={errors.fullName}
                            icon={<User />}
                            style={{ animationDelay: '0.1s' }}
                        />
                        <InputField
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            icon={<Mail />}
                            style={{ animationDelay: '0.2s' }}
                        />
                        <div className="animate-input-fade-in" style={{ animationDelay: '0.3s' }}>
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
                            style={{ animationDelay: '0.4s' }}
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3.5 rounded-lg text-sm font-semibold bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black animate-input-fade-in"
                            style={{ animationDelay: '0.5s' }}
                        >
                            {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                            <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                        </button>
                    </form>

                    <div className="relative my-6 animate-input-fade-in" style={{ animationDelay: '0.6s' }}>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-3 animate-input-fade-in" style={{ animationDelay: '0.7s' }}>
                        <SocialButton provider="Google" onClick={() => handleSocialLogin('Google')} icon={<GoogleIcon />}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialButton({ provider, icon, onClick }) {
    return (
      <button onClick={onClick} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-semibold border transition-all duration-300 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105">
        {icon}
        Continue with {provider}
      </button>
    );
}

function InputField({ id, label, error, icon, type, style, ...props }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="animate-input-fade-in" style={style}>
            <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
            <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    {React.cloneElement(icon, { className: 'w-5 h-5' })}
                </span>
                <input
                    id={id}
                    name={id}
                    type={isPassword ? (isPasswordVisible ? 'text' : 'password') : type}
                    {...props}
                    className={`w-full p-3 pl-10 pr-10 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                        {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

function PasswordStrengthMeter({ strength }) {
    const strengthLevels = [
        { label: 'Weak', color: 'bg-red-500' },
        { label: 'Weak', color: 'bg-red-500' },
        { label: 'Fair', color: 'bg-orange-500' },
        { label: 'Good', color: 'bg-yellow-500' },
        { label: 'Strong', color: 'bg-green-500' },
        { label: 'Very Strong', color: 'bg-green-500' },
    ];

    return (
        <div className="mt-2 flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
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

function Toast({ notification }) {
    const { show, message, type } = notification;
    if (!show) return null;

    const toastStyles = {
        info: { bg: 'bg-blue-500', icon: <Info /> },
        success: { bg: 'bg-green-500', icon: <Check /> },
        error: { bg: 'bg-red-500', icon: <AlertTriangle /> },
    };
    
    const style = toastStyles[type] || toastStyles.info;

    return (
        <div className={`fixed top-5 right-5 ${style.bg} text-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-down z-50`}>
            {style.icon}
            <p>{message}</p>
        </div>
    );
}

