import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, Facebook, Twitter, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart, buyNow } from '../../Actions/CartActions'; // Assuming this is the correct path

const ProductDetails = ({ product, onVariantChange }) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedStorage, setSelectedStorage] = useState(product?.storageOptions?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    if (!product?.variants || !selectedColor || !selectedStorage) return null;
    return product.variants.find(
      (v) => v.colorName === selectedColor.name && v.storage === selectedStorage
    );
  }, [selectedColor, selectedStorage, product?.variants]);

  const stockStatus = useMemo(() => {
    if (selectedVariant && selectedVariant.stock_quantity > 0) {
      return { inStock: true, message: 'In Stock', available: selectedVariant.stock_quantity };
    }
    return { inStock: false, message: 'Out of Stock', available: 0 };
  }, [selectedVariant]);

  useEffect(() => {
    onVariantChange?.(selectedVariant);
  }, [selectedVariant, onVariantChange]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

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
    navigate('/checkout');
  };

  const handleAddToWishlist = () => toast.success(`${product.name} added to your wishlist!`);
  
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const incrementQuantity = () => setQuantity((prev) => Math.min(stockStatus.available, prev + 1));

  const features = product?.description?.split('\n').filter(f => f.trim() !== '') || [];

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>
      
      <div className="flex items-center gap-4">
        <p className="text-3xl font-medium text-gray-900">
          {selectedVariant ? `LKR ${selectedVariant.price.toLocaleString()}` : 'Unavailable'}
        </p>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            stockStatus.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {stockStatus.message}
        </span>
      </div>

      <ul className="list-disc list-inside text-gray-600 space-y-1.5 text-sm">
        {features.map((feature, index) => <li key={index}>{feature}</li>)}
      </ul>
      
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Storage:</h3>
        <div className="flex flex-wrap gap-2">
          {(product?.storageOptions || []).map((storage) => (
            <button key={storage} onClick={() => setSelectedStorage(storage)}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition ${
                selectedStorage === storage
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }`}>
              {storage}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Color: <span className="font-normal">{selectedColor?.name}</span></h3>
        <div className="flex gap-3">
          {(product?.colors || []).map((color) => (
            <button key={color.name} onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 focus:outline-none ring-2 ring-offset-2 transition ${
                selectedColor?.name === color.name ? 'ring-black' : 'ring-transparent'
              }`} style={{ backgroundColor: color.hex }} title={color.name} />
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 pt-4">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button onClick={decrementQuantity} className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-md"><Minus size={16} /></button>
          <span className="px-4 font-semibold w-12 text-center">{quantity}</span>
          <button onClick={incrementQuantity} disabled={quantity >= stockStatus.available} className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-md disabled:text-gray-300 disabled:cursor-not-allowed"><Plus size={16} /></button>
        </div>
        <button onClick={handleAddToCart} disabled={!stockStatus.inStock} className="bg-black text-white font-bold py-3 px-6 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex-grow sm:flex-grow-0">ADD TO CART</button>
        <button onClick={handleBuyNow} disabled={!stockStatus.inStock} className="bg-gray-200 text-black font-bold py-3 px-6 rounded-md hover:bg-gray-300 transition disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed flex-grow sm:flex-grow-0">BUY NOW</button>
      </div>

      <button onClick={handleAddToWishlist} className="flex items-center gap-2 text-gray-600 hover:text-black transition w-fit">
        <Heart size={16} /> Add to wishlist
      </button>

      <div className="mt-4 pt-6 border-t text-sm text-gray-500 space-y-2">
        <p>SKU: <span className="font-medium text-gray-800">{selectedVariant?.sku || 'N/A'}</span></p>
        <p>Category: <span className="font-medium text-gray-800">{product.category}</span></p>
        <div className="flex items-center gap-2">
            <span>Follow:</span>
            <div className="flex items-center gap-3 text-gray-600">
                <a href="#" className="hover:text-black"><Facebook size={18} /></a>
                <a href="#" className="hover:text-black"><Twitter size={18} /></a>
                <a href="#" className="hover:text-black"><Instagram size={18} /></a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;