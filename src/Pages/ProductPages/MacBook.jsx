import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Twitter, Facebook, Instagram } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import axios from 'axios';
import shopLogoWhite from '../../assest/wlogo.png';
import appleIntelligence from '../../assest/mac.png';
import Footer from '../../Components/Footer.jsx';


// --- Components for the MacBook Page ---

/**
 * Hero section for the MacBook page with a pinned video background.
 */
const MacbookHero = () => {
    return (
        <section className="sticky top-0 h-screen bg-black text-white text-center flex flex-col justify-start items-center overflow-hidden pt-24">
            <video 
                src="https://www.apple.com/105/media/us/macbook-pro/2024/00a46e4c-adb6-4301-aa38-917d219bff07/anim/welcome-hero/large_2x.mp4" 
                alt="MacBook Pro animation"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="relative z-10 flex flex-col items-center gap-60">
                <h1 className="text-xl md:text-;3xl font-semibold mb-4">MacBook Pro</h1>
                <img 
                    src={appleIntelligence} 
                    alt="Built for Apple Intelligence" 
                    className="h-1 md:h-80 animate-pulse"
                />
                
            </div>
        </section>
    );
};

/**
 * A section to list all available MacBooks using the HoverTranslateCard component.
 */
const MacbookList = () => {
    const [macbooks, setMacbooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMacbooks = async () => {
            try {
                const { data } = await axios.get('http://localhost:3001/api/products');
                // Filter for products in the 'Tablet/Laptop' category
                if (data && data.products) {
                    const macbookProducts = data.products.filter(p => p.category ===  'Mac');
                    setMacbooks(macbookProducts);
                }
            } catch (error) {
                console.error("Failed to fetch MacBooks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMacbooks();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="w-12 h-12 animate-spin text-black" />
            </div>
        );
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">All MacBook Models</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {macbooks.map(mac => (
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
            <div className="relative">
                <MacbookHero />
                <div className="relative z-10 bg-gray-50">
                    <MacbookList />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default MacbookPage;

