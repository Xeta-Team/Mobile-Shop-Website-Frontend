import React, { useMemo } from 'react';
import { Tag } from 'lucide-react';

const BrandFilterSidebar = ({ products, selectedBrand, onSelectBrand }) => {
    // useMemo will only recalculate the unique brands when the products list changes
    const brands = useMemo(() => {
        const allBrands = products.map(p => p.brand);
        // Using a Set to automatically handle uniqueness
        return [...new Set(allBrands)];
    }, [products]);

    return (
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag size={20} />
                    Filter by Brand
                </h3>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => onSelectBrand(null)} // Click to clear the filter
                            className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition ${
                                selectedBrand === null
                                    ? 'bg-black text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            All Brands
                        </button>
                    </li>
                    {brands.map(brand => (
                        <li key={brand}>
                            <button
                                onClick={() => onSelectBrand(brand)}
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition ${
                                    selectedBrand === brand
                                        ? 'bg-black text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {brand}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default BrandFilterSidebar;