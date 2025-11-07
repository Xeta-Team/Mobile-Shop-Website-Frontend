import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Not used, but kept
import { Loader, Twitter, Facebook, Instagram } from 'lucide-react'; // Social icons not used, but kept
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import appleIntelligence from '../../assest/mac.png';
import Footer from '../../Components/Footer.jsx';
import apiClient from '../../api/axiosConfig.js';


// --- Components for the MacBook Page ---
const MacbookHero = () => {
    return (
        <section className="sticky top-0 h-screen bg-black text-white text-center flex flex-col items-center overflow-hidden pt-16 pb-12 md:pt-24 md:pb-24">
            <video 
                src="https://www.apple.com/105/media/us/macbook-pro/2024/00a46e4c-adb6-4301-aa38-917d219bff07/anim/welcome-hero/large_2x.mp4" 
                alt="MacBook Pro animation"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                loop 
                playsInline
            />
            <div className="relative z-10 flex flex-col items-center justify-between h-full">
                <h1 className="text-3xl md:text-5xl font-semibold">MacBook Pro</h1>
                <img 
                    src={appleIntelligence} 
                    alt="Built for Apple Intelligence" 
                    className="h-24 md:h-48 animate-pulse" 
                />
            </div>
        </section>
    );
};


const MacbookList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchMacBooks = async () => {
            try {
                setLoading(true);
                setError(null); 
                
                const response = await apiClient.get(`/products/category/Mac`, {
                    signal: controller.signal // Pass signal to request
                }); 
                
                setProducts(response.data);
            } catch (err) {
                // Don't set error if request was aborted
                if (err.name === 'CanceledError') {
                    console.log("Request aborted");
                    return;
                }
                console.error("Error fetching MacBooks:", err);
                if (err.response && err.response.status === 404) {
                    setError("No MacBook models found.");
                } else {
                    setError("Failed to load MacBooks. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMacBooks();

        // Cleanup function
        return () => {
            controller.abort();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-white">
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

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">All MacBook Models</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 justify-items-center">
                    {products.map(mac => (
                        <HoverTranslateCard key={mac._id} card={mac} />
                    ))}
                </div>
            </div>
        </section>
    );
};


/**
 * The main component for the MacBook page.
 */
const MacbookPage = () => {
    return (
        <div className="bg-white">
            <TopNavigationBar />
            <main className="relative">
                <MacbookHero />
                <div className="relative z-10 bg-white"> 
                    <MacbookList />
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default MacbookPage;