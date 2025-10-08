import React, { useEffect, useState, useMemo } from 'react';
import { Loader } from 'lucide-react';
import axios from 'axios';

import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import Footer from '../../Components/Footer.jsx';
import BrandFilterSidebar from '../../Components/BrandFilterSidebar.jsx';

// --- The Main Component for the Pre-Owned Devices Page ---
const PreOwnedPage = () => {
    const [allPreOwnedPhones, setAllPreOwnedPhones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState(null); // State for the brand filter

    useEffect(() => {
        const fetchPreOwnedDevices = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get('http://localhost:3001/api/products');
                
                if (data && data.products) {
                    const usedPhones = [];
                    // First, filter for products that are mobile phones
                    const phoneProducts = data.products.filter(p => 
                        p.category === 'Mobile Phone' || p.category === 'iPhone'
                    );

                    // Second, find which of these phones have 'Used' variants
                    phoneProducts.forEach(phone => {
                        const usedVariants = phone.variants.filter(v => v.condition === 'Used');
                        
                        // If a phone has at least one 'Used' variant, we include it
                        if (usedVariants.length > 0) {
                            // We create a new product object that ONLY contains the used variants
                            usedPhones.push({
                                ...phone,
                                variants: usedVariants
                            });
                        }
                    });
                    
                    setAllPreOwnedPhones(usedPhones);
                }
            } catch (error) {
                console.error("Failed to fetch pre-owned devices:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreOwnedDevices();
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

    return (
        <div className="bg-gray-50">
            <TopNavigationBar />
            
            <main className="container mx-auto px-4 py-12 md:py-16">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Pre-Owned Devices</h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Quality, certified pre-owned mobile phones at incredible prices.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Sidebar for Brand Filtering */}
                    <BrandFilterSidebar 
                        products={allPreOwnedPhones}
                        selectedBrand={selectedBrand}
                        onSelectBrand={setSelectedBrand}
                    />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredPhones.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
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