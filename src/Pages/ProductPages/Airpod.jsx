import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Twitter, Facebook, Instagram } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import axios from 'axios';
import Footer from '../../Components/Footer.jsx';

// --- Components for the AirPods Page ---

/**
 * Hero section for the AirPods page with a video background.
 */
const AirpodHero = () => {
    return (
        <section className="h-screen bg-black text-black text-center flex flex-col justify-center items-center overflow-hidden relative">
            <video 
                src="https://www.apple.com/105/media/us/airpods-pro/2025/7acffb13-4adb-40b1-9393-8f1c99bc6c90/anim/hero/large.mp4" 
                alt="AirPods Pro animation"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                playsInline
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-">
                <div className="flex-grow flex flex-col justify-center items-center">
                    <h2 className="text-4xl md:text-6xl font-semibold tracking-wider">AirPods Pro</h2>
                    <h1 className="text-2xl md:text-4xl font-bold my-2 text-black ">
                        The sound of intelligence.
                    </h1>
                </div>
            </div>
        </section>
    );
};

/**
 * A section to list all available AirPods using the HoverTranslateCard component.
 */
const AirpodList = () => {
    const [airpods, setAirpods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAirpods = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                // Filter for products in the 'Headphones' category
                const airpodProducts = response.data.filter(p => p.productCategory === 'Headphones');
                setAirpods(airpodProducts);
            } catch (error) {
                console.error("Failed to fetch airpods:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAirpods();
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
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">All AirPods Models</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {airpods.map(airpod => (
                        <HoverTranslateCard key={airpod._id} card={airpod} />
                    ))}
                </div>
            </div>
        </section>
    );
};

/**
 * The main component for the AirPods page.
 */
const AirpodsPage = () => {
    return (
        <div className="bg-black">
            <TopNavigationBar />
            <AirpodHero />
            <AirpodList />
            <Footer />
        </div>
    );
};

export default AirpodsPage;

