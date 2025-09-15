import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { Phone, Tablet, Laptop, Watch, Headphones, Apple, Gamepad2, Tv, ShoppingCart, Twitter, Facebook, Instagram, ArrowRight } from 'lucide-react';

// Existing component imports from your project
import HomeCarousel from "../Components/Carousels/HomeCarousel";
import SliderCard from "../Components/Carousels/SliderCards";
import TopNavigationBar from "../Components/TopNavigationBar";
import shopLogoWhite from '../assest/wlogo.png'; // Assuming this is the white logo

// --- NEW COMPONENTS DEFINED WITHIN Home.jsx ---

/**
 * HeroSection Component
 * @description Creates the main hero banner with a background video and animated text.
 */
const HeroSection = () => {
    const videoRef = useRef(null);
    const [playCount, setPlayCount] = useState(0);

    const handleVideoEnd = () => {
        setPlayCount(currentCount => currentCount + 1);
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        // Replay the video if it has ended but not yet reached the play limit of 3.
        if (videoElement && playCount > 0 && playCount < 3) {
            videoElement.currentTime = 0; // Rewind the video to the start
            videoElement.play();
        }
    }, [playCount]);


    return (
        <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-white overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd} // Handle the video ending
                className="absolute inset-0 w-full h-full object-cover brightness-50"
            >
                <source src="https://www.apple.com//105/media/us/iphone-17-pro/2025/704d4474-8e63-4ce7-9917-bb47b1ca4ba0/anim/camera-hero/large_2x.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="relative z-10 text-center p-4">
                <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    Find Your Next Device
                </h1>
                <p className="hero-subtitle mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200">
                    Unbeatable prices on the latest iPhones, iPads, and Macs. Quality guaranteed.
                </p>
                <button className="hero-button mt-8 bg-white text-black font-semibold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                    Shop Now
                </button>
            </div>
        </section>
    );
};

/**
 * FeaturedCategories Component
 * @description Displays a grid of animated product category cards.
 */
const FeaturedCategories = () => {
    const categories = [
        { name: "Phones", image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
        { name: "Tablets", image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
        { name: "Laptops", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
        { name: "Watches", image: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    ];

    return (
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Shop by Category</h2>
            <p className="text-gray-600 mb-10">Explore our wide range of products.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        className="category-card group relative rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden aspect-[4/5]"
                    >
                        <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="relative z-10 flex flex-col items-start justify-end h-full p-6 text-white">
                           <h3 className="font-bold text-xl md:text-2xl">{cat.name}</h3>
                           <div className="flex items-center text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                               <span>Shop Now</span>
                               <ArrowRight size={16} className="ml-1"/>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * SpecialDealsSection Component
 * @description A promotional section with a large background image and call-to-action.
 */
const SpecialDealsSection = () => {
    return (
        <div className="relative rounded-2xl overflow-hidden text-white p-8 md:p-12 flex items-center min-h-[400px] bg-gray-800">
            <img src="https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Deal background"/>
            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold">MacBook Pro Deals</h2>
                <p className="mt-2 max-w-lg">Power meets portability. Get up to 20% off on select MacBook Pro models this week only.</p>
                <button className="mt-6 bg-white text-black font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition-all duration-300">
                    View Offers
                </button>
            </div>
        </div>
    )
}

/**
 * Footer Component
 * @description The footer for the website.
 */
const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-8 px-8 md:px-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <img src={shopLogoWhite} alt="CellExpress" className="h-12 mb-4" />
                    <p className="text-gray-400 text-sm">Your one-stop shop for the latest mobile devices and accessories.</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-4 tracking-wider">Shop</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><a href="#" className="hover:text-white">iPhones</a></li>
                        <li><a href="#" className="hover:text-white">iPads</a></li>
                        <li><a href="#" className="hover:text-white">MacBooks</a></li>
                        <li><a href="#" className="hover:text-white">Accessories</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4 tracking-wider">Company</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Contact</a></li>
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4 tracking-wider">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                        <a href="#" className="hover:text-white"><Instagram /></a>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} CellExpress. All Rights Reserved.</p>
            </div>
        </footer>
    );
};


/**
 * Main Home Component
 * @description Orchestrates the homepage layout, data fetching, and animations.
 */
const Home = () => {
    const [cardInfo, setCardInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const sectionsRef = useRef([]);

    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                const productRes = await axios.get('http://localhost:3001/api/products/latestPhones');
                setCardInfo(productRes.data.firstFiveDevices);
            } catch (error) {
                console.error("Error fetching slider data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSliderData();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
        tl.fromTo(".hero-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, delay: 0.2 })
          .fromTo(".hero-subtitle", { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, "-=0.7")
          .fromTo(".hero-button", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 }, "-=0.8");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const targetCards = entry.target.querySelectorAll('.category-card');
                        if (targetCards.length > 0) {
                             gsap.to(targetCards, { 
                                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1
                            });
                        } else {
                            gsap.to(entry.target, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        sectionsRef.current.forEach((section) => {
            if (section) {
                if (section.classList.contains('category-container')) {
                     gsap.set(section.querySelectorAll('.category-card'), { opacity: 0, y: 50 });
                } else {
                     gsap.set(section, { opacity: 0, y: 75 });
                }
                observer.observe(section);
            }
        });

        return () => {
            sectionsRef.current.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, [isLoading]);

    return (
        <div className="bg-gray-50 text-black antialiased">
            <TopNavigationBar />
            <HeroSection />

            <main className="py-16 px-4 md:px-8 space-y-20 md:space-y-24 overflow-hidden">
                <section ref={(el) => (sectionsRef.current[0] = el)}>
                    <SliderCard isloading={isLoading}/>
                </section>
                
                <section ref={(el) => (sectionsRef.current[1] = el)}>
                    <HomeCarousel slides={cardInfo} title="Pre-Owned iPhones" isLoading={isLoading}/>
                </section>

                <section ref={(el) => (sectionsRef.current[2] = el)} className="category-container">
                    <FeaturedCategories />
                </section>

                <section ref={(el) => (sectionsRef.current[3] = el)}>
                    <HomeCarousel slides={cardInfo} title="New Arrivals" isLoading={isLoading}/>
                </section>

                <section ref={(el) => (sectionsRef.current[4] = el)}>
                    <SpecialDealsSection />
                </section>

                <section ref={(el) => (sectionsRef.current[5] = el)}>
                    <HomeCarousel slides={cardInfo} title="Best Sellers" isLoading={isLoading}/>
                </section>
            </main>
            
            <Footer />
        </div>
    );
};

export default Home;

