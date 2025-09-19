import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, MoreVertical, Edit, Trash2, AlertTriangle, X, Loader, Inbox, Plus, UploadCloud, CheckCircle } from 'lucide-react';


const CloseIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

function ProductEditModal({ product, onSave, onClose, showToast }) {
    const [productData, setProductData] = useState({ productName: '', productDescription: '', productCategory: '' });
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setProductData({
                productName: product.productName || '',
                productDescription: product.productDescription || '',
                productCategory: product.productCategory || 'Mobile Phone',
            });
            setVariants(product.variants.map((v, i) => ({ ...v, tempId: i })) || []);
            setImages(product.images || []);
            const mainIndex = product.images?.indexOf(product.mainImage);
            setMainImageIndex(mainIndex > -1 ? mainIndex : 0);
        }
    }, [product]);

    useEffect(() => {
        const handleEscape = (event) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    if (!product) return null;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProductData(prev => ({ ...prev, [id]: value }));
    };

    const handleVariantChange = (index, field, value) => {
        setVariants(prev => prev.map((variant, i) => i === index ? { ...variant, [field]: value } : variant));
    };

    const handleAddVariant = () => {
        const newId = variants.length > 0 ? Math.max(...variants.map(v => v.tempId)) + 1 : 1;
        setVariants([...variants, { tempId: newId, colorName: '', colorHex: '#000000', storage: '', stock: '', price: '' }]);
    };

    const handleRemoveVariant = (tempId) => {
        if (variants.length <= 1) return;
        setVariants(variants.filter(v => v.tempId !== tempId));
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
 
        const newImageUrls = files.map(file => URL.createObjectURL(file));

        await new Promise(resolve => setTimeout(resolve, 1000));

        setImages(prev => [...prev, ...newImageUrls]);
        showToast(`${files.length} image(s) uploaded.`, "success");
        setIsUploading(false);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
        if (mainImageIndex === indexToRemove) {
            setMainImageIndex(0);
        } else if (mainImageIndex > indexToRemove) {
            setMainImageIndex(prev => prev - 1);
        }
    };
    
    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        const finalVariants = variants.map(({ tempId, ...rest }) => rest);
        const mainImage = images[mainImageIndex] || (images.length > 0 ? images[0] : product.mainImage);
        
        const updatedProductData = { 
            ...productData, 
            variants: finalVariants, 
            productPrice: productData.productPrice || (finalVariants[0]?.price || 0),
            images: images,
            mainImage: mainImage
        };

        try {
            const response = await axios.put(`http://localhost:3001/api/products/update/${product._id}`, updatedProductData);
            onSave({ _id: product._id, data: response.data.product });
            showToast("Product saved successfully!", "success");
            onClose();
        } catch (error) {
            if (error.isAxiosError && !error.response) {
                console.warn("Network error during save. Simulating local update for mock data.");
                onSave({ _id: product._id, data: { ...product, ...updatedProductData } });
                showToast("Saved locally (offline mode).", "success");
                onClose();
            } else {
                console.warn("Failed to update product:", error.response?.data?.message || error.message);
                showToast(error.response?.data?.message || "Failed to update product.", "error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['Mobile Phone', 'iPhone', 'Mac', 'Tablet', 'Headphones', 'Accessories', 'Watch'];
    const currentMainImage = images[mainImageIndex] || 'https://placehold.co/400?text=No+Image';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-start p-4 sm:p-6 md:p-10 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"><CloseIcon /></button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="lg:col-span-2 space-y-8">
                           {/* ... General Info, Category, Variants sections ... */}
                            <div className="p-6 bg-gray-50 rounded-xl border">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">General Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                                        <input type="text" id="productName" value={productData.productName} onChange={handleInputChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                                    </div>
                                    <div>
                                        <label htmlFor="productDescription" className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                        <textarea id="productDescription" rows="4" value={productData.productDescription} onChange={handleInputChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-xl border">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Category</h2>
                                <div className="flex flex-wrap gap-x-6 gap-y-3">
                                    {categories.map(cat => (
                                        <div key={cat} className="flex items-center"><input type="radio" id={cat} name="category" value={cat} checked={productData.productCategory === cat} onChange={e => setProductData(p => ({...p, productCategory: e.target.value}))} className="w-4 h-4 text-black focus:ring-black" /><label htmlFor={cat} className="ml-2 text-sm font-medium text-gray-700">{cat}</label></div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-xl border">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Variants</h2>
                                <div className="space-y-3">
                                    {variants.map((variant, index) => (
                                        <div key={variant.tempId} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 rounded-lg bg-white border items-center">
                                            <input type="text" placeholder="Color Name" value={variant.colorName} onChange={e => handleVariantChange(index, 'colorName', e.target.value)} className="sm:col-span-3 w-full px-3 py-1.5 border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black"/>
                                            <input type="color" value={variant.colorHex} onChange={e => handleVariantChange(index, 'colorHex', e.target.value)} className="sm:col-span-1 w-full h-8 rounded-md border-none cursor-pointer bg-white"/>
                                            <input type="text" placeholder="Storage" value={variant.storage} onChange={e => handleVariantChange(index, 'storage', e.target.value)} className="sm:col-span-2 w-full px-3 py-1.5 border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black"/>
                                            <input type="number" placeholder="Stock" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} className="sm:col-span-2 w-full px-3 py-1.5 border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black"/>
                                            <input type="number" placeholder="Price (LKR)" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="sm:col-span-3 w-full px-3 py-1.5 border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black"/>
                                            <div className="sm:col-span-1 flex justify-end">{variants.length > 1 && <button onClick={() => handleRemoveVariant(variant.tempId)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"><TrashIcon /></button>}</div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleAddVariant} className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"><Plus />Add Variant</button>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="p-6 bg-gray-50 rounded-xl border sticky top-0">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Images</h2>
                                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                                    <img src={currentMainImage} alt={product.productName} className="w-full h-full object-cover"/>
                                    {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader className="w-8 h-8 text-white"/></div>}
                                </div>
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {images.map((url, index) => (
                                        <div key={index} onClick={() => setMainImageIndex(index)} className={`group relative cursor-pointer rounded-md overflow-hidden ring-2 ${index === mainImageIndex ? 'ring-black' : 'ring-transparent hover:ring-gray-300'}`}>
                                            <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                                            <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }} className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <label htmlFor="imageUpload" className={`w-full flex justify-center items-center gap-2 py-2.5 border-2 border-dashed border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
                                    <UploadCloud /> {isUploading ? 'Uploading...' : 'Upload Images'}
                                </label>
                                <input type="file" id="imageUpload" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center gap-4 px-8 py-5 bg-gray-50 border-t rounded-b-2xl"><button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100">Cancel</button><button onClick={handleSaveChanges} disabled={isSubmitting || isUploading} className="px-6 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 flex items-center gap-2 disabled:bg-gray-500">{isSubmitting ? <Loader className="w-5 h-5"/> : ''}{isSubmitting ? 'Saving...' : 'Save Changes'}</button></div>
            </div>
        </div>
    );
}

// --- Other Helper Components --- //
function ConfirmationModal({ productName, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm" onClick={onCancel}>
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"><AlertTriangle size={28} /></div>
                    <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                    <p className="my-3 text-gray-600">Are you sure you want to delete <strong className="font-semibold text-gray-800">{productName}</strong>? This action cannot be undone.</p>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    <button onClick={onCancel} className="w-full rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-300">Cancel</button>
                    <button onClick={onConfirm} className="w-full rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">Yes, Delete</button>
                </div>
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
        </div>
    );
}

function ProductHoverRow({ product, onMouseEnter, onMouseLeave }) {
    return (
        <tr className="bg-slate-50/50" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <td colSpan="6" className="p-0">
                <div className="p-4 animate-fade-in-down">
                    <div className="flex gap-4 items-center">
                        <img src={product.mainImage || 'https://placehold.co/96x96'} alt={product.productName || 'Product'} className="w-24 h-24 rounded-lg object-cover" />
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{product.productName}</h3>
                            <p className="text-indigo-600 font-semibold">LKR {(product.productPrice || 0).toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.productDescription}</p>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
}

function ProductRow({ product, onEdit, onDelete, onMouseEnter, onMouseLeave, isMenuOpen, onMenuToggle }) {
    const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    const status = totalStock > 10 ? 'In Stock' : totalStock > 0 ? 'Low Stock' : 'Out of Stock';
    const statusColor = totalStock > 10 ? 'bg-green-100 text-green-800' : totalStock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';

    return (
        <tr className="border-b hover:bg-slate-50 transition-colors duration-200" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <img src={product.mainImage || 'https://placehold.co/64'} alt={product.productName} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                        <p className="font-bold text-gray-900">{product.productName}</p>
                        <p className="text-sm text-gray-500">{product.variants.length} variant(s)</p>
                    </div>
                </div>
            </td>
            <td className="p-4 hidden md:table-cell">{product.productCategory}</td>
            <td className="p-4 hidden lg:table-cell">
                <div className="flex items-center gap-2">
                    {product.variants.slice(0, 3).map((v, i) => <span key={i} className="w-5 h-5 rounded-full border" style={{ backgroundColor: v.colorHex }}></span>)}
                    {product.variants.length > 3 && <span className="text-xs text-gray-500">+{product.variants.length - 3}</span>}
                </div>
            </td>
            <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>{status}</span></td>
            <td className="p-4 font-semibold">LKR {Number(product.productPrice || 0).toLocaleString()}</td>
            <td className="p-4 w-12 text-center">
                <div className="relative">
                    <button onClick={onMenuToggle} className="p-2 rounded-full hover:bg-gray-200"><MoreVertical className="w-5 h-5" /></button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 border">
                            <button onClick={onEdit} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit className="w-4 h-4" /> Edit Product</button>
                            <button onClick={onDelete} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete Product</button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}

function Toast({ message, type, onDismiss }) {
    const styles = {
        success: { bg: 'bg-green-600', icon: <CheckCircle size={20} /> },
        error: { bg: 'bg-red-600', icon: <AlertTriangle size={20} /> },
    };
    const style = styles[type] || styles.error;

    useEffect(() => {
        const timer = setTimeout(onDismiss, 4000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className={`fixed top-5 right-5 ${style.bg} text-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-down z-50`}>
            {style.icon}
            <span>{message}</span>
            <button onClick={onDismiss} className="ml-4 -mr-2 p-1 rounded-full hover:bg-white/20 transition-colors"><X size={18} /></button>
        </div>
    );
}

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isMockData, setIsMockData] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    const [hoveredProductId, setHoveredProductId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const showToast = (message, type = 'error') => setToast({ show: true, message, type });
    const handleDismissToast = () => setToast({ show: false, message: '', type: 'error' });

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsMockData(false);
        try {
            const response = await axios.get('http://localhost:3001/api/products');
            setProducts(response.data);
        } catch (err) {
            console.warn("Backend not reachable. Falling back to mock data. Details:", err.message);
            setError("Could not connect to the backend. Displaying mock data.");
            setIsMockData(true);
            const mockProducts = [
                { _id: "mock1", productName: "Mock iPhone 15 (Offline)", productDescription: "This is a mock product description because the backend seems to be offline.", productCategory: "Mobile Phone", productPrice: 299900, variants: [ { colorName: 'Midnight', colorHex: '#333333', storage: '128GB', stock: 15, price: 299900 }, { colorName: 'Starlight', colorHex: '#F9F3EE', storage: '256GB', stock: 8, price: 329900 } ], images: ["https://placehold.co/400/333333/white?text=Mock1"], mainImage: "https://placehold.co/64x64/333333/white?text=Mock" },
                { _id: "mock2", productName: "Mock MacBook Air (Offline)", productDescription: "This is another mock product. Please check if your backend server is running on localhost:3001.", productCategory: "Mac", productPrice: 450000, variants: [ { colorName: 'Space Gray', colorHex: '#808080', storage: '256GB', stock: 20, price: 450000 } ], images: ["https://placehold.co/400/808080/white?text=Mock2"], mainImage: "https://placehold.co/64x64/808080/white?text=Mock" }
            ];
            setProducts(mockProducts);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = products.filter(product => product && product.productName?.toLowerCase().includes(lowercasedFilter));
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const handleSaveEdit = (editedProduct) => {
        setProducts(prev => prev.map(p => p._id === editedProduct._id ? editedProduct.data : p));
        setProductToEdit(null);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        if (isMockData) {
            setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
            setProductToDelete(null);
            showToast("Mock product deleted.", "success");
            return;
        }
        try {
            await axios.delete(`http://localhost:3001/api/products/delete/${productToDelete._id}`);
            setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
            setProductToDelete(null);
            showToast("Product deleted successfully.", "success");
        } catch (error) {
            console.warn("Failed to delete product:", error.message);
            showToast("Failed to delete product.", "error");
        }
    };
    
    let leaveTimeout;
    const handleMouseEnter = (productId) => {
        clearTimeout(leaveTimeout);
        setHoveredProductId(productId);
    };
    const handleMouseLeave = () => {
        leaveTimeout = setTimeout(() => {
            setHoveredProductId(null);
        }, 100);
    };

    const handleMenuToggle = (productId) => {
        setOpenMenuId(prevId => (prevId === productId ? null : productId));
    };


    const handleEditRequest = (product) => {
        setProductToEdit(product);
        setOpenMenuId(null);
    };
    
    const handleDeleteRequest = (product) => {
        setProductToDelete(product);
        setOpenMenuId(null);
    };

    return (
        <div className="bg-white min-h-screen font-sans">
             {toast.show && <Toast message={toast.message} type={toast.type} onDismiss={handleDismissToast} />}
             <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');body{font-family:'Inter',sans-serif;}@keyframes fadeInScale{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in-scale{animation:fadeInScale .3s ease-out forwards;}.animate-fade-in,.animate-fade-in-down{animation:fadeIn .2s ease-out forwards;}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeInDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in-down{animation:fadeInDown .3s ease-out forwards;}.animate-scale-up{animation:scaleUp .3s ease-out forwards;}@keyframes scaleUp{from{transform:scale(.9)}to{transform:scale(1)}}.animate-spin{animation:spin 1s linear infinite;}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            <div className="p-6">
                {isMockData && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                      <p className="font-bold">Network Error</p>
                      <p>Could not connect to the backend server. Displaying placeholder mock data. Please ensure your local server is running on `http://localhost:3001`.</p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-center p-6 mb-4  gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Product List ({filteredProducts.length})</h2>
                    <div className="relative w-full sm:max-w-xs">
                        <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-x-auto ">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-sm text-gray-500 font-semibold border-b bg-slate-50">
                                <th className="p-4">Product</th><th className="p-4 hidden md:table-cell">Category</th><th className="p-4 hidden lg:table-cell">Colors</th><th className="p-4">Status</th><th className="p-4">Price</th><th className="p-4 w-12 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                               <tr><td colSpan="6" className="text-center py-16"><Loader className="w-12 h-12 text-black animate-spin mx-auto" /></td></tr>
                            ) : error && !isMockData ? (
                                 <tr><td colSpan="6" className="text-center py-16 text-red-500"><div className="flex flex-col items-center gap-2"><AlertTriangle className="w-12 h-12" /><h3 className="text-lg font-semibold">Error Loading Products</h3><p>{error}</p></div></td></tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <React.Fragment key={product._id}>
                                        <ProductRow
                                            product={product}
                                            onEdit={() => handleEditRequest(product)}
                                            onDelete={() => handleDeleteRequest(product)}
                                            onMouseEnter={() => handleMouseEnter(product._id)}
                                            onMouseLeave={handleMouseLeave}
                                            isMenuOpen={openMenuId === product._id}
                                            onMenuToggle={() => handleMenuToggle(product._id)}
                                        />
                                        {hoveredProductId === product._id && (
                                            <ProductHoverRow 
                                                product={product}
                                                onMouseEnter={() => handleMouseEnter(product._id)}
                                                onMouseLeave={handleMouseLeave}
                                            />
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                               <tr><td colSpan="6" className="text-center py-16 text-gray-500"><div className="flex flex-col items-center gap-2"><Inbox className="w-12 h-12 text-gray-400" /><h3 className="text-lg font-semibold">No products found</h3><p>Your search for "{searchTerm}" did not match any products.</p></div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {productToEdit && <ProductEditModal product={productToEdit} onSave={handleSaveEdit} onClose={() => setProductToEdit(null)} showToast={showToast} />}
            {productToDelete && <ConfirmationModal productName={productToDelete.productName} onConfirm={confirmDelete} onCancel={() => setProductToDelete(null)}/>}
        </div>
    );
}

