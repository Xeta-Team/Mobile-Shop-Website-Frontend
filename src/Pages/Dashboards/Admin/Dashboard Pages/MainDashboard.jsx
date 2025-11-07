import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, ShoppingCart, Users, X, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../../api/axiosConfig.js';
import { toast } from 'react-toastify'; 



// Modal component remains unchanged
function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
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

    // NEW State for filtering and modals
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Pending', 'Shipped', etc.
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // You can create a real analytics endpoint later
                // const statsRes = await apiClient.get('/analytics/stats');
                const ordersRes = await apiClient.get('api/orders');
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

    // Memoized filtered orders
    const filteredOrders = useMemo(() => {
        if (filterStatus === 'All') {
            return orders;
        }
        return orders.filter(order => order.orderStatus === filterStatus);
    }, [orders, filterStatus]);

    const updateOrder = async (orderId, status, trackingNum = null) => {
        const payload = { status };
        if (trackingNum) {
            payload.trackingNumber = trackingNum;
        }
        const { data: updatedOrder } = await apiClient.put(`/orders/${orderId}/status`, payload);
        setOrders(orders.map(o => (o._id === orderId ? updatedOrder : o)));
    };

    const handleStatusChange = (orderId, newStatus) => {
        const order = orders.find(o => o._id === orderId);
        if (!order) return;
        
        setSelectedOrder(order);

        if (newStatus === 'Shipped') {
            setTrackingNumber(order.trackingNumber || '');
            setIsTrackingModalOpen(true);
        } else {
            // For other statuses, we can update it optimistically as well
            toast.promise(
                updateOrder(orderId, newStatus),
                {
                  pending: `Updating status to ${newStatus}...`,
                  success: 'Order status updated 👌',
                  error: 'Failed to update status 🤯'
                }
            );
        }
    };
    
    // NEW: Handler to open the details modal
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    // --- 2. THIS FUNCTION IS NOW MODIFIED ---
    const handleConfirmShipOrder = async () => {
        if (!trackingNumber.trim()) {
            toast.error('Please enter a tracking number.');
            return;
        }

        // Close the modal immediately for a responsive feel
        closeTrackingModal();

        // Use toast.promise to handle the loading, success, and error states
        toast.promise(
            updateOrder(selectedOrder._id, 'Shipped', trackingNumber),
            {
              pending: 'Updating order and sending email...',
              success: 'Order shipped and email sent! 🚀',
              error: 'An error occurred. Please try again.'
            }
        );
    };

    const closeTrackingModal = () => {
        setIsTrackingModalOpen(false);
        setSelectedOrder(null);
        setTrackingNumber('');
    };

    // NEW: Handler to close the details modal
    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrder(null);
    };

    if (loading) return <div className="p-8 text-center text-gray-600">Loading Dashboard Data...</div>;

    const salesData = [
        { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 5000 }, { name: 'Thu', sales: 4500 },
        { name: 'Fri', sales: 6000 }, { name: 'Sat', sales: 5500 },
        { name: 'Sun', sales: 7000 },
    ];
    
    const filterButtons = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">An overview of your shop's performance and recent orders.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsCard title="Total Revenue" value={stats.totalRevenue} icon={<DollarSign size={24} />} currency="LKR " />
                <StatsCard title="Total Orders" value={orders.length} icon={<ShoppingCart size={24} />} />
                <StatsCard title="Total Customers" value={stats.totalCustomers} icon={<Users size={24} />} />
            </div>
            
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

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Recent Orders</h2>
                    {/* NEW: Filter Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {filterButtons.map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
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
                            {filteredOrders.map(order => (
                                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => handleViewOrder(order)}>
                                    <td className="p-3 font-medium text-gray-700">#{order._id.substring(0, 8)}</td>
                                    <td className="p-3">{order.user?.firstName || 'N/A'} {order.user?.lastName}</td>
                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">LKR {order.totalPrice.toLocaleString()}</td>
                                    <td className="p-3 w-40" onClick={(e) => e.stopPropagation()}> {/* Stop propagation to prevent modal open on select click */}
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
            {isTrackingModalOpen && selectedOrder && (
                <Modal title="Ship Order" onClose={closeTrackingModal}>
                    <p className="text-gray-600 mb-4">
                        Please enter the tracking number for order <strong>#{selectedOrder._id.substring(0, 8)}</strong>.
                    </p>
                    <input 
                        type="text" 
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeTrackingModal} className="px-5 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-100">Cancel</button>
                        <button onClick={handleConfirmShipOrder} className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700">
                            Confirm & Send Email
                        </button>
                    </div>
                </Modal>
            )}

            {/* MODIFIED: Order Details Modal */}
            {isDetailsModalOpen && selectedOrder && (
                <Modal title={`Order Details #${selectedOrder._id.substring(0, 8)}`} onClose={closeDetailsModal}>
                    <div className="space-y-6 text-sm">
                        {/* Customer & Order Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Customer</h3>
                                <p className="text-gray-600">{selectedOrder.billingAddress.firstName} {selectedOrder.billingAddress.lastName}</p>
                                <p className="text-gray-600">{selectedOrder.billingAddress.email}</p>
                                <p className="text-gray-600">{selectedOrder.billingAddress.phone}</p>
                            </div>
                             <div>
                                <h3 className="font-bold text-gray-800 mb-1">Order Info</h3>
                                <p className="text-gray-600"><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                                <p className="text-gray-600"><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                                <p className="text-gray-600"><strong>Total:</strong> LKR {selectedOrder.totalPrice.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* NEW: Billing and Shipping Address Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Billing Address</h3>
                                <div className="text-gray-600 p-4 border rounded-lg h-full">
                                    <p>{selectedOrder.billingAddress.streetAddress}</p>
                                    <p>{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.postcode}</p>
                                    <p>{selectedOrder.billingAddress.country}</p>
                                </div>
                            </div>
                             <div>
                                <h3 className="font-bold text-gray-800 mb-2">Shipping Address</h3>
                                <div className="text-gray-600 p-4 border rounded-lg h-full">
                                    <p>{selectedOrder.shippingAddress.streetAddress || selectedOrder.billingAddress.streetAddress}</p>
                                    <p>{selectedOrder.shippingAddress.city || selectedOrder.billingAddress.city}, {selectedOrder.shippingAddress.postcode || selectedOrder.billingAddress.postcode}</p>
                                    <p>{selectedOrder.shippingAddress.country || selectedOrder.billingAddress.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Conditionally render Order Notes */}
                        {selectedOrder.orderNotes && (
                             <div>
                                
                                <h3 className="font-bold text-gray-800 mb-2">Order Notes</h3>
                                <div className="text-gray-700 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                                    <p>{selectedOrder.orderNotes}</p>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div>
                            
                            <h3 className="font-bold text-gray-800 mb-2">Items Ordered</h3>
                            <div className="space-y-2">
                                {selectedOrder.orderItems.map(item => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium text-gray-700">LKR {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                         <div className="pt-4 flex justify-end">
                             <button onClick={closeDetailsModal} className="px-5 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-100">Close</button>
                         </div>
                    </div>
                </Modal>
            )}

        </div>
    );
}