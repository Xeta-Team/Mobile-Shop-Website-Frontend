import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader, AlertTriangle, Save, Plus, Trash2, X } from 'lucide-react';

export default function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://localhost:3001';

    useEffect(() => {
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
            setProduct(response.data);
        } catch (err) {
            setError('Failed to fetch product data.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchProduct();
}, [id]);


    const handleParentChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVariants = [...product.variants];
        updatedVariants[index] = { ...updatedVariants[index], [name]: value };
        setProduct(prev => ({ ...prev, variants: updatedVariants }));
    };

    const addVariant = () => {
        const newVariant = {
            sku: '', colorName: '', colorHex: '#000000', storage: '', 
            condition: 'New', price: 0, stock_quantity: 0
        };
        setProduct(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
    };

    const removeVariant = (index) => {
        if (window.confirm('Are you sure you want to remove this variant?')) {
            const updatedVariants = product.variants.filter((_, i) => i !== index);
            setProduct(prev => ({ ...prev, variants: updatedVariants }));
        }
    };
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
        // 1. Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Authentication error. Please log in again.");
        }

        // 2. Create the config object with the header
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // The 'product' object from state contains all the latest changes
        await axios.put(`${API_BASE_URL}/api/products/${id}`, product, config);
        navigate('/admin'); // Navigate back to the product list on success
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
        setIsSaving(false);
    }
};

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-indigo-600" size={48} /></div>;
    if (error) return <div className="p-8 text-center text-red-600"><AlertTriangle className="mx-auto mb-2" />{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-gray-600 mt-1">Update details for "{product?.name}" and its variants.</p>
                    </div>
                    <button onClick={() => navigate('/products')} className="p-2 rounded-full hover:bg-gray-200"><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Parent Product Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Product Name" name="name" value={product.name} onChange={handleParentChange} />
                            <InputField label="Brand" name="brand" value={product.brand} onChange={handleParentChange} />
                            <InputField label="Category" name="category" value={product.category} onChange={handleParentChange} />
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Variants</h2>
                            <button type="button" onClick={addVariant} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                <Plus size={16} /> Add Variant
                            </button>
                        </div>
                        <div className="space-y-4">
                            {product.variants.map((variant, index) => (
                                <div key={variant._id || index} className="p-4 border rounded-lg bg-gray-50/50 relative">
                                    <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InputField label="SKU" name="sku" value={variant.sku} onChange={e => handleVariantChange(index, e)} />
                                        <InputField label="Color Name" name="colorName" value={variant.colorName} onChange={e => handleVariantChange(index, e)} />
                                        <InputField label="Storage" name="storage" value={variant.storage} onChange={e => handleVariantChange(index, e)} />
                                        <InputField label="Price (LKR)" name="price" type="number" value={variant.price} onChange={e => handleVariantChange(index, e)} />
                                        <InputField label="Stock" name="stock_quantity" type="number" value={variant.stock_quantity} onChange={e => handleVariantChange(index, e)} />
                                        <InputField label="Condition" name="condition" value={variant.condition} onChange={e => handleVariantChange(index, e)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isSaving} className="px-6 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:bg-green-400">
                            {isSaving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Helper component for form fields
function InputField({ label, ...props }) {
    return (
        <div>
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <input {...props} className="mt-2 w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500" />
        </div>
    );
}