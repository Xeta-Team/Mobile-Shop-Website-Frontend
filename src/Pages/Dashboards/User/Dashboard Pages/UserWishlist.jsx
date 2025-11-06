import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, AlertCircle, HeartCrack, ShoppingCart, Trash2 } from 'lucide-react';
import apiClient from '../../../../../../Mobile-Shop-Website-Backend/controllers/axiosConfig.js';
import { addToCart } from '../../../../Actions/CartActions.js';
import { toast } from 'react-hot-toast'; 

// Helper to find the minimum price among variants
const getMinPrice = (variants) => {
    if (!variants || variants.length === 0) return 0;
    const min = Math.min(...variants.map(v => v.price));
    return min;
};

const WishlistItemCard = ({ product, onRemove, onAddToCart }) => {
    const minPrice = getMinPrice(product.variants);

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden group transition-all hover:shadow-lg">
            <div className="relative">
                <img src={product.base_image} alt={product.name} className="w-full h-48 object-cover" />
                <button 
                    onClick={() => onRemove(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white/70 rounded-full text-gray-500 hover:bg-red-500 hover:text-white transition-colors"
                    aria-label="Remove from wishlist"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-bold text-gray-900">
                        <span className="text-xs font-normal text-gray-500">From </span>
                        LKR {minPrice.toLocaleString()}
                    </p>
                    <button 
                        onClick={() => onAddToCart(product)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function UserWishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWishlist = async () => {
        try {
            const { data } = await apiClient.get('/users/wishlist');
            setWishlistItems(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch wishlist.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        // Optimistic UI update: remove item from state immediately
        setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
        try {
            await apiClient.delete(`/users/wishlist/${productId}`);
            toast.success('Item removed from wishlist.');
        } catch (err) {
            toast.error('Failed to remove item. Please try again.');
            // If the API call fails, refetch the original list to revert the change
            fetchWishlist();
        }
    };

    const handleAddToCart = (product) => {
        // This adds the first available variant to the cart.
        // For a more advanced UX, you could open a modal here to select a variant.
        const firstVariant = product.variants?.[0];
        if (!firstVariant) {
            toast.error('This product has no variants available.');
            return;
        }

        const itemToAdd = {
            productId: product._id,
            sku: firstVariant.sku,
            name: `${product.name} - ${firstVariant.colorName || ''} - ${firstVariant.storage || ''}`.trim(),
            price: firstVariant.price,
            image: firstVariant.image_url || product.base_image,
        };
        addToCart(itemToAdd, 1); // From your CartActions
        toast.success(`${product.name} added to cart!`);
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
                <h2 className="text-xl font-semibold text-red-600">Could Not Load Wishlist</h2>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <p className="text-sm text-gray-500 mt-1">Your collection of favorite items.</p>
                </header>

                {wishlistItems.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-lg shadow-md border border-gray-200">
                        <HeartCrack className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Your Wishlist is Empty</h2>
                        <p className="text-gray-500 my-4">Looks like you haven't added any favorites yet.</p>
                        <Link to="/" className="inline-block bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-700 transition">
                            Discover Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems.map(product => (
                            <WishlistItemCard 
                                key={product._id} 
                                product={product} 
                                onRemove={handleRemove}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}