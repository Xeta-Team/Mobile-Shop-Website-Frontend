import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import Footer from '../../Components/Footer.jsx';
import apiClient from '../../api/axiosConfig.js';


const AccessoriesHero = () => {
    return (
        <section 
            className="h-[60vh] bg-gray-900 text-white text-center flex flex-col justify-center items-center overflow-hidden relative"
            style={{ backgroundImage: `url('https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            <div className="relative z-10 p-4"> {/* Added padding for small screens */}
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Essential Accessories</h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200">
                    Everything you need to power up, protect, and get the most out of your devices.
                </p>
            </div>
        </section>
    );
};

// --- Component to Fetch and Display the List of Accessories ---
const AccessoriesList = () => {
    const [accessories, setAccessories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 
    const accessoryCategories = [
        'Power & Charging',
        'Headphone',
        'Accessories (Protection & Add-ons)',
        'Connectivity / Storage'
    ];

    useEffect(() => {
        const controller = new AbortController(); // For cleanup
        const signal = controller.signal;

        const fetchAccessories = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // --- PERFORMANCE FIX ---
                // Instead of fetching ALL products, we fetch only the
                // categories we need in parallel. This is much faster.
                
                const fetchPromises = accessoryCategories.map(category =>
                    apiClient.get(`/products/category/${encodeURIComponent(category)}`, { signal })
                );

                const results = await Promise.allSettled(fetchPromises);

                const allAccessories = [];
                results.forEach(result => {
                    if (result.status === 'fulfilled' && result.value.data) {
                        allAccessories.push(...result.value.data); // Add products from this category
                    } else if (result.status === 'rejected') {
                        console.error("A category fetch failed:", result.reason);
                    }
                });
                
                setAccessories(allAccessories);

            } catch (err) {
                if (err.name === 'CanceledError') {
                    console.log("Request aborted");
                    return;
                }
                console.error("Failed to fetch accessories:", err);
                setError("Could not load accessories. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccessories();

        // Cleanup function
        return () => {
            controller.abort();
        };
    }, []); 

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="w-12 h-12 animate-spin text-black" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-20 bg-white">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    
    if (accessories.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-xl font-semibold">No Accessories Found</h3>
                <p className="text-gray-500">Please check back later.</p>
            </div>
        )
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 justify-items-center">
                    {accessories.map(item => (
                        <HoverTranslateCard key={item._id} card={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- The Main Component for the Accessories Page ---
const AccessoriesPage = () => {
    return (
        <div className="bg-white">
            <TopNavigationBar />
            <main> 
                <AccessoriesHero />
                <AccessoriesList />
            </main>
            <Footer />
        </div>
    );
};

export default AccessoriesPage;