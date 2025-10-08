import React, { useEffect, useState, useMemo } from 'react';
import { Loader } from 'lucide-react';
import axios from 'axios';

import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import Footer from '../../Components/Footer.jsx';
import BrandFilterSidebar from '../../Components/BrandFilterSidebar.jsx';

// --- The Main Component for the Mobile Phones Page ---
const MobilePhonesPage = () => {
    const [allPhones, setAllPhones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState(null); // State for the filter

    useEffect(() => {
        const fetchMobilePhones = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get('http://localhost:3001/api/products');
                
                if (data && data.products) {
                    // Filter for both 'Mobile Phone' and 'iPhone' categories
                    const phoneProducts = data.products.filter(p => 
                        p.category === 'Mobile Phone' || p.category === 'iPhone'
                    );
                    setAllPhones(phoneProducts);
                }
            } catch (error) {
                console.error("Failed to fetch mobile phones:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMobilePhones();
    }, []);

    // useMemo will filter the phones only when the list or the selected brand changes
    const filteredPhones = useMemo(() => {
        if (!selectedBrand) {
            return allPhones; // If no brand is selected, return all phones
        }
        return allPhones.filter(phone => phone.brand === selectedBrand);
    }, [allPhones, selectedBrand]);

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
            
            {/* The main content area now starts here, without the hero section */}
            <main className="container mx-auto px-4 py-12 md:py-16">
                {/* Page Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Mobile Phones</h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Discover the latest in mobile technology from the world's leading brands.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Sidebar */}
                    <BrandFilterSidebar 
                        products={allPhones}
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