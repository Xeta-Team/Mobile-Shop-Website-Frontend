import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import axios from 'axios';
import Footer from '../../Components/Footer.jsx';


// --- Components for the iPhone Page ---

const IphoneHero = () => {
    return (
        <section className="bg-black text-white text-center py-6 md:py-12">
            <p className="text-lg text-orange-500 font-semibold">New</p>
            <h1 className="text-4xl md:text-6xl font-bold mt-2">iPhone 17 Pro</h1>
            <p className="text-xl md:text-2xl mt-4">Heat-forged aluminum unibody design for exceptional pro capability.</p>
            <div className="mt-6">
            </div>
            <div className="mt-8 px-4 py-6">
                <video 
                    src="https://www.apple.com/105/media/us/iphone-17-pro/2025/704d4474-8e63-4ce7-9917-bb47b1ca4ba0/anim/hero/large.mp4" 
                    alt="iPhone 17 Pro animation"
                    className="mx-auto max-w-auto h-100"
                    autoPlay
                    muted
                    playsInline
                />
            </div>
        </section>
    );
};
/**
 * A section to list all available iPhones using the HoverTranslateCard component.
 */
const IphoneList = () => {
    const [iphones, setIphones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIphones = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                // Filter for products in the 'Mobile Phone' category
                const iphoneProducts = response.data.filter(p => p.productCategory === 'Mobile Phone');
                setIphones(iphoneProducts);
            } catch (error) {
                console.error("Failed to fetch iPhones:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIphones();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="w-12 h-12 animate-spin text-black" />
            </div>
        );
    }

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">All iPhone Models</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {iphones.map(phone => (
                        <HoverTranslateCard key={phone._id} card={phone} />
                    ))}
                </div>
            </div>
        </section>
    );
};


/**
 * The main component for the iPhone page.
 */
const IphonePage = () => {
    return (
        <div className="bg-white">
            <TopNavigationBar />
            <IphoneHero />
            <IphoneList />
            <Footer/>
        </div>
    );
};

export default IphonePage;

