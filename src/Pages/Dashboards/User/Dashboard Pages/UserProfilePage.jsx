import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, Camera, Loader, AlertCircle } from 'lucide-react';
import Toast from '../../../../Components/Toast/Toast.jsx';
import InputField from '../../../../Components/Input/InputField.jsx';
import apiClient from '../../../../../../Mobile-Shop-Website-Backend/controllers/axiosConfig.js';
import { useSearchParams } from 'react-router';

export default function UserProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const [editableUser, setEditableUser] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [searchParams] = useSearchParams();

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
    };

    useEffect(() => {
        const token = searchParams.get('token')
        
        if(token){
            localStorage.setItem('token', token)
        }

        const fetchUserProfile = async () => {
            try {
                const { data } = await apiClient.get('/users/profile');
                
                const fullUserData = {
                    ...data,
                    phone: data.number || 'N/A',
                    address: data.address || 'N/A',
                    profilePic: `https://placehold.co/150x150/E2E8F0/4A5568?text=${data.firstName.charAt(0)}${data.lastName.charAt(0)}`,
                    memberSince: new Date(data.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    totalOrders: 12, // Placeholder
                    wishlistItems: 5,  // Placeholder
                };
                setUser(fullUserData);
                setEditableUser(fullUserData);
            } catch (error) {
                const msg = error.response?.data?.message || "Failed to fetch profile data.";
                showToast(msg, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);
    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                firstName: editableUser.firstName,
                lastName: editableUser.lastName,
                username: editableUser.username,
                email: editableUser.email,
                phone: editableUser.phone,
                address: editableUser.address
            };

            const { data } = await apiClient.put('/users/profile', payload);
            
            setUser(prevUser => ({ ...prevUser, ...data }));
            setEditableUser(prevUser => ({ ...prevUser, ...data }));
            
            showToast(data.message || 'Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to update profile.";
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const handleCancelEdit = () => {
        setEditableUser(user);
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <Loader className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="flex flex-col justify-center items-center w-full h-full text-center p-4">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-red-600">Could Not Load Profile</h2>
                <p className="text-gray-500">Please ensure you are logged in and try refreshing the page.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
            <Toast notification={toast} />
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your personal information and account settings.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            {/* <div className="relative w-32 h-32 mx-auto mb-4 group">
                                <img className="rounded-full object-cover w-full h-full ring-4 ring-indigo-200" src={user.profilePic} alt="User profile"/>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-full transition-opacity cursor-pointer">
                                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                                </div>
                            </div> */}
                            <h2 className="text-2xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400 mt-2">Member since {user.memberSince}</p>
                            <div className="flex justify-around mt-6 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-indigo-600">{user.totalOrders}</p>
                                    <p className="text-sm text-gray-500">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-indigo-600">{user.wishlistItems}</p>
                                    <p className="text-sm text-gray-500">Wishlist</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2 transition duration-150 ease-in-out shadow-sm">
                                        <Edit3 size={16} className="mr-2" /> Edit Profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField icon={<User size={16} className="text-gray-400" />} label="First Name" type="text" name="firstName" value={editableUser.firstName} onChange={handleInputChange} disabled={!isEditing}/>
                                    <InputField icon={<User size={16} className="text-gray-400" />} label="Last Name" type="text" name="lastName" value={editableUser.lastName} onChange={handleInputChange} disabled={!isEditing}/>
                                </div>
                                <InputField icon={<User size={16} className="text-gray-400" />} label="Username" type="text" name="username" value={editableUser.username} onChange={handleInputChange} disabled={!isEditing}/>
                                <InputField icon={<Mail size={16} className="text-gray-400" />} label="Email Address" type="email" name="email" value={editableUser.email} onChange={handleInputChange} disabled={!isEditing}/>
                                
                                <InputField icon={<Phone size={16} className="text-gray-400" />} label="Phone Number" type="number" name="phone" value={editableUser.phone} onChange={handleInputChange} disabled={!isEditing}/>
                                <InputField icon={<MapPin size={16} className="text-gray-400" />} label="Address" type="text" name="address" value={editableUser.address} onChange={handleInputChange} disabled={!isEditing}/>

                                {isEditing && (
                                    <div className="flex justify-end space-x-3 pt-4">
                                         <button type="button" onClick={handleCancelEdit} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition">Cancel</button>
                                         <button type="button" onClick={handleSaveChanges} disabled={isSubmitting} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition flex items-center disabled:bg-indigo-400">
                                            {isSubmitting && <Loader size={16} className="animate-spin mr-2" />}
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                                         </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

