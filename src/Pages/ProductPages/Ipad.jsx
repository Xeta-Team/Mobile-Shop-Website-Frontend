import React, { useEffect, useState } from 'react';
import { Loader, Twitter, Facebook, Instagram } from 'lucide-react'; 
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import appleIntelligence from '../../assest/mac.png';
import Footer from '../../Components/Footer.jsx';
import apiClient from '../../api/axiosConfig.js';


// --- Components for the iPad Page ---

const IpadHero = () => {
    return (
        <section className="h-[70vh] md:h-screen bg-black text-white text-center flex flex-col justify-center items-center overflow-hidden relative">
            <video 
                src="https://www.apple.com/105/media/us/ipad-pro/2024/97d7edf3-aac0-443d-9731-38d40ff50951/anim/hero/large_2x.mp4" 
                alt="iPad Pro animation"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                playsInline
            />
            
            <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-12 md:py-24">
                <h2 className="text-xl md:text-5xl font-semibold">iPad Pro</h2>
                <img 
                    src={appleIntelligence} 
                    alt="Built for Apple Intelligence" 
                    className="h-24 md:h-48" 
                />
            </div>
        </section>
    );
};



const IpadList = () => {
    const [ipads, setIpads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const controller = new AbortController(); 
        const fetchIpads = async () => {
            setIsLoading(true);
            setError(null);
            try {

                const { data } = await apiClient.get(`/products/category/iPad`, {
                    signal: controller.signal
                });
                setIpads(data);

            } catch (err) {
                if (err.name === 'CanceledError') {
                    console.log("Request aborted");
                    return;
                }
                console.error("Failed to fetch iPads:", err);
                setError("Could not load iPads. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchIpads();

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
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">All iPad Models</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 justify-items-center">
                    {ipads.map(ipad => (
                        <HoverTranslateCard key={ipad._id} card={ipad} />
                    ))}
                </div>
            </div>
        </section>
    );
};


const IpadPage = () => {
    return (
        <div className="bg-white"> 
            <TopNavigationBar />
            <main> 
                <IpadHero />
                <IpadList />
            </main>
            <Footer />
        </div>
    );
};

export default IpadPage;