import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import TopNavigationBar from '../../Components/TopNavigationBar.jsx';
import HoverTranslateCard from '../../Components/Cards/HoverTranslateCard.jsx';
import axios from 'axios';
import Footer from '../../Components/Footer.jsx';

// --- Hero Component for the Accessories Page ---
const AccessoriesHero = () => {
    return (
        <section 
            className="h-[60vh] bg-gray-900 text-white text-center flex flex-col justify-center items-center overflow-hidden relative"
            style={{ backgroundImage: `url('https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            <div className="relative z-10">
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

    // These are the categories that will be displayed on this page
    const accessoryCategories = [
        'Power & Charging',
        'Headphone',
        'Accessories (Protection & Add-ons)',
        'Connectivity / Storage'
    ];

    useEffect(() => {
        const fetchAccessories = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get('http://localhost:3001/api/products');
                
                if (data && data.products) {
                    const accessoryProducts = data.products.filter(p => accessoryCategories.includes(p.category));
                    setAccessories(accessoryProducts);
                }
            } catch (error) {
                console.error("Failed to fetch accessories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccessories();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="w-12 h-12 animate-spin text-black" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
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
            <AccessoriesHero />
            <AccessoriesList />
            <Footer />
        </div>
    );
};

export default AccessoriesPage;