import React, { useState } from 'react';
import { UserPlus, Lock, Mail, User, Loader, Info, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react'; 


export default function InputField({ id, label, error, icon, type, style, ...props }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="animate-input-fade-in" style={style}>
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    {React.cloneElement(icon, { className: 'w-5 h-5' })}
                </span>
                <input
                    id={id}
                    name={id}
                    type={isPassword ? (isPasswordVisible ? 'text' : 'password') : type}
                    {...props}
                    className={`w-full p-3 pl-10 pr-10 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'}`}
                    autoComplete="off"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                        {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}