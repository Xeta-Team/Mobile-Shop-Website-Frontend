import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MoreVertical, Edit, Trash2, AlertTriangle, X, Sparkles, Loader, Inbox } from 'lucide-react';
import ProductRow from '../../../../Components/Table/ProductRow';
import apiClient from '../../../../../../Mobile-Shop-Website-Backend-main/controllers/axiosConfig';
import Toast from '../../../../Components/Toast/Toast';
import { toast } from 'react-toastify';


// --- Main Page Component ---
export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredProductId, setHoveredProductId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [adCopyProduct, setAdCopyProduct] = useState(null);
    const [generatedAdCopy, setGeneratedAdCopy] = useState('');
    const [isGeneratingAd, setIsGeneratingAd] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        
        const filtered = products.filter(product =>
            product.productName?.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const fetchProducts = async () => {
            try {
                const apiUrl = 'http://localhost:3001/api/products';
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
    
    const handleSaveEdit = (editedProduct) => {
        setProducts(prevProducts => prevProducts.map(p => 
            p._id === editedProduct._id ? { ...p, ...editedProduct.data } : p
        ));
        setProductToEdit(null);
    };

    const handleDeleteRequest = (product) => {
        setProductToDelete(product);
        setOpenMenuId(null);
    };

    const confirmDelete = async() => {
        console.log(productToDelete._id);

        try{
            const deleteResponse = await apiClient.delete(`/products/${productToDelete._id}`);
            console.log(deleteResponse);

            toast.success(deleteResponse.data.message)
            setIsLoading(true)
            fetchProducts()
            setProductToDelete(null)

            
            
        }catch(error){
            toast.error(error?.response?.data)
            
        }
        
        // if (productToDelete) {
        //     setProducts(prevProducts => prevProducts.filter(p => p._id !== productToDelete._id));
        //     setProductToDelete(null);
        // }
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
                           <tr><td colSpan="6" className="text-center py-16"><Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto" /></td></tr>
                        ) : error ? (
                             <tr><td colSpan="6" className="text-center py-16 text-red-500"><div className="flex flex-col items-center gap-2"><AlertTriangle className="w-12 h-12" /><h3 className="text-lg font-semibold">Error Loading Products</h3><p>{error}</p></div></td></tr>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <React.Fragment key={product._id}>
                                    <ProductRow
                                        product={product} 
                                        onMouseEnter={() => handleMouseEnter(product._id)}
                                        onMouseLeave={handleMouseLeave}
                                        isMenuOpen={openMenuId === product._id}
                                        onMenuToggle={() => handleMenuToggle(product._id)}
                                        onEdit={() => handleEditRequest(product)}
                                        onDelete={() => handleDeleteRequest(product)}
                                        onGenerateAdCopy={() => handleGenerateAdCopy(product)}
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
            {productToEdit && <EditProductModal product={productToEdit} onSave={handleSaveEdit} onClose={() => setProductToEdit(null)} />}
            {productToDelete && <ConfirmationModal productName={productToDelete.productName} onConfirm={confirmDelete} onCancel={() => setProductToDelete(null)}/>}
            {adCopyProduct && <AdCopyModal product={adCopyProduct} adCopy={generatedAdCopy} isLoading={isGeneratingAd} onClose={() => setAdCopyProduct(null)}/>}
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

function EditProductModal({ product, onSave, onClose }) {
    const [editData, setEditData] = useState({
        productName: product.productName,
        productPrice: product.productPrice,
        colorName: product.variants?.[0]?.colorName || '',
        colorHex: product.variants?.[0]?.colorHex || '#000000',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave({ _id: product._id, data: editData });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md m-4 border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Product Name</label>
                        <input type="text" name="productName" value={editData.productName} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-gray-700">Price (LKR)</label>
                        <input type="number" name="productPrice" value={editData.productPrice} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-100">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500">Save Changes</button>
                </div>
            </div>
        </div>
    );
}


function ConfirmationModal({ productName, onConfirm, onCancel }) {
     return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 p-4 animate-fade-in backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Content container */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the modal from closing it
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={28} />
          </div>

          {/* Modal Header */}
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            Confirm Deletion
          </h2>

          {/* Modal Body Text */}
          <p className="my-3 text-gray-600">
            Are you sure you want to delete{' '}
            <strong className="font-semibold text-gray-800">{productName}</strong>?
            <br />
            This action cannot be undone.
          </p>
        </div>

        {/* Modal Footer (Action Buttons) */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onCancel}
            className="w-full rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Yes, Delete
          </button>
        </div>

        {/* Optional: Close button for accessibility */}
        <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
        >
            <X size={24} />
        </button>
      </div>
    </div>
  );
}
