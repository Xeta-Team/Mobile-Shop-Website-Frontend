// File: Mobile-Shop-Website-Frontend/src/Components/Cards/HoverTranslateCard.jsx
import axios from 'axios';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EyeIcon, HeartIcon, XMarkIcon, ShoppingCartIcon, BoltIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

// This is a helper function to create an API client instance.
// It dynamically gets the latest token from localStorage for each request.
const getApiClient = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: 'http://localhost:3001/api', // Make sure this matches your backend URL
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};


// --- Quick View Modal Component (remains unchanged) ---
const QuickViewModal = ({ product, isOpen, onClose }) => {
    if (!isOpen) return null;

    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        console.log(`Added ${quantity} of ${product.name} to cart.`);
        onClose();
    };

    const handleBuyNow = () => {
        console.log(`Buying ${quantity} of ${product.name} now.`);
    };

    const uniqueColors = useMemo(() => {
        const colors = new Map();
        product.variants?.forEach(v => {
            if (v.colorName && v.colorHex && !colors.has(v.colorName)) {
                colors.set(v.colorName, { name: v.colorName, hex: v.colorHex });
            }
        });
        return Array.from(colors.values());
    }, [product.variants]);

    const uniqueStorages = useMemo(() => {
        const storages = new Set();
        product.variants?.forEach(v => {
            if (v.storage) storages.add(v.storage);
        });
        return Array.from(storages);
    }, [product.variants]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }} className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10"><XMarkIcon className="h-6 w-6" /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="bg-gray-100 p-8 flex items-center justify-center"><img src={product.base_image} alt={product.name} className="max-h-[350px] object-contain" /></div>
                            <div className="p-8 flex flex-col">
                                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                <p className="text-2xl font-semibold text-gray-800 my-2">{product.startingPrice ? `Rs. ${product.startingPrice.toLocaleString()}` : 'Price not available'}</p>
                                <div className="mt-4"><h3 className="text-sm font-medium text-gray-900">Color</h3><div className="flex items-center space-x-2 mt-2">{uniqueColors.map((color) => (<span key={color.name} title={color.name} className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer" style={{ backgroundColor: color.hex }}></span>))}</div></div>
                                <div className="mt-4"><h3 className="text-sm font-medium text-gray-900">Storage</h3><div className="flex items-center flex-wrap gap-2 mt-2">{uniqueStorages.map((storage) => (<button key={storage} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">{storage}</button>))}</div></div>
                                <div className="mt-6 flex items-center"><label htmlFor="quantity" className="text-sm font-medium text-gray-900 mr-4">Quantity</label><div className="flex items-center border rounded-md"><button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100">-</button><span className="px-4 py-1 text-md font-semibold">{quantity}</span><button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100">+</button></div></div>
                                <div className="mt-auto pt-6 flex space-x-4">
                                    <button onClick={handleAddToCart} className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"><ShoppingCartIcon className="w-5 h-5"/> ADD TO CART</button>
                                    <button onClick={handleBuyNow} className="flex-1 bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"><BoltIcon className="w-5 h-5"/> BUY NOW</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// --- Main Upgraded Product Card ---
const HoverTranslateCard = ({ card: product }) => {
    const { _id, name, base_image, variants = [], brand = "Apple" } = product;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false); // Note: For a better UX, you could fetch the user's wishlist on page load to set the initial state of this icon correctly.

    const startingPrice = useMemo(() => {
        if (!variants || variants.length === 0) return null;
        return Math.min(...variants.map(v => v.price));
    }, [variants]);
    
    const uniqueColors = useMemo(() => {
        const colors = new Map();
        variants.forEach(v => {
            if (v.colorName && v.colorHex && !colors.has(v.colorName)) {
                colors.set(v.colorName, v.colorHex);
            }
        });
        return Array.from(colors.values());
    }, [variants]);

    const handleQuickViewClick = (e) => { e.preventDefault(); setIsModalOpen(true); };

    // --- UPDATED WISHLIST FUNCTION ---
    const handleWishlistClick = async (e) => {
        e.preventDefault(); // Prevent navigating to the product page
        const apiClient = getApiClient();
        const newWishlistState = !isInWishlist;

        // Optimistic UI update: change the icon immediately for a responsive feel
        setIsInWishlist(newWishlistState);

        try {
            if (newWishlistState) {
                // If the item is being added to the wishlist
                await apiClient.post('/users/wishlist', { productId: _id });
                toast.success(`${name} added to wishlist!`);
            } else {
                // If the item is being removed from the wishlist
                await apiClient.delete(`/users/wishlist/${_id}`);
                toast.success(`${name} removed from wishlist.`);
            }
        } catch (error) {
            // If the API call fails, revert the icon to its original state
            setIsInWishlist(!newWishlistState);
            toast.error(error.response?.data?.message || 'Could not update wishlist. Please try again.');
        }
    };

    return (
        <>
            <Link to={`/product/${_id}`} className="block w-full">
                <div className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={handleQuickViewClick} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors" aria-label="Quick View"><EyeIcon className="w-5 h-5 text-gray-700" /></button>
                        <button onClick={handleWishlistClick} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors" aria-label="Add to Wishlist">{isInWishlist ? (<HeartIconSolid className="w-5 h-5 text-red-500" />) : (<HeartIcon className="w-5 h-5 text-gray-700" />)}</button>
                    </div>
                    <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center p-4"><img src={base_image} alt={name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out" /></div>
                    <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-800 text-lg truncate" title={name}>{name}</h3>
                        <p className="text-sm text-gray-500 mb-2 capitalize">{brand}</p>
                        <div className="flex justify-center items-center space-x-2 my-3 h-5">
                            {uniqueColors.slice(0, 4).map((hex, index) => (
                                <span key={index} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: hex }} />
                            ))}
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                            {startingPrice !== null ? `Rs. ${startingPrice.toLocaleString()}` : 'View Details'}
                        </p>
                    </div>
                </div>
            </Link>
            
            <QuickViewModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                product={{...product, startingPrice}} 
            />
        </>
    );
};

export default HoverTranslateCard;
