
import React, {useState,useEffect} from "react";

export default function ProductListpage(){

    const[isLoading, setIsLoading] = useState(true);
    const[filteredProducts, setFilteredProducts] = useState([]);

    useEffect(
        ()=>{
            fetchProducts();
        },[]
    )


    const fetchProducts = async()=>{
        try{
            const apiUrl = "http://localhost:3001/api/products";
            const response = await fetch(apiUrl);
            setFilteredProducts(response.data);
            


        }
    }

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
                           )}     
                    </tbody> 
                </table>

            </div>
        </div>
    )
}