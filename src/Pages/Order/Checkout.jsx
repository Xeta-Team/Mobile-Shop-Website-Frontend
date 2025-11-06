import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from './axiosConfig'
import { toast } from 'react-toastify';

// Simple Input Component for reusability (updated for B&W theme)
const InputField = ({ id, label, placeholder, required = false, type = 'text', value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-black transition duration-150"
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
    />
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showDifferentShipping, setShowDifferentShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'Sri Lanka',
    streetAddress: '',
    apartment: '',
    city: '',
    postcode: '',
    phone: '',
    email: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
     firstName: '',
    lastName: '',
    companyName: '',
    country: '',
    streetAddress: '',
    apartment: '',
    city: '',
    postcode: '',
  });

  const [orderNotes, setOrderNotes] = useState('');
  
  useEffect(() => {
    // Load cart items from local storage
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
    
    // Calculate total price
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, []);

  const handleBillingChange = (e) => {
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
  };
  
  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      
      // Basic Validation
      if(!billingAddress.firstName || !billingAddress.streetAddress || !billingAddress.city || !billingAddress.phone || !billingAddress.email) {
          setError('Please fill all required billing fields.');
          setIsLoading(false);
          return;
      }

      // The orderItems payload now correctly maps the data.
      // Make sure your cart item object in localStorage has 'productId', 'name', 'quantity', 'price', and 'image'.
      const orderData = {
          orderItems: cartItems.map(item => ({
              productId: item.productId, // <-- CRITICAL: This must be the parent product's MongoDB _id
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image
          })),
          billingAddress,
          shippingAddress: showDifferentShipping ? shippingAddress : billingAddress,
          paymentMethod,
          totalPrice,
          orderNotes
      };
      
      try {
        const response = await apiClient.post('/orders/', orderData);
        
        if(response.status === 201) {
            localStorage.removeItem('cartItems'); // Clear cart on successful order
            toast.success(response?.data?.message || "Order placed successfully!");
            navigate('/user/orders');
        }
      } catch (err) {
          setError(err.response?.data?.details || err.response?.data?.error || 'An unexpected error occurred. Please try again.');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="bg-white text-black min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center tracking-wide">Checkout</h1>
        <p className="text-gray-600 mb-8 text-center">Complete your purchase</p>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Billing Details Column */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
             <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-3">Billing details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputField id="firstName" label="First name" placeholder="John" required value={billingAddress.firstName} onChange={handleBillingChange} />
                <InputField id="lastName" label="Last name" placeholder="Doe" value={billingAddress.lastName} onChange={handleBillingChange} />
            </div>
            <InputField id="companyName" label="Company name (optional)" placeholder="Your Company" value={billingAddress.companyName} onChange={handleBillingChange} />
            <InputField id="country" label="Country / Region" placeholder="Sri Lanka" required value={billingAddress.country} onChange={handleBillingChange} />
            <InputField id="streetAddress" label="Street address" placeholder="123 Main St" required value={billingAddress.streetAddress} onChange={handleBillingChange} />
            <InputField id="apartment" label="Apartment, suite, etc. (optional)" placeholder="Apartment, suite, unit, etc." value={billingAddress.apartment} onChange={handleBillingChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InputField id="city" label="Town / City" placeholder="Colombo" required value={billingAddress.city} onChange={handleBillingChange}/>
              <InputField id="postcode" label="Postcode / ZIP" placeholder="12345" value={billingAddress.postcode} onChange={handleBillingChange}/>
            </div>
            <InputField id="phone" label="Phone" placeholder="0771234567" type="tel" required value={billingAddress.phone} onChange={handleBillingChange}/>
            <InputField id="email" label="Email address" placeholder="you@example.com" type="email" required value={billingAddress.email} onChange={handleBillingChange}/>
            <div className="mt-4 text-sm text-gray-600">
                Create an account? <Link to="/register" className="text-black font-medium hover:underline">Register here</Link>
            </div>
            <div className="mt-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded bg-gray-100 border-gray-300 text-black focus:ring-black" checked={showDifferentShipping} onChange={() => setShowDifferentShipping(!showDifferentShipping)}/>
                    <span className="text-gray-800">Ship to a different address?</span>
                </label>
            </div>
          </div>
          
          {/* Order Summary & Payment Column */}
          <div className="space-y-8">
            {/* Shipping Address (Conditional) */}
            {showDifferentShipping && (
                <div className="bg-white p-8 rounded-lg border border-gray-200 animate-fade-in">
                    <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <InputField id="firstName" label="First name" required value={shippingAddress.firstName} onChange={handleShippingChange} />
                        <InputField id="lastName" label="Last name" value={shippingAddress.lastName} onChange={handleShippingChange} />
                    </div>
                    <InputField id="streetAddress" label="Street address" required value={shippingAddress.streetAddress} onChange={handleShippingChange}/>
                    <InputField id="city" label="Town / City" required value={shippingAddress.city} onChange={handleShippingChange}/>
                </div>
            )}

            {/* Your Order */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-3">Your order</h2>
                <div className="space-y-4 mb-6">
                    {cartItems.length > 0 ? cartItems.map((item, index) => (
                        <div key={item.sku || index} className="flex justify-between items-center text-gray-800">
                            <span>{item.name} &times; {item.quantity}</span>
                            <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    )) : <p className="text-gray-500">Your cart is empty.</p>}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>LKR {totalPrice.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span>LKR {totalPrice.toLocaleString()}</span>
                    </div>
                </div>
                
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                    <div className="space-y-3">
                        {['Credit Card', 'PayPal', 'Cash on Delivery'].map(method => (
                             <label key={method} className="flex items-center p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150">
                                <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-black border-gray-400 focus:ring-black"/>
                                <span className="ml-3 text-black">{method}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-1">Order notes (optional)</label>
                    <textarea id="orderNotes" name="orderNotes" rows="3" className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-black" placeholder="Notes about your order, e.g. special notes for delivery." value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}></textarea>
                </div>

                <button type="submit" disabled={isLoading || cartItems.length === 0} className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg mt-8 transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none">
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;