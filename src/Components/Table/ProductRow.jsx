import { Search, MoreVertical, Edit, Trash2, AlertTriangle, X, Sparkles, Loader, Inbox } from 'lucide-react';

export default function ProductRow({ product, onMouseEnter, onMouseLeave, isMenuOpen, onMenuToggle, onEdit, onDelete, onGenerateAdCopy }) {
    const status = getProductStatus(product);
    const statusStyles = { Available: 'bg-green-100 text-green-800', 'Out of Stock': 'bg-red-100 text-red-800' };
    
    
    const primaryVariant = product.variants?.[0];
    const colorHex = primaryVariant?.colorHex || '#E5E7EB'; 
    const colorName = primaryVariant?.colorName || 'N/A';

    return (
        <tr className="border-b border-slate-100" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <img src={product.mainImage || 'https://placehold.co/40x40'} alt={product.productName || 'Product'} className="w-10 h-10 rounded-md object-cover" />
                    <span className="font-semibold text-gray-800">{product.productName || 'Unnamed Product'}</span>
                </div>
            </td>
            <td className="p-4 text-gray-600 hidden md:table-cell">{product.productCategory || 'N/A'}</td>
            <td className="p-4 text-gray-600 hidden lg:table-cell">
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: colorHex }}></span>
                    <span>{colorName}</span>
                </div>
            </td>
            <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>
            </td>
            <td className="p-4 font-semibold text-gray-800">LKR {(product.productPrice || 0).toLocaleString()}</td>
            <td className="p-4 text-gray-400 relative text-center">
                <button onClick={onMenuToggle} className="p-1 rounded-full hover:bg-gray-200"><MoreVertical className="w-5 h-5" /></button>
                {isMenuOpen && (
                    <div className="absolute z-20 right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border">
                        <button onClick={onEdit} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-slate-100"><Edit className="w-4 h-4" /> Edit</button>
                        <button onClick={onDelete} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Delete</button>
                    </div>
                )}
            </td>
        </tr>
    );
    function getProductStatus(product) {
        if (product.variants && product.variants.length > 0) {
            const totalStock = product.variants.reduce((acc, variant) => acc + (variant.stock || 0), 0);
            return totalStock > 0 ? 'Available' : 'Out of Stock';
        }
        return (product.productStock || 0) > 0 ? 'Available' : 'Out of Stock';
    }
}


