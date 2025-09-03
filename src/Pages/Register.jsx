import React, { useState, useEffect } from 'react';
import { UserPlus, Lock, Mail, User, Loader, Info, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';

// --- Supabase Client Setup ---
// NOTE: This component assumes the Supabase client library is loaded globally
// via a script tag in your index.html file, like this:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabaseUrl = 'https://ikmyhzhlesebjdgijzef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbXloemhsZXNlYmpkZ2lqemVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzkxOTYsImV4cCI6MjA3MjQxNTE5Nn0.iPLVOeWJ_qGou2rPrvncpfdiBFEJIBPKmgLmX3gC2rw';
// The 'supabase' object is now expected to be on the global 'window' object.
const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;


// SVG Icon for Google
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.218,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

// SVG Icon for Apple
const AppleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.713 0C12.735 0 10.413.93 8.938 2.373c-1.429 1.35-2.625 3.636-2.625 5.953 0 2.518 1.413 3.682 2.988 3.682 1.54 0 2.228-.857 3.938-.857 1.63 0 2.45.886 3.963.886 1.644 0 3.128-1.257 3.128-3.963C20.338 9.53 17.738 8.08 17.738 5.61c0-2.828 2.25-4.07 3.938-4.07.257 0 .513-.029.743-.057-.17-.014-3.8-1.486-6.706-1.486zm-2.072 13.463c-.8.3-1.6.857-2.286 1.486-.714.628-1.243 1.4-1.628 2.314-.4.886-.628 1.886-.628 2.886 0 .8.143 1.6.457 2.314.3.715.742 1.343 1.285 1.886.543.543 1.2.943 1.943 1.143.742.228 1.485.257 2.2.257.743 0 1.514-.114 2.286-.343.77-.228 1.514-.6 2.17-.b14.657-.515 1.172-1.143 1.514-1.829.343-.685.515-1.485.515-2.343 0-1.686-1.028-2.957-2.2-3.486-1.543-.657-3.4-.6-4.628.2z"></path>
    </svg>
);


export default function Register() {
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
                provider: provider.toLowerCase(), // 'google' or 'apple'
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
        if (!supabase) {
            showToast("Authentication service is not available.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const { email, password, fullName } = formData;
            
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) {
                throw error;
            }
            
            showToast('Registration successful! Please check your email to verify your account.', 'success');
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
            setPasswordStrength(0);
        } catch (error) {
            const errorMessage = error.message || "Registration failed. Please try again.";
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <Toast notification={toast} />
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    <div className="text-center mb-8">
                        <UserPlus className="mx-auto w-12 h-12 text-indigo-600" />
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
                        />
                        <div>
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
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                            <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <SocialButton provider="Google" onClick={() => handleSocialLogin('Google')} icon={<GoogleIcon />}/>
                        <SocialButton provider="Apple" onClick={() => handleSocialLogin('Apple')} icon={<AppleIcon />} isDark/>
                    </div>
                    
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account?{' '}
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

function SocialButton({ provider, icon, onClick, isDark = false }) {
    const baseClasses = 'w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-semibold border transition-colors';
    const lightClasses = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
    const darkClasses = 'bg-black text-white border-black hover:bg-gray-800';
  
    return (
      <button onClick={onClick} className={`${baseClasses} ${isDark ? darkClasses : lightClasses}`}>
        {icon}
        Continue with {provider}
      </button>
    );
}

function InputField({ id, label, error, icon, type, ...props }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === 'password';

    return (
        <div>
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
                    className={`w-full p-3 pl-10 pr-10 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
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

