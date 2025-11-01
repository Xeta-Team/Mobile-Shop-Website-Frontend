// File: Mobile-Shop-Website-Frontend/src/Components/Carousels/SliderCards.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import HoverTranslateCard from "../Cards/HoverTranslateCard";

// CSS imports are required for the slider to work
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * A placeholder card component to show while content is loading.
 */
const SkeletonCard = () => (
    <div className="px-3 py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            {/* Image Placeholder */}
            <div className="w-full aspect-square bg-gray-200 animate-pulse"></div>
            <div className="p-4">
                {/* Text Placeholders */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mt-4 animate-pulse"></div>
            </div>
        </div>
    </div>
);


/**
 * The main SliderCards component
 * Fetches 20 featured products and displays them in a single-row carousel.
 * (Re-implemented with a renderContent helper function)
 */
const SliderCards = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const { data } = await axios.get('http://localhost:3001/api/products?limit=20');
                setProducts(data.products);

            } catch (err) {
                console.error("Failed to fetch featured products:", err);
                setError("Could not load products at this time. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const settings = {
        dots: true,
        infinite: products.length > 6, // Loop if more products than 6 slides
        speed: 500,
        slidesToShow: 6, // This ensures it's a single row with 6 items
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3, 
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    // --- REIMPLEMENTATION ---
    // This helper function moves the conditional logic
    // out of the main return statement.
    const renderContent = () => {
        // 1. Loading State
        if (isLoading) {
            return (
                <Slider {...settings}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </Slider>
            );
        }

        // 2. Error State
        if (error) {
            return (
                <div className="text-center text-red-500 py-10 px-4">
                    <h3 className="text-xl font-semibold">Something went wrong</h3>
                    <p>{error}</p>
                </div>
            );
        }

        // 3. Empty State
        if (products.length === 0) {
            return (
                <div className="text-center text-gray-500 py-10">
                    <p>No featured products found.</p>
                </div>
            );
        }

        // 4. Success State
        return (
            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product._id} className="px-3 py-4">
                        <HoverTranslateCard card={product} />
                    </div>
                ))}
            </Slider>
        );
    };
    // --- End Re-implementation ---

    return (
        <div className="slider-container px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
            
            {/* Call the helper function to render the correct content */}
            {renderContent()}
        </div>
    );
};

export default SliderCards;