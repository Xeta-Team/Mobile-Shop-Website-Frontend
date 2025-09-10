import React, { useState } from 'react';
import { Search, MoreHorizontal, Edit, Trash2, ShieldCheck, User } from 'lucide-react';

// Sample user data - in a real app, this would come from an API
const sampleUsers = [
    { id: 'USR003', name: 'Admin User', email: 'admin@example.com', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    { id: 'USR001', name: 'John Doe', email: 'john.doe@example.com', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'USR002', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { id: 'USR004', name: 'Michael Brown', email: 'michael.brown@example.com', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

// A sub-component for each row to keep the code organized
const UserRow = ({ user }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const rolePillStyles = {
        Admin: "bg-indigo-100 text-indigo-700",
        Member: "bg-green-100 text-green-700"
    };
    const roleIcon = {
        Admin: <ShieldCheck size={14} className="mr-1.5" />,
        Member: <User size={14} className="mr-1.5" />
    };

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            {/* User Info Cell */}
            <td className="py-3 px-5">
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                    <div className="ml-4">
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                </div>
            </td>
            
            {/* Role Cell */}
            <td className="py-3 px-5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${rolePillStyles[user.role]}`}>
                    {roleIcon[user.role]}
                    {user.role}
                </span>
            </td>

            {/* Actions Cell */}
            <td className="py-3 px-5 text-right">
                <div className="relative inline-block text-left">
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                        onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} 
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                    {dropdownOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Edit size={16} className="mr-3 text-gray-500" /> Edit User
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    <Trash2 size={16} className="mr-3" /> Delete
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

// The main Users component
export default function Users() {
    const [users, setUsers] = useState(sampleUsers);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-[#F9FAFB] min-h-full font-sans">
            {/* Page Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Users</h1>
                    <p className="text-slate-500 mt-1">Manage your team members.</p>
                </div>
                <div className="flex items-center space-x-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-2.5 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                </div>
            </header>

            {/* Users Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                    {/* Table Header */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Information</th>
                            <th scope="col" className="py-3 px-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="relative py-3 px-5"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => <UserRow key={user.id} user={user} />)
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-16">
                                    <h3 className="text-lg font-medium text-gray-800">No users found</h3>
                                    <p className="text-gray-500 mt-1">Try adjusting your search.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
