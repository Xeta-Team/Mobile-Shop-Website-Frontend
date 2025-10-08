import React, { useState, useEffect, Fragment, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Trash2, AlertTriangle, Loader, Inbox, ChevronDown, ChevronRight, Package, CheckCircle, Pencil } from 'lucide-react';

// StatusBadge component remains the same
function StatusBadge({ count }) {
    if (count > 0) {
        return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={14} />In Stock</span>;
    }
    return <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><Package size={14} />No Variants</span>;
}

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openProductIds, setOpenProductIds] = useState(new Set());

    const API_BASE_URL = 'http://localhost:3001';

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let tempProducts = products;

        // Filter by category first
        if (selectedCategory) {
            tempProducts = tempProducts.filter(product => product.category === selectedCategory);
        }

        // Then filter by search term
        const lowercasedFilter = searchTerm.toLowerCase();
        if (lowercasedFilter) {
            tempProducts = tempProducts.filter(product => {
                const nameMatch = product.name?.toLowerCase().includes(lowercasedFilter);
                const variantMatch = product.variants.some(variant =>
                    variant.sku?.toLowerCase().includes(lowercasedFilter) ||
                    variant.colorName?.toLowerCase().includes(lowercasedFilter) ||
                    variant.storage?.toLowerCase().includes(lowercasedFilter)
                );
                return nameMatch || variantMatch;
            });
        }
        
        setFilteredProducts(tempProducts);

    }, [searchTerm, selectedCategory, products]);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products/`);
            if (response.data && Array.isArray(response.data.products)) {
                const validProducts = response.data.products.filter(p => p.name);
                setProducts(validProducts);
                setFilteredProducts(validProducts);
            } else {
                throw new Error("Received data is not in the expected format.");
            }
        } catch (err) {
            setError('Failed to fetch products. Please try again.');
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const uniqueCategories = useMemo(() => {
        const categories = new Set(products.map(p => p.category));
        return ["", ...categories]; // Add an empty option for "All"
    }, [products]);

    const toggleProductVariants = (productId) => {
        setOpenProductIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const handleDeleteProduct = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}" and all its variants? This action cannot be undone.`)) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Authentication error. Please log in again.");
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                await axios.delete(`${API_BASE_URL}/api/products/${productId}`, config);
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
                setError(error.response?.data?.message || 'Failed to delete product.');
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Product Inventory</h1>
                <p className="text-gray-600 mt-1">Manage all products and their variants.</p>
            </header>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, SKU, color..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full sm:w-48 pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Categories</option>
                            {uniqueCategories.slice(1).map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {isLoading && <div className="flex justify-center items-center p-10"><Loader className="animate-spin text-indigo-600" size={32} /></div>}
                {error && <div className="p-4 my-4 rounded-lg flex items-center gap-3 bg-red-100 text-red-800"><AlertTriangle size={20} /><span>{error}</span></div>}
                
                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 w-10"></th>
                                    <th scope="col" className="px-6 py-3">Product Name</th>
                                    <th scope="col" className="px-6 py-3">Brand</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3 text-center">Status</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <Fragment key={product._id}>
                                        <tr className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <button onClick={() => toggleProductVariants(product._id)} className="text-gray-500 hover:text-gray-800 disabled:opacity-50" disabled={!product.variants || product.variants.length === 0}>
                                                    {openProductIds.has(product._id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 capitalize">{product.name || '[No Name]'}</td>
                                            <td className="px-6 py-4">{product.brand || '—'}</td>
                                            <td className="px-6 py-4">{product.category || '—'}</td>
                                            <td className="px-6 py-4 text-center"><StatusBadge count={product.variants?.length || 0} /></td>
                                            
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center gap-4">
                                                    <Link to={`/edit-product/${product._id}`} className="text-gray-500 hover:text-indigo-600">
                                                        <Pencil size={18} />
                                                    </Link>
                                                    <button className="text-gray-500 hover:text-red-600" onClick={() => handleDeleteProduct(product._id, product.name)}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {openProductIds.has(product._id) && product.variants && product.variants.length > 0 && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="6" className="p-0">
                                                    <div className="p-4">
                                                        <h4 className="font-semibold text-xs uppercase text-gray-600 mb-2 pl-2">Variants ({product.variants.length})</h4>
                                                        <table className="w-full bg-white rounded-md shadow-inner">
                                                            <thead className="bg-gray-200 text-xs">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left">SKU</th>
                                                                    <th className="px-4 py-2 text-left">Color</th>
                                                                    <th className="px-4 py-2 text-left">Storage</th>
                                                                    <th className="px-4 py-2 text-left">Condition</th>
                                                                    <th className="px-4 py-2 text-right">Price</th>
                                                                    <th className="px-4 py-2 text-right">Stock</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {product.variants.map(variant => (
                                                                    <tr key={variant.sku} className="border-b last:border-0">
                                                                        <td className="px-4 py-3 font-mono text-xs">{variant.sku}</td>
                                                                        <td className="px-4 py-3 flex items-center gap-2">
                                                                            <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: variant.colorHex }}></span>
                                                                            <span>{variant.colorName}</span>
                                                                        </td>
                                                                        <td className="px-4 py-3">{variant.storage || '—'}</td>
                                                                        <td className="px-4 py-3">{variant.condition}</td>
                                                                        <td className="px-4 py-3 text-right font-medium">LKR {variant.price.toLocaleString()}</td>
                                                                        <td className="px-4 py-3 text-right">{variant.stock_quantity}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!isLoading && !error && filteredProducts.length === 0 && (
                    <div className="text-center p-10">
                        <Inbox className="mx-auto text-gray-400" size={48} />
                        <h3 className="mt-4 text-lg font-semibold text-gray-800">No Products Found</h3>
                        <p className="text-gray-500">Your search did not match any products, or your inventory is empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
}