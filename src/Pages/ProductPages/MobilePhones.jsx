import React, { useEffect, useState, useMemo } from 'react';
import { Loader } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import Footer from '../../Components/Footer.jsx';
import BrandFilterSidebar from '../../Components/BrandFilterSidebar.jsx';
import apiClient from '../../api/axiosConfig.js';
import { PuffLoader } from 'react-spinners';

// --- The Main Component for the Mobile Phones Page ---
const MobilePhonesPage = () => {
    const [allPhones, setAllPhones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [selectedBrand, setSelectedBrand] = useState(null); 

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchMobilePhones = async () => {
            setIsLoading(true); 
            setError(null);
            
            try {
                const phonePromise = apiClient.get(`/products/category/Other Phone`, { signal });
                const iphonePromise = apiClient.get(`/products/category/iPhone`, { signal });
                
                const results = await Promise.allSettled([phonePromise, iphonePromise]);

                const allPhoneProducts = [];
                results.forEach(result => {
                    if (result.status === 'fulfilled' && result.value.data) {
                        allPhoneProducts.push(...result.value.data);
                    }
                });
                
                // 🔑 CRITICAL FIX 1: Commit the data to the state
                setAllPhones(allPhoneProducts);
                
                // 🔑 CRITICAL FIX 2: Set loading to false ONLY after the data has been committed
                setIsLoading(false); 

            } catch (err) {
                if (err.name === 'CanceledError') {
                    console.log("Request aborted");
                    return;
                }
                console.error("Failed to fetch mobile phones:", err);
                setError("Could not load phones. Please try again.");
                setIsLoading(false); // Stop loading on error
                
            } 
            // NOTE: The 'finally' block has been removed to enforce the correct order.
        };

        fetchMobilePhones();

        // Cleanup function
        return () => {
            controller.abort();
        };
    }, []);

    // useMemo will filter the phones only when the list or the selected brand changes
    const filteredPhones = useMemo(() => {
        if (!selectedBrand) {
            return allPhones; 
        }
        return allPhones.filter(phone => phone.brand === selectedBrand);
    }, [allPhones, selectedBrand]);

    // --- RENDER LOGIC ---

    if (isLoading) {
        return (
            <div className="bg-gray-50 min-h-screen flex flex-col">
                <TopNavigationBar />
                <div className="flex-grow flex justify-center items-center">
                    <PuffLoader color="#000000" size={80} />
                </div>
                <Footer />
            </div>
        );
    }
    
    // Handle error state
    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <TopNavigationBar />
                <div className="flex justify-center items-center py-40">
                    <p className="text-red-500">{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <TopNavigationBar />

            <main className="container mx-auto px-4 py-8 md:py-16 flex-grow">
                {/* Page Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Mobile Phones</h1>
                    <p className="mt-3 text-base md:text-lg text-gray-600">
                        Discover the latest in mobile technology from the world's leading brands.
                    </p>
                </div>


                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    <BrandFilterSidebar 
                        products={allPhones}
                        selectedBrand={selectedBrand}
                        onSelectBrand={setSelectedBrand}
                    />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredPhones.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                {filteredPhones.map(phone => (
                                    <HoverTranslateCard key={phone._id} card={phone} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl">
                                <h3 className="text-xl font-semibold">No Phones Found</h3>
                                <p className="text-gray-500">There are no products matching your current filter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MobilePhonesPage;