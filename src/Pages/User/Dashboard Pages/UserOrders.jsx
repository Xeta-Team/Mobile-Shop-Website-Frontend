import React, { useState } from 'react';
import { Route, Routes, Link, useLocation } from "react-router-dom";

// --- Helper Components & Icons ---
const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);


// --- Mock Data ---
const mockOrders = [
    {
        id: '#345-098',
        date: '2024-07-22',
        status: 'Delivered',
        total: 129.98,
        items: [
            { id: 1, name: 'Classic Leather Watch', quantity: 1, price: 89.99, image: 'https://placehold.co/100x100/e2e8f0/4a5568?text=Watch' },
            { id: 2, name: 'Minimalist Wallet', quantity: 1, price: 39.99, image: 'https://placehold.co/100x100/e2e8f0/4a5568?text=Wallet' },
        ],
    },
    {
        id: '#345-099',
        date: '2024-07-20',
        status: 'Shipped',
        total: 75.50,
        items: [
            { id: 3, name: 'Wireless Bluetooth Earbuds', quantity: 1, price: 75.50, image: 'https://placehold.co/100x100/e2e8f0/4a5568?text=Earbuds' },
        ],
    },
    {
        id: '#345-100',
        date: '2024-07-18',
        status: 'Processing',
        total: 214.00,
        items: [
            { id: 4, name: 'Running Shoes', quantity: 1, price: 120.00, image: 'https://placehold.co/100x100/e2e8f0/4a5568?text=Shoes' },
            { id: 5, name: 'Smart Water Bottle', quantity: 1, price: 94.00, image: 'https://placehold.co/100x100/e2e8f0/4a5568?text=Bottle' },
        ],
    },
    {
        id: '#345-097',
        date: '2024-07-15',
        status: 'Cancelled',
        total: 49.99,
        items: [
            { id: 6, name: 'Graphic T-Shirt', quantity: 1, price: 49.99, image: 'https://placehold.co/100x100/e2e8f0/4a5568?text=T-Shirt' },
        ],
    },
];

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full capitalize";
    const statusClasses = {
        'Delivered': 'bg-green-100 text-green-800',
        'Shipped': 'bg-blue-100 text-blue-800',
        'Processing': 'bg-yellow-100 text-yellow-800',
        'Cancelled': 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};


// --- NEW UserOrders Component ---
const UserOrders = () => {
    const [orders, setOrders] = useState(mockOrders);
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const filteredOrders = activeFilter === 'All'
        ? orders
        : orders.filter(order => order.status === activeFilter);

    // Empty state component for when there are no orders
    const NoOrders = () => (
        <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
                 <ShoppingBagIcon />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet!</h2>
            <p className="text-gray-500 mb-6">You haven’t placed any orders yet. When you do, they’ll show up here.</p>
            <button className="bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                Start Shopping
            </button>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 md:p-8 font-sans bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:flex md:items-center md:justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                                    activeFilter === filter
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List or Empty State */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-6">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                                {/* Order Card Header */}
                                <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="text-sm text-gray-500">Order ID</p>
                                        <p className="font-bold text-gray-800">{order.id}</p>
                                    </div>
                                    <div className="mb-4 sm:mb-0 sm:text-center">
                                        <p className="text-sm text-gray-500">Date Placed</p>
                                        <p className="font-semibold text-gray-700">{order.date}</p>
                                    </div>
                                    <div className="sm:text-right">
                                         <p className="text-sm text-gray-500 mb-1">Status</p>
                                         <StatusBadge status={order.status} />
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 sm:p-6 space-y-4">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-200" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-700 text-right">${item.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Order Footer */}
                                <div className="bg-gray-50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                     <div className="text-lg">
                                        <span className="font-semibold text-gray-600">Order Total: </span>
                                        <span className="font-bold text-gray-800">${order.total.toFixed(2)}</span>
                                     </div>
                                     <div className="flex items-center space-x-3">
                                        <button className="text-sm text-gray-600 font-semibold hover:text-gray-900 transition">View Details</button>
                                        <button className="bg-gray-800 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                                           {order.status === 'Shipped' || order.status === 'Processing' ? 'Track Order' : 'Re-Order'}
                                        </button>
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <NoOrders />
                )}
            </div>
        </div>
    );
};

export default UserOrders