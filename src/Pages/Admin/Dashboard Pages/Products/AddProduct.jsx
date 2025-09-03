import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
// import { createClient } from '@supabase/supabase-js'; // This line is removed to resolve the build error.
import { Smartphone, UploadCloud, CheckCircle, Sparkles, Loader, X, Info, Check, AlertTriangle, Plus } from 'lucide-react';

// --- Supabase Client Setup ---
// NOTE: This component assumes the Supabase client library is loaded globally
// via a script tag in your index.html file, like this:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabaseUrl = 'https://ikmyhzhlesebjdgijzef.supabase.co';
// IMPORTANT: The key you provided was invalid. Please replace the placeholder below
// with the correct 'anon' 'public' key from your Supabase project dashboard.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbXloemhsZXNlYmpkZ2lqemVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzkxOTYsImV4cCI6MjA3MjQxNTE5Nn0.iPLVOeWJ_qGou2rPrvncpfdiBFEJIBPKmgLmX3gC2rw';
// The 'supabase' object is now expected to be on the global 'window' object.
const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;

// --- Helper Components ---

function FormSection({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="space-y-6">{children}</div>
        </div>
    );
}

function InputField({ id, label, error, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
            <input id={id} name={id} {...props} className={`mt-2 w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

function Toast({ notification }) {
    const { show, message, type } = notification;
    if (!show) return null;

    const toastStyles = {
        info: { bg: 'bg-blue-500', icon: <Info /> },
        success: { bg: 'bg-green-500', icon: <Check /> },
        error: { bg: 'bg-red-500', icon: <AlertTriangle /> },
    };
    
    const style = toastStyles[type] || toastStyles.info;

    return (
        <div className={`fixed top-5 right-5 ${style.bg} text-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-down z-50`}>
            {style.icon}
            <p>{message}</p>
        </div>
    );
}


// --- Main App Component ---
export default function AddProduct() {
    // Part 1: State Management
    const [productData, setProductData] = useState({
        productName: '',
        productDescription: '',
        productPrice: '', // Used for simple products
        productStock: '', // Used for simple products
        variants: [], // Holds all variant combinations for complex products
        productCategory: 'Mobile Phone',
    });
    
    const [currentVariant, setCurrentVariant] = useState({
        colorName: '',
        colorHex: '#000000',
        storage: '',
        stock: '',
        price: '' // Price per variant
    });
    
    const [categories, setCategories] = useState([
        'Mobile Phone', 'Tablet', 'Watch', 'Charger & Cables', 'Phone Case', 'Headphones', 'Wearable'
    ]);
    
    const [imageUrls, setImageUrls] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    
    const variantCategories = ['Mobile Phone', 'Watch', 'Tablet'];
    const isVariantProduct = variantCategories.includes(productData.productCategory);

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'info' });
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProductData(prevData => ({
            ...prevData,
            [id]: value
        }));
        if (errors[id]) {
            setErrors(prevErrors => ({ ...prevErrors, [id]: null }));
        }
    };
    
    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setProductData(prevData => ({
            ...prevData,
            productCategory: newCategory,
            variants: [],
            productStock: '',
            productPrice: '',
        }));
        setErrors({});
    };

    const handleSaveNewCategory = () => {
        const trimmedCategory = newCategoryName.trim();
        if (trimmedCategory && !categories.includes(trimmedCategory)) {
            setCategories(prev => [...prev, trimmedCategory]);
            setProductData(prev => ({ ...prev, productCategory: trimmedCategory }));
            setIsCategoryModalOpen(false);
            setNewCategoryName('');
            showToast(`Category "${trimmedCategory}" added!`, 'success');
        } else {
            showToast("Category name must be unique and cannot be empty.", 'error');
        }
    };
    
    const handleVariantInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentVariant(prev => ({ ...prev, [name]: value }));
    };

    const handleAddVariant = () => {
        const { colorName, colorHex, storage, stock, price } = currentVariant;
        if (!colorName.trim() || !storage.trim() || !stock.trim() || parseInt(stock, 10) < 0 || !price.trim() || parseFloat(price) <= 0) {
            showToast('Please fill all variant fields correctly.', 'error');
            return;
        }
        setProductData(prev => ({
            ...prev,
            variants: [...prev.variants, { colorName, colorHex, storage, stock: parseInt(stock, 10), price: parseFloat(price) }]
        }));
        setCurrentVariant({ colorName: '', colorHex: '#000000', storage: '', stock: '', price: '' }); // Reset form
    };

    const handleRemoveVariant = (indexToRemove) => {
        setProductData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, index) => index !== indexToRemove)
        }));
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!productData.productName.trim()) newErrors.productName = "Product name is required.";
        
        if (isVariantProduct) {
            if (productData.variants.length === 0) newErrors.variants = "At least one product variant is required.";
        } else {
            if (!productData.productPrice || parseFloat(productData.productPrice) <= 0) newErrors.productPrice = "Please enter a valid positive price.";
            if (!productData.productStock.trim() || parseInt(productData.productStock, 10) < 0) newErrors.productStock = "Please enter a valid stock quantity.";
        }

        if (imageUrls.length === 0) newErrors.images = "At least one product image is required.";
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showToast('Please fix the errors before submitting.', 'error');
        }
        return Object.keys(newErrors).length === 0;
    };
    
    const sanitizeFilename = (filename) => {
        return filename.replace(/\s/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    };

    const handleImageUpload = useCallback(async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        if (!supabase) {
            showToast("Supabase client is not available.", 'error');
            return;
        }

        if (errors.images) {
            setErrors(prevErrors => ({ ...prevErrors, images: null }));
        }

        setIsUploading(true);

        const uploadPromises = files.map(async (file) => {
            const sanitizedFilename = sanitizeFilename(file.name);
            const filePath = `public/${Date.now()}-${sanitizedFilename}`;
            const { data, error } = await supabase.storage.from('Images').upload(filePath, file);

            if (error) {
                console.error('Supabase upload error:', error);
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(data.path);
            return publicUrl;
        });

        try {
            const newUrls = await Promise.all(uploadPromises);
            setImageUrls(prevUrls => [...prevUrls, ...newUrls]);
            showToast(`${newUrls.length} image(s) uploaded successfully!`, 'success');
        } catch (error) {
            showToast("An error occurred during image upload.", 'error');
        } finally {
            setIsUploading(false);
        }
    }, [errors.images]);

    const handleRemoveImage = (indexToRemove) => {
        setImageUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
        if (mainImageIndex === indexToRemove) {
            setMainImageIndex(0);
        } else if (mainImageIndex > indexToRemove) {
            setMainImageIndex(prevIndex => prevIndex - 1);
        }
    };
    
    const resetForm = () => {
        setProductData({
            productName: '',
            productDescription: '',
            productPrice: '',
            productStock: '',
            variants: [],
            productCategory: 'Mobile Phone',
        });
        setCurrentVariant({ colorName: '', colorHex: '#000000', storage: '', stock: '', price: '' });
        setImageUrls([]);
        setMainImageIndex(0);
        setErrors({});
    };

    const handleGenerateDescription = async () => {
        if (!productData.productName) {
            showToast("Please enter a Product Name first.", 'error');
            return;
        }
        
        setIsGenerating(true);
        setProductData(prev => ({...prev, productDescription: "✨ Generating your product description..."}));

        const apiKey = "AIzaSyDuY3O5NMzXudLtlP0_k68QC2jMVhIhlIs";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const colorNames = [...new Set(productData.variants.map(v => v.colorName))].join(', ');
        const storageOptions = [...new Set(productData.variants.map(v => v.storage))].join(', ');
        
        const prompt = `Write a compelling e-commerce product description for:
        - Product Name: ${productData.productName}
        - Category: ${productData.productCategory}
        - Key Features: Colors - ${colorNames || 'Not specified'}, Storage - ${storageOptions || 'Not specified'}.`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (generatedText) {
                setProductData(prev => ({...prev, productDescription: generatedText}));
                showToast("Description generated successfully!", 'success');
            } else {
                 setProductData(prev => ({...prev, productDescription: ""}));
                 showToast("Could not generate description. Check API key.", 'error');
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            setProductData(prev => ({...prev, productDescription: ""}));
            showToast("An error occurred while generating.", 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        const finalProductData = {
            productName: productData.productName,
            productDescription: productData.productDescription,
            productCategory: productData.productCategory,
            productPrice: isVariantProduct ? (productData.variants[0]?.price || 0) : productData.productPrice, // Use first variant's price or base price
            variants: isVariantProduct ? productData.variants : [{
                colorName: 'N/A', colorHex: '#CCCCCC', storage: 'N/A',
                stock: parseInt(productData.productStock, 10),
                price: parseFloat(productData.productPrice)
            }],
            images: imageUrls,
            mainImage: imageUrls[mainImageIndex] || imageUrls[0] || ''
        };

        const apiUrl = 'http://localhost:3001/api/products/addProduct';

        try {
            await axios.post(apiUrl, finalProductData);
            showToast('Product added successfully!', 'success');
            resetForm();
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred during submission.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const mainPreviewUrl = imageUrls[mainImageIndex] || 'https://placehold.co/600x600/e2e8f0/cbd5e1?text=Main+Image';

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-gray-800">
            <Toast notification={toast} />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Smartphone className="w-8 h-8 text-indigo-600" />
                        Add New Product
                    </h1>
                    <p className="text-gray-600 mt-1">Fill in the details below to add a new item to your inventory.</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <FormSection title="General Information">
                               <InputField id="productName" label="Product Name" value={productData.productName} onChange={handleInputChange} placeholder="e.g., iPhone 15 Pro" error={errors.productName} />
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="productDescription" className="text-sm font-semibold text-gray-700">Description</label>
                                         <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !productData.productName} className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full px-3 py-1 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                                            <Sparkles className="w-3 h-3"/>
                                            {isGenerating ? 'Generating...' : '✨ Generate with AI'}
                                        </button>
                                    </div>
                                    <textarea id="productDescription" value={productData.productDescription} onChange={handleInputChange} rows="6" placeholder="Describe the product features..." className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"></textarea>
                                </div>
                            </FormSection>

                            <FormSection title="Category">
                                <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                                            <input type="radio" name="productCategory" value={category} checked={productData.productCategory === category} onChange={handleCategoryChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                                            <span className="text-gray-800">{category}</span>
                                        </label>
                                    ))}
                                    <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                        + Add New
                                    </button>
                                </div>
                            </FormSection>

                            {isVariantProduct ? (
                                <FormSection title="Product Variants">
                                    <p className="text-sm text-gray-600 -mt-4">Add each unique combination of color, storage, stock, and price.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                        <InputField label="Color Name" name="colorName" value={currentVariant.colorName} onChange={handleVariantInputChange} placeholder="e.g., Deep Purple" />
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700">Color</label>
                                            <input type="color" name="colorHex" value={currentVariant.colorHex} onChange={handleVariantInputChange} className="mt-2 p-1 h-12 w-full rounded-lg cursor-pointer border-gray-300" />
                                        </div>
                                        <InputField label="Storage" name="storage" value={currentVariant.storage} onChange={handleVariantInputChange} placeholder="e.g., 256GB" />
                                        <InputField label="Stock" name="stock" value={currentVariant.stock} onChange={handleVariantInputChange} type="number" placeholder="e.g., 50" />
                                        <InputField label="Price (LKR)" name="price" value={currentVariant.price} onChange={handleVariantInputChange} type="number" placeholder="e.g., 310000" />
                                    </div>
                                    <button type="button" onClick={handleAddVariant} className="mt-4 w-full flex justify-center items-center gap-2 p-3 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
                                        <Plus className="w-5 h-5" /> Add Variant
                                    </button>
                                    {errors.variants && <p className="text-xs text-red-600 mt-2 text-center">{errors.variants}</p>}
                                    
                                    {productData.variants.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {productData.variants.map((variant, index) => (
                                                <div key={index} className="grid grid-cols-5 items-center gap-4 bg-slate-50 p-2 rounded-lg text-sm">
                                                    <div className="flex items-center gap-2 font-semibold col-span-2"><span className="w-5 h-5 rounded-full" style={{ backgroundColor: variant.colorHex }}></span>{variant.colorName}</div>
                                                    <span className="text-gray-600 text-center">{variant.storage}</span>
                                                    <span className="text-gray-800 text-center"><strong>{Number(variant.price).toLocaleString()}</strong> LKR</span>
                                                    <div className="flex items-center justify-between">
                                                      <span className="text-gray-800"><strong>{variant.stock}</strong> units</span>
                                                      <button type="button" onClick={() => handleRemoveVariant(index)} className="p-1 text-gray-400 hover:text-red-500 rounded-full"><X className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FormSection>
                            ) : (
                                <FormSection title="Pricing & Stock">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField id="productPrice" label="Price (LKR)" value={productData.productPrice} onChange={handleInputChange} type="number" placeholder="e.g., 4500.00" error={errors.productPrice} />
                                        <InputField id="productStock" label="Stock Quantity" value={productData.productStock} onChange={handleInputChange} type="number" placeholder="e.g., 200" error={errors.productStock} />
                                    </div>
                                </FormSection>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-1 space-y-4">
                           <FormSection title="Product Images">
                                <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                                    <img src={mainPreviewUrl} alt="Main product preview" className="w-full h-full object-cover transition-all duration-300" />
                                    {isUploading && <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"><Loader className="w-8 h-8 text-white animate-spin" /></div>}
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} onClick={() => setMainImageIndex(index)} className={`group relative cursor-pointer rounded-md overflow-hidden ring-2 ${index === mainImageIndex ? 'ring-indigo-500' : 'ring-transparent hover:ring-indigo-300'}`}>
                                            <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                                            <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }} className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label htmlFor="imageUpload" className={`w-full text-center cursor-pointer bg-white hover:bg-slate-50 text-indigo-700 font-semibold py-3 px-4 rounded-lg border-2 border-dashed border-indigo-200 flex items-center justify-center gap-2 transition-all duration-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <UploadCloud className="w-5 h-5"/><span>{isUploading ? 'Uploading...' : 'Upload Images'}</span>
                                    </label>
                                    <input type="file" id="imageUpload" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                    {errors.images && <p className="text-xs text-red-600 mt-1">{errors.images}</p>}
                                </div>
                             </FormSection>
                        </div>
                    </div>
                    <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end gap-4">
                         <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg text-sm font-semibold border hover:bg-gray-100 w-full sm:w-auto transition-colors">Clear Form</button>
                        <button type="submit" disabled={isSubmitting || isUploading} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2 w-full sm:w-auto disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
                            {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                            <span>{isSubmitting ? 'Submitting...' : 'Add Product'}</span>
                        </button>
                    </div>
                </form>
            </div>
            
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm m-4 border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div>
                            <label htmlFor="newCategoryName" className="text-sm font-semibold text-gray-700 mb-2 block">Category Name</label>
                            <input
                                id="newCategoryName"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="e.g., Smart Watch"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button 
                                type="button"
                                onClick={() => setIsCategoryModalOpen(false)} 
                                className="px-5 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button"
                                onClick={handleSaveNewCategory}
                                className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                            >
                                Add Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

