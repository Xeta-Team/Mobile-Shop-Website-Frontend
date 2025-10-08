import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../../../api/axiosConfig.js';

// --- Reusable Child Components ---

// Modal component is now included in this file
function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-up">
                <div className="flex items-start justify-between">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

const StatsCard = ({ title, value, icon, currency = '' }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between border border-gray-200">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{currency}{value.toLocaleString()}</p>
        </div>
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
            {icon}
        </div>
    </div>
);

const OrderStatusSelector = ({ currentStatus, orderId, onStatusChange }) => {
    const statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    const statusColorMap = {
        'Pending': 'border-yellow-500 text-yellow-700',
        'Shipped': 'border-blue-500 text-blue-700',
        'Delivered': 'border-green-500 text-green-700',
        'Cancelled': 'border-red-500 text-red-700',
    };
    return (
        <select
            value={currentStatus}
            onChange={(e) => onStatusChange(orderId, e.target.value)}
            className={`w-full p-2 border-2 rounded-md text-sm font-semibold transition-colors ${statusColorMap[currentStatus] || 'border-gray-300'}`}
        >
            {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
            ))}
        </select>
    );
};

// --- Main Dashboard Component ---
export default function MainDashboard() {
    // State for data
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for the tracking number modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // You can create a real analytics endpoint later
                // const statsRes = await apiClient.get('/analytics/stats');
                const ordersRes = await apiClient.get('/orders');
                // setStats(statsRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Central function to update an order on the backend and in local state
    const updateOrder = async (orderId, status, trackingNum = null) => {
        try {
            const payload = { status };
            // Only include tracking number in the payload if provided
            if (trackingNum) {
                payload.trackingNumber = trackingNum;
            }

            const { data: updatedOrder } = await apiClient.put(`/orders/${orderId}/status`, payload);
            setOrders(orders.map(o => (o._id === orderId ? updatedOrder : o)));
        } catch (error) {
            console.error("Failed to update order:", error);
            // Optionally, show a toast notification on error
        }
    };

    // This function decides whether to update immediately or show the modal
    const handleStatusChange = (orderId, newStatus) => {
        const order = orders.find(o => o._id === orderId);
        if (!order) return;
        
        setCurrentOrder(order);

        if (newStatus === 'Shipped') {
            // Open the modal to get the tracking number
            setTrackingNumber(order.trackingNumber || '');
            setIsModalOpen(true);
        } else {
            // For any other status, update the order right away
            updateOrder(orderId, newStatus);
        }
    };

    // This function is called when the modal's "Confirm" button is clicked
    const handleConfirmShipOrder = async () => {
        if (!trackingNumber.trim()) {
            alert('Please enter a tracking number before confirming.');
            return;
        }
        await updateOrder(currentOrder._id, 'Shipped', trackingNumber);
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentOrder(null);
        setTrackingNumber('');
    };

    if (loading) return <div className="p-8 text-center text-gray-600">Loading Dashboard Data...</div>;

    // Dummy data for the sales chart
    const salesData = [
        { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 5000 }, { name: 'Thu', sales: 4500 },
        { name: 'Fri', sales: 6000 }, { name: 'Sat', sales: 5500 },
        { name: 'Sun', sales: 7000 },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">An overview of your shop's performance and recent orders.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsCard title="Total Revenue" value={stats.totalRevenue} icon={<DollarSign size={24} />} currency="LKR " />
                <StatsCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={24} />} />
                <StatsCard title="Total Customers" value={stats.totalCustomers} icon={<Users size={24} />} />
            </div>
            
            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sales</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Tracking #</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map(order => (
                                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-700">#{order._id.substring(0, 8)}</td>
                                    <td className="p-3">{order.user?.firstName || 'N/A'} {order.user?.lastName}</td>
                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">LKR {order.totalPrice.toLocaleString()}</td>
                                    <td className="p-3 w-40">
                                        <OrderStatusSelector currentStatus={order.orderStatus} orderId={order._id} onStatusChange={handleStatusChange} />
                                    </td>
                                    <td className="p-3 w-48 font-mono text-xs">
                                       {order.trackingNumber || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tracking Number Modal */}
            {isModalOpen && currentOrder && (
                <Modal title="Ship Order" onClose={closeModal}>
                    <p className="text-gray-600 mb-4">
                        Please enter the tracking number for order <strong>#{currentOrder._id.substring(0, 8)}</strong>.
                    </p>
                    <input 
                        type="text" 
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeModal} className="px-5 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-100">Cancel</button>
                        <button onClick={handleConfirmShipOrder} className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700">
                            Confirm & Send Email
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}