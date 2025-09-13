import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Twitter, Facebook, Instagram } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import axios from 'axios';
import Footer from '../../Components/Footer.jsx';

// --- Components for the Watch Page ---

const WatchHero = () => {
    return (
        <section className="h-screen bg-black text-white text-center flex flex-col justify-center items-center overflow-hidden relative">
            <video 
                src="https://www.apple.com/105/media/us/apple-watch-ultra-3/2025/dabb0ca4-1556-466c-a314-ae3ba2cc088e/anim/hero/large_2x.mp4" 
                alt="Apple Watch Ultra animation"
                className="absolute top-0 left-0 w-full h-full object-cover z-0 "
                autoPlay
                muted
                playsInline
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="flex-grow flex flex-col justify-center items-center">
                    <h2 className="text-2xl md:text-4xl font-semibold tracking-wider">WATCH</h2>
                    <p className="text-red-500 text-lg font-semibold tracking-widest">ULTRA 2</p>
                    <h1 className="text-4xl md:text-7xl font-bold my-2">
                        Next level adventure.
                    </h1>
                </div>
            </div>
        </section>
    );
};

const WatchList = () => {
    const [watches, setWatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWatches = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                const watchProducts = response.data.filter(p => p.productCategory === 'Watch');
                setWatches(watchProducts);
            } catch (error) {
                console.error("Failed to fetch watches:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWatches();
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
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">All Watch Models</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {watches.map(watch => (
                        <HoverTranslateCard key={watch._id} card={watch} />
                    ))}
                </div>
            </div>
        </section>
    );
};



/**
 * The main component for the Watch page.
 */
const WatchPage = () => {
    return (
        <div className="bg-black">
            <TopNavigationBar />
            <WatchHero />
            <WatchList />
            <Footer />
        </div>
    );
};

export default WatchPage;

