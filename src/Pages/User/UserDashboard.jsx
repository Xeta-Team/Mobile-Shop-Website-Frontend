import React, { useState } from 'react';
import { Home, ChevronRight, LayoutDashboard, ShoppingCart, MapPin, User, Lock, LogOut, CheckSquare, Edit } from 'lucide-react';

// --- Mock Data ---
const mockUser = {
    firstName: 'Sudeera',
    lastName: 'Mihiranga',
    email: 'sudeera.m@example.com',
};

const mockOrders = [
    { id: '#84521', date: 'September 2, 2025', status: 'Shipped', total: 'LKR 320,000.00 for 1 item' },
    { id: '#84520', date: 'September 2, 2025', status: 'Processing', total: 'LKR 4,500.00 for 1 item' },
    { id: '#84519', date: 'September 1, 2025', status: 'Delivered', total: 'LKR 12,000.00 for 2 items' },
];

const mockAddresses = {
    billing: {
        name: 'Sudeera Mihiranga',
        address: 'No 25, Temple Road',
        city: 'Kandy, 20000',
        country: 'Sri Lanka'
    },
    shipping: {
        name: 'Sudeera Mihiranga',
        address: 'No 110, Flower Street',
        city: 'Colombo 07',
        country: 'Sri Lanka'
    }
};


// --- Main Dashboard Component ---
export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard');

    // Main content renderer based on the active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'Orders':
                return <OrdersContent />;
            case 'Addresses':
                return <AddressesContent />;
            case 'Account details':
                return <AccountDetailsContent />;
            case 'Password':
                return <PasswordContent />;
            case 'Logout':
                // In a real app, this would trigger a logout function
                return <p>You have been logged out.</p>;
            default:
                return <DashboardHome setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumbs />
                <div className="flex flex-col lg:flex-row gap-8 mt-6">
                    {/* Sidebar Navigation */}
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Main Content Area */}
                    <main className="flex-1">
                        {activeTab === 'Dashboard' && (
                            <>
                                <p className="text-gray-600 leading-relaxed">
                                    Hello <span className="font-bold text-black">{mockUser.firstName}</span> (not <span className="font-bold text-black">{mockUser.firstName}</span>? <a href="#" onClick={() => setActiveTab('Logout')} className="text-black hover:underline">Log out</a>)
                                </p>
                                <p className="mt-2 text-gray-600 leading-relaxed">
                                    From your account dashboard you can view your <a href="#" onClick={() => setActiveTab('Orders')} className="text-black hover:underline">recent orders</a>, manage your <a href="#" onClick={() => setActiveTab('Addresses')} className="text-black hover:underline">shipping and billing addresses</a>, and <a href="#" onClick={() => setActiveTab('Account details')} className="text-black hover:underline">edit your password and account details</a>.
                                </p>
                            </>
                        )}
                        <div className={`mt-8 ${activeTab === 'Dashboard' ? '' : 'border-t pt-8'}`}>
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components for each section ---

function Breadcrumbs() {
    return (
        <nav className="flex items-center text-sm text-gray-500">
            <a href="#" className="hover:underline">Home</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-semibold text-gray-700">My account</span>
        </nav>
    );
}

function Sidebar({ activeTab, setActiveTab }) {
    const navItems = ['Dashboard', 'Orders', 'Addresses', 'Account details', 'Password', 'Logout'];
    const icons = {
        Dashboard: <LayoutDashboard />, Orders: <ShoppingCart />, Addresses: <MapPin />,
        'Account details': <User />, Password: <Lock />, Logout: <LogOut />,
    };

    return (
        <aside className="w-full lg:w-1/4">
            <nav className="border rounded-lg overflow-hidden">
                <ul>
                    {navItems.map((item) => (
                        <li key={item}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab(item); }}
                                className={`flex items-center gap-3 px-5 py-3.5 text-gray-700 hover:bg-gray-100 transition-colors border-b last:border-b-0
                                    ${activeTab === item ? 'font-bold bg-gray-100 text-black' : ''}`}>
                                {React.cloneElement(icons[item], { className: 'w-5 h-5' })}
                                <span>{item}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

function DashboardHome({ setActiveTab }) {
    const dashboardItems = [
        { name: 'Orders', icon: <CheckSquare /> }, { name: 'Addresses', icon: <MapPin /> },
        { name: 'Account details', icon: <User /> }, { name: 'Password', icon: <Lock /> },
        { name: 'Logout', icon: <LogOut /> },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map(item => (
                <div key={item.name} onClick={() => setActiveTab(item.name)} className="border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:border-gray-400 transition-all cursor-pointer group">
                    {React.cloneElement(item.icon, { className: 'w-12 h-12 text-gray-400 group-hover:text-black transition-colors mb-4' })}
                    <p className="font-semibold text-gray-600 group-hover:text-black uppercase tracking-wider transition-colors">{item.name}</p>
                </div>
            ))}
        </div>
    );
}

function OrdersContent() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Orders</h2>
            {mockOrders.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold">Order</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Total</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockOrders.map(order => (
                                <tr key={order.id} className="border-b last:border-0">
                                    <td className="p-4 font-medium text-black">{order.id}</td>
                                    <td className="p-4">{order.date}</td>
                                    <td className="p-4">{order.status}</td>
                                    <td className="p-4">{order.total}</td>
                                    <td className="p-4">
                                        <button className="px-3 py-1 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No orders have been made yet.</p>
            )}
        </div>
    );
}

function AddressesContent() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Addresses</h2>
            <p className="text-gray-600 mb-6">The following addresses will be used on the checkout page by default.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AddressCard title="Billing Address" address={mockAddresses.billing} />
                <AddressCard title="Shipping Address" address={mockAddresses.shipping} />
            </div>
        </div>
    );
}

function AddressCard({ title, address }) {
    return (
        <div className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{title}</h3>
                <button className="flex items-center gap-1 text-sm text-black hover:underline">
                    <Edit className="w-4 h-4" /> Edit
                </button>
            </div>
            <div className="text-gray-600 space-y-1">
                <p>{address.name}</p>
                <p>{address.address}</p>
                <p>{address.city}</p>
                <p>{address.country}</p>
            </div>
        </div>
    );
}

function AccountDetailsContent() {
    const [user, setUser] = useState(mockUser);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Account Details</h2>
            <form className="space-y-4 max-w-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First Name" id="firstName" name="firstName" value={user.firstName} onChange={handleChange} />
                    <InputField label="Last Name" id="lastName" name="lastName" value={user.lastName} onChange={handleChange} />
                </div>
                <InputField label="Email Address" id="email" name="email" type="email" value={user.email} onChange={handleChange} />
                <button type="submit" className="px-6 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800">Save changes</button>
            </form>
        </div>
    );
}

function PasswordContent() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Change Password</h2>
            <form className="space-y-4 max-w-lg">
                <InputField label="Current password (leave blank to leave unchanged)" id="currentPassword" type="password" />
                <InputField label="New password (leave blank to leave unchanged)" id="newPassword" type="password" />
                <InputField label="Confirm new password" id="confirmPassword" type="password" />
                <button type="submit" className="px-6 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800">Save changes</button>
            </form>
        </div>
    );
}

function InputField({ label, ...props }) {
    return (
        <div>
            <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black" />
        </div>
    );
}

