import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Link is not used, but kept it
import { Loader, Twitter, Facebook, Instagram } from 'lucide-react'; // Social icons not used, but kept
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
// axios is not used directly, but apiClient uses it
import axios from 'axios';
import Footer from '../../Components/Footer.jsx';
import apiClient from '../../api/axiosConfig.js';

// --- Components for the AirPods Page ---

/**
 * Hero section for the AirPods page with a video background.
 */
const AirpodHero = () => {
    return (
        //
        // --- RESPONSIVE TWEAK ---
        // Changed h-screen to h-[70vh] on mobile (default) and h-screen
        // on medium screens and up (md:).
        // 100vh on mobile is too tall and hides the content.
        //
        <section className="h-[70vh] md:h-screen bg-black text-black text-center flex flex-col justify-center items-center overflow-hidden relative">
            <video 
                src="https://www.apple.com/105/media/us/airpods-pro/2025/7acffb13-4adb-40b1-9393-8f1c99bc6c90/anim/hero/large.mp4" 
                alt="AirPods Pro animation"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                playsInline
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                <div className="flex-grow flex flex-col justify-center items-center">
                    {/* These text sizes are already responsive (md:) */}
                    <h2 className="text-4xl md:text-6xl font-semibold tracking-wider">AirPods Pro</h2>
                    <h1 className="text-2xl md:text-4xl font-bold my-2 text-black ">
                        The sound of intelligence.
                    </h1>
                </div>
            </div>
        </section>
    );
};


const AirpodList = () => {
    const [airpods, setAirpods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(null); 

    useEffect(() => {
        const controller = new AbortController(); // For cleanup
        const fetchAirpods = async () => {
            setIsLoading(true);
            setError(null);
            try {
                
                const { data } = await apiClient.get(`/products/category/Headphone`, {
                    signal: controller.signal
                });
                
                setAirpods(data);

            } catch (err) {
                if (err.name === 'CanceledError') {
                    console.log("Request aborted");
                    return;
                }
                console.error("Failed to fetch airpods:", err);
                setError("Could not load AirPods. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAirpods();

        // Cleanup function
        return () => {
            controller.abort();
        };
    }, []);

    


    if (isLoading) {
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
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">All AirPods Models</h2>
                {/*
                // --- YOUR REQUEST ---
                // Changed grid-cols-1 to grid-cols-2 to show 2 cards
                // per row on mobile by default.
                //
                // Kept sm:grid-cols-2 so it stays at 2 columns for small screens,
                // then grows for lg: and xl:
                */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 justify-items-center">
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
        // Changed to bg-white so the AirpodList bg-white blends seamlessly
        <div className="bg-white">
            <TopNavigationBar />
            <main> {/* Wrapped in <main> for better semantics */}
                <AirpodHero />
                <AirpodList />
            </main>
            <Footer />
        </div>
    );
};

export default AirpodsPage;