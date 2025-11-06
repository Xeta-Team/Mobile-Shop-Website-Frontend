import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Twitter, Facebook, Instagram } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import axios from 'axios';
import appleIntelligence from '../../assest/mac.png';
import Footer from '../../Components/Footer.jsx';


// --- Components for the iPad Page ---

const IpadHero = () => {
    return (
        <section className="h-screen bg-black text-white text-center flex flex-col justify-center items-center overflow-hidden relative">
            <video 
                src="https://www.apple.com/105/media/us/ipad-pro/2024/97d7edf3-aac0-443d-9731-38d40ff50951/anim/hero/large_2x.mp4" 
                alt="iPad Pro animation"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                playsInline
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-35">
                <div className="flex-grow flex flex-col justify-center items-center">
                    <h2 className="text-xl md:text-5xl font-semibold">iPad Pro</h2>
                </div>
                <img 
                    src={appleIntelligence} 
                    alt="Built for Apple Intelligence" 
                    className="h-10 md:h-80 mb-12"
                />
            </div>
        </section>
    );
};


/**
 * A section to list all available iPads using the HoverTranslateCard component.
 */
const IpadList = () => {
    const [ipads, setIpads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIpads = async () => {
            setIsLoading(true);
            try {
                // Fetch the data object from the API
                const { data } = await axios.get(`http://localhost:3001/api/products`);

                // 1. Access the nested 'products' array from data
                // 2. Filter by the correct field name 'category'
                if (data && data.products) {
                    const ipadProducts = data.products.filter(p => p.category === 'iPad');
                    setIpads(ipadProducts);
                }
            } catch (error) {
                console.error("Failed to fetch iPads:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIpads();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="w-12 h-12 animate-spin text-black" />
            </div>
        );
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">All iPad Models</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {ipads.map(ipad => (
                        <HoverTranslateCard key={ipad._id} card={ipad} />
                    ))}
                </div>
            </div>
        </section>
    );
};

/**
 * The main component for the iPad page.
 */
const IpadPage = () => {
    return (
        <div className="bg-black">
            <TopNavigationBar />
            <IpadHero />
            <IpadList />
            <Footer />
        </div>
    );
};

export default IpadPage;
