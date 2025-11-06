import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MoreHorizontal, Edit, Trash2, ShieldCheck, User, Loader, AlertCircle, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';

// This is a helper function to create an API client instance.
// It dynamically gets the latest token from localStorage for each request.
const getApiClient = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: `http://localhost:3001/api`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};


// --- Sub-components ---

// Renders a single row in the users table
const UserRow = ({ user, onEditRole, onDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const rolePillStyles = {
        admin: "bg-indigo-100 text-indigo-700",
        user: "bg-green-100 text-green-700"
    };
    const roleIcon = {
        admin: <ShieldCheck size={14} className="mr-1.5" />,
        user: <User size={14} className="mr-1.5" />
    };

    const role = user.role || 'user'; // Default to 'user' if role is not specifieds

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
            <td className="py-3 px-5">
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover bg-gray-200" src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} alt={user.username} />
                    <div className="ml-4">
                        <p className="font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium capitalize ${rolePillStyles[role]}`}>
                    {roleIcon[role]}
                    {role}
                </span>
            </td>
            <td className="py-3 px-5 text-right">
                <div className="relative inline-block text-left">
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                        onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} 
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                    {dropdownOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-10 animate-fade-in-down">
                            <div className="py-1">
                                <button onClick={onEditRole} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    <Edit size={16} className="mr-3 text-gray-500" /> Change Role
                                </button>
                                <button onClick={onDelete} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <Trash2 size={16} className="mr-3" /> Delete User
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};



// --- Main Users Page Component ---

export default function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userToUpdate, setUserToUpdate] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    // Fetch users from the API
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiClient = getApiClient(); // Get a fresh client with the latest token
            const response = await apiClient.get('/users');
            setUsers(response.data);
        } catch (err) {
            setError("Failed to fetch users. Please make sure you are logged in as an admin.");
            toast.error("Failed to fetch users.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async (newRole) => {
        console.log(newRole);
        
        if (!userToUpdate) return;
        setIsSubmitting(true);
        try {
            const apiClient = getApiClient();
            await apiClient.put(`/users/role/${userToUpdate._id}`, { role: newRole });
            toast.success(`Successfully updated ${userToUpdate.username}'s role to ${newRole}.`);
            setUserToUpdate(null);
            fetchUsers(); // Re-fetch users to show the change
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update role.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setIsSubmitting(true);
        try {
            const apiClient = getApiClient();
            await apiClient.delete(`/users/${userToDelete._id}`);
            toast.success(`User ${userToDelete.username} has been deleted.`);
            setUserToDelete(null);
            fetchUsers(); // Re-fetch users
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete user.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-50 min-h-full font-sans">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
                    <p className="text-slate-500 mt-1">View, edit, and manage user accounts.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 pr-4 py-2.5 w-full sm:w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="relative py-3 px-5"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="3" className="text-center py-16"><Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto" /></td></tr>
                        ) : error ? (
                             <tr><td colSpan="3" className="text-center py-16 text-red-500"><div className="flex flex-col items-center gap-2"><AlertCircle className="w-12 h-12" /><p className="font-semibold">{error}</p></div></td></tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map(user => <UserRow key={user._id} user={user} onEditRole={() => setUserToUpdate(user)} onDelete={() => setUserToDelete(user)} />)
                        ) : (
                            <tr><td colSpan="3" className="text-center py-16"><h3 className="text-lg font-medium text-gray-800">No users found</h3></td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Role Change Modal */}
            {userToUpdate && (
                <RoleChangeModal 
                    user={userToUpdate}
                    isSubmitting={isSubmitting}
                    onConfirm={handleUpdateRole}
                    onCancel={() => setUserToUpdate(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <ConfirmationModal
                    title="Delete User"
                    message={`Are you sure you want to permanently delete the user "${userToDelete.username}"? This action cannot be undone.`}
                    isSubmitting={isSubmitting}
                    onConfirm={handleDeleteUser}
                    onCancel={() => setUserToDelete(null)}
                />
            )}
        </div>
    );
}

// --- Modal Components ---

function RoleChangeModal({ user, onConfirm, onCancel, isSubmitting }) {
    const [selectedRole, setSelectedRole] = useState(user.role);
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Change User Role</h2>
              <p className="mt-1 text-gray-600">Select a new role for <strong className="font-semibold">{user.username}</strong>.</p>
            </div>
            <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 rounded-full"><X size={24} /></button>
          </div>
  
          <div className="mt-6 space-y-3">
            <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${selectedRole === 'user' ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200' : 'border-gray-300 hover:bg-gray-50'}`}>
              <User className="w-6 h-6 mr-4 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">User</h3>
                <p className="text-sm text-gray-500">Standard user permissions.</p>
              </div>
              <input type="radio" name="role" value="user" checked={selectedRole === 'user'} onChange={(e) => setSelectedRole(e.target.value)} className="ml-auto" />
            </label>
            <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${selectedRole === 'admin' ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200' : 'border-gray-300 hover:bg-gray-50'}`}>
              <ShieldCheck className="w-6 h-6 mr-4 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Admin</h3>
                <p className="text-sm text-gray-500">Full administrative access.</p>
              </div>
              <input type="radio" name="role" value="admin" checked={selectedRole === 'admin'} onChange={(e) => setSelectedRole(e.target.value)} className="ml-auto" />
            </label>
          </div>
  
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={onCancel} className="px-5 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-100 transition-colors">Cancel</button>
            <button onClick={() => onConfirm(selectedRole)} disabled={isSubmitting} className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-400">
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
}
  

function ConfirmationModal({ title, message, onConfirm, onCancel, isSubmitting }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm" onClick={onCancel}>
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="my-3 text-gray-600">{message}</p>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button onClick={onCancel} className="w-full rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-300">Cancel</button>
            <button onClick={onConfirm} disabled={isSubmitting} className="w-full rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 flex items-center justify-center gap-2 disabled:bg-red-400">
              {isSubmitting && <Loader size={16} className="animate-spin"/>}
              {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    );
}

