import React, { useEffect, useState, useMemo } from 'react';
import { Loader } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import Footer from '../../Components/Footer.jsx';
import BrandFilterSidebar from '../../Components/BrandFilterSidebar.jsx';
import apiClient from '../../api/axiosConfig.js';

// --- The Main Component for the Pre-Owned Devices Page ---
const PreOwnedPage = () => {
    const [allPreOwnedPhones, setAllPreOwnedPhones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Added for error handling
    const [selectedBrand, setSelectedBrand] = useState(null); // State for the brand filter

    useEffect(() => {
        const controller = new AbortController(); // For cleanup
        const signal = controller.signal;

        const fetchPreOwnedDevices = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // --- PERFORMANCE FIX ---
                // 1. Fetch only the phone categories in parallel
                const phonePromise = apiClient.get(`/products/category/Mobile Phone`, { signal });
                const iphonePromise = apiClient.get(`/products/category/iPhone`, { signal });

                const results = await Promise.allSettled([phonePromise, iphonePromise]);

                const allPhoneProducts = [];
                results.forEach(result => {
                    if (result.status === 'fulfilled' && result.value.data) {
                        allPhoneProducts.push(...result.value.data);
                    }
                });

                // --- 2. Apply your 'Used' variant logic ---
                const usedPhones = [];
                allPhoneProducts.forEach(phone => {
                    const usedVariants = phone.variants.filter(v => v.condition === 'Used');
                    
                    if (usedVariants.length > 0) {

                        usedPhones.push({
                            ...phone,
                            variants: usedVariants
                        });
                    }
                });
                
                setAllPreOwnedPhones(usedPhones);

            } catch (err) {
                if (err.name === 'CanceledError') {
                    console.log("Request aborted");
                    return;
                }
                console.error("Failed to fetch pre-owned devices:", err);
                setError("Could not load pre-owned devices. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreOwnedDevices();

        // Cleanup function
        return () => {
            controller.abort();
        };
    }, []);

    // This memoized value will filter the phones by brand when a brand is selected
    const filteredPhones = useMemo(() => {
        if (!selectedBrand) {
            return allPreOwnedPhones; // Return all if no brand is selected
        }
        return allPreOwnedPhones.filter(phone => phone.brand === selectedBrand);
    }, [allPreOwnedPhones, selectedBrand]);

    if (isLoading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <TopNavigationBar />
                <div className="flex justify-center items-center py-40">
                    <Loader className="w-12 h-12 animate-spin text-black" />
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
        <div className="bg-gray-50">
            <TopNavigationBar />

            <main className="container mx-auto px-4 py-8 md:py-16">
                <div className="mb-8 text-center">
 
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Pre-Owned Devices</h1>
                    <p className="mt-3 text-base md:text-lg text-gray-600">
                        Quality, certified pre-owned mobile phones at incredible prices.
                    </p>
                </div>

                {/* This flex-col md:flex-row is already mobile-responsive */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Sidebar for Brand Filtering */}
                    <BrandFilterSidebar 
                        products={allPreOwnedPhones}
                        selectedBrand={selectedBrand}
                        onSelectBrand={setSelectedBrand}
                    />

                    <div className="flex-1">
                        {filteredPhones.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                {filteredPhones.map(phone => (
                                    <HoverTranslateCard key={phone._id} card={phone} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl">
                                <h3 className="text-xl font-semibold">No Pre-Owned Phones Found</h3>
                                <p className="text-gray-500">There are no used devices matching your current filter. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PreOwnedPage;