import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MoreVertical, Smartphone, Edit, Trash2, AlertTriangle, X, Sparkles, Loader, Inbox } from 'lucide-react';

// --- Gemini API Key ---
// IMPORTANT: For the AI feature to work, you must get a free API key from Google AI Studio
// and paste it here.
const GEMINI_API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE"; // <--- PASTE YOUR GEMINI API KEY HERE

// --- Main Page Component ---
export default function ProductListPage() {
    // State to hold all products fetched from the backend
    const [products, setProducts] = useState([]);
    // State for products filtered by the search term
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // State for UI interactions
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredProductName, setHoveredProductName] = useState(null);
    const [openMenuName, setOpenMenuName] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    
    // State for Gemini API feature
    const [adCopyProduct, setAdCopyProduct] = useState(null);
    const [generatedAdCopy, setGeneratedAdCopy] = useState('');
    const [isGeneratingAd, setIsGeneratingAd] = useState(false);

    // Effect to fetch products from the backend when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // In a real app, replace this with your actual API endpoint
                const apiUrl = 'http://localhost:3001/api/products/all';
                const response = await axios.get(apiUrl);
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Could not load products. Please ensure the backend server is running.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Effect to filter products when search term changes
    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);
    
    let leaveTimeout;
    const handleMouseEnter = (productName) => {
        clearTimeout(leaveTimeout);
        setHoveredProductName(productName);
    };
    const handleMouseLeave = () => {
        leaveTimeout = setTimeout(() => {
            setHoveredProductName(null);
        }, 100);
    };

    const handleMenuToggle = (productName) => {
        setOpenMenuName(prevName => (prevName === productName ? null : productName));
    };


    const handleEditRequest = (product) => {
        setProductToEdit(product);
        setOpenMenuName(null);
    }

    // --- CORRECTED SAVE FUNCTION ---
    const handleSaveEdit = async (updatedProductPayload) => {
        if (!productToEdit) return;

        setIsLoading(true);
        setError(null); 
        try {
            // 1. Use the product ID in the URL, not the name.
            const response = await fetch(`http://localhost:3001/api/products/update/${productToEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                // 2. Send a body that matches the Mongoose schema fields.
                body: JSON.stringify({
                    productName: updatedProductPayload.data.name,
                    productPrice: updatedProductPayload.data.price,
                    // Assuming we only edit the first color variant for simplicity
                    variants: [{ 
                        colorName: updatedProductPayload.data.colorName, 
                        hex: updatedProductPayload.data.colorHex 
                    }]
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update the product. Please try again.');
            }   
            const updatedResult = await response.json();
            
            // 3. Update state correctly using the product ID.
            // We also re-format the backend response to match the frontend state structure.
            setProducts(prevProducts => prevProducts.map(p => {
                if (p.id === updatedResult.product._id) {
                    const updated = updatedResult.product;
                    return {
                        id: updated._id,
                        name: updated.productName,
                        category: updated.productCategory,
                        colors: updated.variants.map(v => ({ name: v.colorName, hex: v.colorHex })),
                        status: updated.variants.some(v => v.stock > 0) ? "Available" : "Out of Stock",
                        price: updated.productPrice,
                        imageUrl: updated.mainImage || (updated.images && updated.images[0]),
                        description: updated.productDescription
                    };
                }
                return p;
            }));
            setProductToEdit(null);
        } catch (err) {
            console.error("Update product error:", err);
            setError(err.message || 'An error occurred while updating the product.');
        }
        finally {
            setIsLoading(false);
            setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
        }
    };
    
    const handleDeleteRequest = (product) => {
        setProductToDelete(product);
        setOpenMenuName(null);
    };

    // --- CORRECTED DELETE FUNCTION ---
    const confirmDelete = async() => {
        if(!productToDelete) return;

        setIsLoading(true);
        setError(null);
        try {
            // 1. Removed extra space from URL.
            const response = await fetch(`http://localhost:3001/api/products/delete/${productToDelete.id}`, {
                method: 'DELETE',
            });
            
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete the product. Please try again.');
            }
            // 2. Filter state using the correct product ID.
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));

            }
            catch(err){
                console.error("Delete product error:", err);
                setError(err.message || 'An error occurred while deleting the product.');
            }
            finally{
                setIsLoading(false);
                setProductToDelete(null);
                setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
        }
    }

    const handleGenerateAdCopy = async (product) => {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
            alert("Please add your Gemini API key to the ProductListPage.jsx file.");
            return;
        }
        setAdCopyProduct(product);
        setIsGeneratingAd(true);
        setGeneratedAdCopy('');
        setOpenMenuName(null);

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
        const prompt = `Generate a short, exciting social media ad post for the following product for a shop in Sri Lanka. Be persuasive, use emojis, and end with a strong call to action. Keep it under 280 characters.

        Product Details:
        - Name: ${product.name}
        - Category: ${product.category}
        - Price: LKR ${product.price.toLocaleString()}
        - Description: ${product.description}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            setGeneratedAdCopy(generatedText || "Sorry, couldn't generate ad copy.");
        } catch (error) {
            console.error("Gemini API error:", error);
            setGeneratedAdCopy("An error occurred while generating the ad copy.");
        } finally {
            setIsGeneratingAd(false);
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 mb-4 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
                <div className="relative w-full sm:max-w-xs">
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-10 pr-4 bg-slate-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-sm text-gray-500 font-semibold border-y bg-slate-50">
                            <th className="p-4">Product</th>
                            <th className="p-4 hidden md:table-cell">Category</th>
                            <th className="p-4 hidden lg:table-cell">Color</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 w-12 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-16">
                                    <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                                </td>
                            </tr>
                        ) : error ? (
                             <tr>
                                <td colSpan="6" className="text-center py-16 text-red-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertTriangle className="w-12 h-12" />
                                        <h3 className="text-lg font-semibold">Error Loading Products</h3>
                                        <p>{error}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <React.Fragment key={product.id}>
                                    <ProductRow 
                                        product={product} 
                                        onMouseEnter={() => handleMouseEnter(product.name)}
                                        onMouseLeave={handleMouseLeave}
                                        isMenuOpen={openMenuName === product.name}
                                        onMenuToggle={() => handleMenuToggle(product.name)}
                                        onEdit={() => handleEditRequest(product)}
                                        onDelete={() => handleDeleteRequest(product)}
                                        onGenerateAdCopy={() => handleGenerateAdCopy(product)}
                                    />
                                    {hoveredProductName === product.name && (
                                        <ProductHoverRow 
                                            product={product}
                                            onMouseEnter={() => handleMouseEnter(product.name)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-16 text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Inbox className="w-12 h-12 text-gray-400" />
                                        <h3 className="text-lg font-semibold">No products found</h3>
                                        <p>Your search for "{searchTerm}" did not match any products.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {productToEdit && <EditProductModal product={productToEdit} onSave={handleSaveEdit} onClose={() => setProductToEdit(null)} />}
            {productToDelete && <ConfirmationModal productName={productToDelete.name} onConfirm={confirmDelete} onCancel={() => setProductToDelete(null)}/>}
            {adCopyProduct && <AdCopyModal product={adCopyProduct} adCopy={generatedAdCopy} isLoading={isGeneratingAd} onClose={() => setAdCopyProduct(null)}/>}
        </div>
    );
}

// --- Sub-components ---

function ProductRow({ product, onMouseEnter, onMouseLeave, isMenuOpen, onMenuToggle, onEdit, onDelete, onGenerateAdCopy }) {
    const statusStyles = { Available: 'bg-green-100 text-green-800', 'Out of Stock': 'bg-red-100 text-red-800' };
    
    return (
        <tr className="border-b border-slate-100" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                    <span className="font-semibold text-gray-800">{product.name}</span>
                </div>
            </td>
            <td className="p-4 text-gray-600 hidden md:table-cell">{product.category}</td>
            <td className="p-4 text-gray-600 hidden lg:table-cell">
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: product.colors[0]?.hex }}></span>
                    <span>{product.colors[0]?.name}</span>
                </div>
            </td>
            <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[product.status]}`}>{product.status}</span>
            </td>
            <td className="p-4 font-semibold text-gray-800">LKR {product.price.toLocaleString()}</td>
            <td className="p-4 text-gray-400 relative text-center">
                <button onClick={onMenuToggle} className="p-1 rounded-full hover:bg-gray-200"><MoreVertical className="w-5 h-5" /></button>
                {isMenuOpen && (
                    <div className="absolute z-20 right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border">
                        <button onClick={onGenerateAdCopy} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50">
                            <Sparkles className="w-4 h-4" /> Suggest Ad Copy
                        </button>
                        <button onClick={onEdit} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-slate-100">
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={onDelete} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

function ProductHoverRow({ product, onMouseEnter, onMouseLeave }) {
    return (
        <tr className="bg-slate-50/50" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <td colSpan="6" className="p-0">
                <div className="p-4 animate-fade-in-down">
                    <div className="flex gap-4 items-center">
                        <img src={product.imageUrl} alt={product.name} className="w-24 h-24 rounded-lg object-cover" />
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                            <p className="text-indigo-600 font-semibold">LKR {product.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
}

function EditProductModal({ product, onSave, onClose }) {
    // A predefined list of categories for the dropdown menu
    const categories = [
        'Mobile Phone', 
        'Tablet', 
        'Charger', 
        'Phone Case', 
        'Headphones', 
        'Wearable'
    ];

    // Initialize state with empty/default values first to prevent errors.
    const [editData, setEditData] = useState({
        name: '',
        description: '',
        category: categories[0],
        storage: '',
        stock: 0,
        price: 0,
        colorName: '',
        colorHex: '#000000',
    });

    // State for handling the new image file and its preview URL
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Use useEffect to safely populate the form state when the 'product' prop is available.
    useEffect(() => {
        if (product) {
            setEditData({
                name: product.name || '',
                description: product.description || '',
                category: product.category || categories[0],
                storage: product.storage || '',
                stock: product.stock || 0,
                price: product.price || 0,
                colorName: product.colors?.[0]?.name || '',
                colorHex: product.colors?.[0]?.hex || '#000000',
            });
            // Set initial image preview from product data
            setImagePreview(product.imageUrl || '');
            setImageFile(null); // Clear any previously selected file
        }
    }, [product]);

    // This generic handler updates state for any input change, including files.
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files[0]) {
            const file = files[0];
            setImageFile(file); // Store the file object
            setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview
        } else {
            setEditData(prev => ({ ...prev, [name]: value }));
        }
    };

    // The handleSave function now sends the entire updated editData object
    const handleSave = () => {
        // Pass the original ID, updated text data, and the new image file if one exists.
        onSave({ id: product.id, data: editData, newImage: imageFile });
        onClose(); // Close modal after saving
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-lg m-4 border max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                
                {/* The form now contains all the new fields and is scrollable */}
                <div className="space-y-4 overflow-y-auto pr-2">
                    {/* New Image Upload Field */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Product Image</label>
                        <div className="mt-2 flex items-center gap-4">
                            <img
                                src={imagePreview || 'https://placehold.co/100x100/f3f4f6/9ca3af?text=No+Image'}
                                alt="Product Preview"
                                className="w-24 h-24 rounded-lg object-cover border"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                                <span>Change Image</span>
                                <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Product Name</label>
                        <input type="text" name="name" value={editData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea name="description" value={editData.description} onChange={handleChange} rows="3" placeholder="Enter a brief product description..." className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select name="category" value={editData.category} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none">
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Storage and Stock Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Storage Size</label>
                            <input type="text" name="storage" placeholder="e.g., 256GB" value={editData.storage} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Stock Amount</label>
                            <input type="number" name="stock" value={editData.stock} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                           <label className="text-sm font-semibold text-gray-700">Color Name</label>
                           <input type="text" name="colorName" value={editData.colorName} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                           <label className="text-sm font-semibold text-gray-700">Color</label>
                           <input type="color" name="colorHex" value={editData.colorHex} onChange={handleChange} className="mt-1 w-full h-10 p-1 border rounded-md" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Price (LKR)</label>
                        <input type="number" name="price" value={editData.price} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-100 transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
}

function ConfirmationModal({ productName, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md m-4 border">
                <div className="flex items-start gap-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-0 text-center sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Are you sure you want to delete <span className="font-bold">{productName}</span>? This action cannot be undone.</p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:w-auto sm:text-sm" onClick={onConfirm}>Delete</button>
                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

function AdCopyModal({ product, adCopy, isLoading, onClose }) {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        // This method is more robust for different environments than navigator.clipboard
        const textArea = document.createElement("textarea");
        textArea.value = adCopy;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        document.body.removeChild(textArea);
    };

    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-lg m-4 border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">✨ AI Ad Copy for <span className="text-indigo-600">{product.name}</span></h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg min-h-[150px] text-gray-700 whitespace-pre-wrap border">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full"><Loader className="w-8 h-8 animate-spin text-indigo-600" /></div>
                    ) : ( adCopy )}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={handleCopy} disabled={isLoading || !adCopy} className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:bg-indigo-300">
                        {isCopied ? 'Copied!' : 'Copy Text'}
                    </button>
                </div>
            </div>
        </div>
    );
}


// Simple keyframes for the fade-in animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in-down {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
.animate-fade-in {
    animation: fade-in 0.2s ease-out forwards;
}
.animate-fade-in-down {
    animation: fade-in-down 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);
