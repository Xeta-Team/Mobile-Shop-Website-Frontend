import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, AlertCircle, PackageSearch, ChevronDown, ChevronUp, Hash, Calendar } from 'lucide-react';
import apiClient from '../../../../api/axiosConfig.js';

const StatusBadge = ({ status }) => {
    const statusClasses = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Shipped': 'bg-blue-100 text-blue-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export default function UserOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await apiClient.get('/orders/myorders');
                setOrders(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleToggleDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <Loader className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center w-full h-full text-center p-4">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-red-600">Could Not Load Orders</h2>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">View your order history and track your purchases.</p>
                </header>
                
                {orders.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-lg shadow-md border border-gray-200">
                        <PackageSearch className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">You haven't placed any orders yet.</h2>
                        <p className="text-gray-500 my-4">All your future orders will be displayed here.</p>
                        <Link to="/" className="inline-block bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-700 transition">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer" onClick={() => handleToggleDetails(order._id)}>
                                    <div className="flex-grow space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Hash size={18} className="text-gray-400" /> Order #{order._id.substring(0, 8)}</h2>
                                            <StatusBadge status={order.orderStatus} />
                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Calendar size={14} /> Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6 sm:gap-12 text-right">
                                        <div>
                                           <p className="text-sm text-gray-500">Total</p>
                                           <p className="text-lg font-bold text-gray-900">LKR {order.totalPrice.toLocaleString()}</p>
                                        </div>
                                        <button className="text-gray-500 hover:text-indigo-600">
                                            {expandedOrderId === order._id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </button>
                                    </div>
                                </div>
                                
                                {expandedOrderId === order._id && (
                                    <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50">
                                        <h3 className="font-semibold text-gray-700 mb-4">Items ({order.orderItems.length})</h3>
                                        <div className="space-y-4">
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                                                    <div className="flex-grow">
                                                        <p className="font-medium text-gray-800">{item.name}</p>
                                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <p className="text-gray-700 font-medium">LKR {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};