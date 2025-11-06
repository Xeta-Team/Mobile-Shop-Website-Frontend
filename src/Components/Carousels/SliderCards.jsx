// File: Mobile-Shop-Website-Frontend/src/Components/Carousels/SliderCards.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import HoverTranslateCard from "../Cards/HoverTranslateCard"; // We will use the upgraded card here
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderCards = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // This is the performance fix: fetch only 8 products
                const { data } = await axios.get(`http://localhost:3001/api/products?limit=8`);
                setProducts(data.products);
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            }
        };
        fetchProducts();
    }, []);

    const settings = {
        dots: true,
        infinite: products.length > 4, // Loop only if there are enough cards
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
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

    if (products.length === 0) {
        return <div>Loading featured products...</div>; // Or a skeleton loader
    }

    return (
        <div className="slider-container px-4">
            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product._id} className="px-2">
                        {/* Using the upgraded HoverTranslateCard */}
                        <HoverTranslateCard card={product} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderCards;