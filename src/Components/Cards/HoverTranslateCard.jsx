import axios from 'axios';
import React, { useState, useMemo, useEffect } from 'react';
import { addToCart, buyNow } from '../../Actions/CartActions';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, HeartIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const getApiClient = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: 'http://localhost:3001/api',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

const QuickViewModal = ({ product, isOpen, onClose, uniqueColors, uniqueStorages, navigate }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(product.startingPrice);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const availableStorages = useMemo(() => {
        if (!selectedColor) return [];
        const storages = new Set();
        product.variants
            .filter(v => v.colorName === selectedColor.name)
            .forEach(v => {
                if (v.storage) storages.add(v.storage);
            });
        return Array.from(storages);
    }, [selectedColor, product.variants]);

    useEffect(() => {
        setSelectedStorage(null);
        setCurrentPrice(product.startingPrice);
        setSelectedVariant(null);
    }, [selectedColor, product.startingPrice]);

    useEffect(() => {
        if (selectedColor && selectedStorage) {
            const variant = product.variants.find(
                v => v.colorName === selectedColor.name && v.storage === selectedStorage
            );
            if (variant) {
                setCurrentPrice(variant.price);
                setSelectedVariant(variant);
            }
        }
    }, [selectedColor, selectedStorage, product.variants]);

    useEffect(() => {
        if (!isOpen) {
            setQuantity(1);
            setSelectedColor(null);
            setSelectedStorage(null);
            setCurrentPrice(product.startingPrice);
            setSelectedVariant(null);
        }
    }, [isOpen, product.startingPrice]);


    const handleAddToCart = () => {
        if (!selectedVariant || !product._id) {
            toast.error('Product data is missing. Cannot add to cart.');
            return;
        }
    
        const itemToAdd = {
            productId: product._id, 
            sku: selectedVariant.sku,
            color: selectedVariant.colorName,
            storage: selectedVariant.storage,
            name: `${product.name}`,
            price: selectedVariant.price,
            image: selectedVariant.image_url || product.base_image,
            quantity: quantity,
        };
    
        addToCart(itemToAdd, quantity);
        toast.success('Item added to cart!');
        onClose(); 
      };
    
      const handleBuyNow = () => {
        if (!selectedVariant || !product._id) {
          toast.error('Please select a valid product variation before proceeding.');
          return;
        }
        const itemToCheckout = {
            productId: product._id, 
            sku: selectedVariant.sku,
            name: `${product.name} - ${selectedVariant.colorName} - ${selectedVariant.storage}`,
            price: selectedVariant.price,
            image: selectedVariant.image_url || product.base_image,
            color: selectedVariant.colorName,
            storage: selectedVariant.storage,
        };
        buyNow(itemToCheckout, quantity);
        onClose();
        navigate('/checkout');
      };

    if (!isOpen) return null;

   
    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }} className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10"><XMarkIcon className="h-6 w-6" /></button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="bg-gray-100 p-8 flex items-center justify-center">
                            <img src={product.base_image} alt={product.name} className="max-h-[350px] object-contain" />
                        </div>
                        
                        <div className="p-8 flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                            <p className="text-2xl font-semibold text-gray-800 my-2">
                                {`Rs. ${currentPrice ? currentPrice.toLocaleString() : 'N/A'}`}
                            </p>

                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Color: <span className="font-semibold">{selectedColor?.name}</span>
                                </h3>
                                <div className="flex items-center space-x-2 mt-2">
                                    {uniqueColors.map((color) => (
                                        <button
                                            key={color.name}
                                            title={color.name}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor?.name === color.name ? 'ring-2 ring-black ring-offset-1' : 'border-gray-200'}`}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Storage: <span className="font-semibold">{selectedStorage}</span>
                                </h3>
                                <div className="flex items-center flex-wrap gap-2 mt-2">
                                    {uniqueStorages.map((storage) => {
                                        const isAvailable = availableStorages.includes(storage);
                                        return (
                                            <button
                                                key={storage}
                                                onClick={() => setSelectedStorage(storage)}
                                                disabled={!isAvailable}
                                                className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                                                    isAvailable 
                                                        ? (selectedStorage === storage ? 'bg-black text-white border-black' : 'hover:bg-gray-100') 
                                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {storage}
                                            </button>
                                        );
                                    })}
                                </div>
                                {!selectedColor && <p className="text-xs text-gray-500 mt-1">Please select a color to see available storages.</p>}
                            </div>

                            <div className="mt-6 flex items-center">
                                <label htmlFor="quantity" className="text-sm font-medium text-gray-900 mr-4">Quantity</label>
                                <div className="flex items-center border rounded-md">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100">-</button>
                                    <span className="px-4 py-1 text-md font-semibold">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100">+</button>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex space-x-4">
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariant}
                                    className="flex-1 bg-black text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCartIcon className="w-5 h-5"/> ADD TO CART
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={!selectedVariant}
                                    className="flex-1 bg-white text-black border border-black font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
                                >
                                    BUY NOW
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body 
    );
};

const HoverTranslateCard = ({ card: product }) => {
    const navigate = useNavigate();
    const { _id, name, base_image, variants = [], brand = "Apple" } = product;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false); 

    const startingPrice = useMemo(() => {
        if (!variants || variants.length === 0) return null;
        return Math.min(...variants.map(v => v.price));
    }, [variants]);
    
    const uniqueColors = useMemo(() => {
        const colors = new Map();
        variants.forEach(v => {
            if (v.colorName && v.colorHex && !colors.has(v.colorName)) {
                colors.set(v.colorName, { name: v.colorName, hex: v.colorHex });
            }
        });
        return Array.from(colors.values());
    }, [variants]);

    const uniqueStorages = useMemo(() => {
        const storages = new Set();
        product.variants?.forEach(v => {
            if (v.storage) storages.add(v.storage);
        });
        return Array.from(storages).sort((a, b) => parseInt(a) - parseInt(b));
    }, [product.variants]);

    const handleQuickViewClick = (e) => { e.preventDefault(); setIsModalOpen(true); };

    const handleWishlistClick = async (e) => {
        e.preventDefault(); 
        const apiClient = getApiClient();
        const newWishlistState = !isInWishlist;
        setIsInWishlist(newWishlistState);
        try {
            if (newWishlistState) {
                await apiClient.post('/users/wishlist', { productId: _id });
                toast.success(`${name} added to wishlist!`);
            } else {
                await apiClient.delete(`/users/wishlist/${_id}`);
                toast.success(`${name} removed from wishlist.`);
            }
        } catch (error) {
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

                    <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center p-4">
                        <img src={base_image} alt={name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out" />
                    </div>
 
                    <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-800 text-lg truncate" title={name}>{name}</h3>
                        <p className="text-sm text-gray-500 mb-2 capitalize">{brand}</p>
                        <div className="flex justify-center items-center space-x-2 my-3 h-5">
                            {uniqueColors.slice(0, 4).map((color, index) => (
                                <span key={index} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }} />
                            ))}
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                            {startingPrice !== null ? `From Rs. ${startingPrice.toLocaleString()}` : 'View Details'}
                        </p>
                    </div>
                </div>
            </Link>

            <QuickViewModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                product={{...product, startingPrice}}
                uniqueColors={uniqueColors}
                uniqueStorages={uniqueStorages}
                navigate={navigate} 
            />
        </>
    );
};

export default HoverTranslateCard;