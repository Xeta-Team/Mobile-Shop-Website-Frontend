import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { Twitter, Facebook, Instagram, ArrowRight, ShieldCheck, Truck, MessageSquare } from 'lucide-react';
import HomeCarousel from "../Components/Carousels/HomeCarousel";
import SliderCard from "../Components/Carousels/SliderCards";
import TopNavigationBar from "../Components/TopNavigationBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import Footer from "../Components/Footer";


const GlobalStyles = () => (
    <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css');
        .slick-prev:before, .slick-next:before { color: black !important; }
    `}</style>
);

/**
 * HeroSection Component
 * @description Creates the main hero banner with a background video and animated text.
 */
const HeroSection = ({onShopNowClick}) => {
    const videoRef = useRef(null);
    const [playCount, setPlayCount] = useState(0);

    const handleVideoEnd = () => {
        setPlayCount(currentCount => currentCount + 1);
    };

    useEffect(() => {
        const videoElement = videoRef.current;
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
                onEnded={handleVideoEnd}
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
                <button 
                    onClick={onShopNowClick}
                    className="hero-button mt-8 bg-white text-black font-semibold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                    Shop Now
                </button>
            </div>
        </section>
    );
};

/**
 * FeaturedCategories Component
 * @description Displays a grid of animated, *clickable* product category cards.
 */
const FeaturedCategories = () => {
    const categories = [
        { name: "iPhones", image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", to: "/mobile-phones" },
        { name: "Tablets", image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", to: "/ipad" },
        { name: "Laptops", image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", to: "/mac" },
        { name: "Watches", image: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", to: "/watch" },
    ];

    return (
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Shop by Category</h2>
            <p className="text-gray-600 mb-10">Explore our wide range of products.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {categories.map((cat, index) => (
                    <a href={cat.to} key={index} aria-label={`Shop for ${cat.name}`}>
                        <div
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
                                {/* The "forward key" icon you mentioned is here */}
                                <div className="flex items-center text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <span>Shop Now</span>
                                    <ArrowRight size={16} className="ml-1" />
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};


const SpecialDealsSection = () => {
    return (
        <div className="relative rounded-2xl overflow-hidden text-white p-8 md:p-12 flex items-center min-h-[400px] bg-gray-800">
            <img src="https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Deal background" />
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
 * WhyChooseUs Component
 * @description Highlights key selling points like guarantees, shipping, and support.
 */
const WhyChooseUs = () => {
    const features = [
        { icon: <ShieldCheck size={40} className="text-blue-500" />, title: "Quality Guaranteed", description: "All our devices undergo rigorous testing to ensure they meet the highest standards." },
        { icon: <Truck size={40} className="text-blue-500" />, title: "Fast & Free Shipping", description: "Get your new device delivered to your doorstep quickly and securely, at no extra cost." },
        { icon: <MessageSquare size={40} className="text-blue-500" />, title: "24/7 Customer Support", description: "Our dedicated support team is here to help you with any questions, anytime." }
    ];

    return (
        <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Shop With Us?</h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">We are committed to providing you with the best products and services.</p>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center p-6 rounded-lg transition-all duration-300 hover:bg-gray-100">
                        <div className="mb-4 bg-blue-100 p-4 rounded-full">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-500 text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


/**
 * Main Home Component
 * @description Orchestrates the homepage layout, data fetching, and animations.
 */
const Home = () => {
    // Separate states for each carousel for a more dynamic page
    const [latestPhones, setLatestPhones] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [preOwnedIphones, setPreOwnedIphones] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const sectionsRef = useRef([]);

    const handleShopNowClick = () =>{
        if(sectionsRef.current[2]){
            sectionsRef.current[2].scrollIntoView({ behavior: 'smooth'});
        }
    };

    useEffect(() => {
        // Fetch all homepage data in parallel
        const fetchAllHomeData = async () => {
            try {
                const [latestRes, bestSellersRes, iphonesRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/products/latestPhones'),
                    axios.get('http://localhost:3001/api/products'), 
                    axios.get('http://localhost:3001/api/products/category/iPhone') 
                ]);

                setLatestPhones(latestRes.data.firstFiveDevices);
                setBestSellers(bestSellersRes.data.products);
                setPreOwnedIphones(iphonesRes.data);

            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAllHomeData();
    }, []); 

    useEffect(() => {
        if (isLoading) return;

        // Animate the hero section
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
        tl.fromTo(".hero-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, delay: 0.2 })
            .fromTo(".hero-subtitle", { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, "-=0.7")
            .fromTo(".hero-button", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 }, "-=0.8");

        // Set up Intersection Observer for scroll-in animations
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
            <GlobalStyles />
            <TopNavigationBar />
            <HeroSection onShopNowClick={handleShopNowClick}/>

            <main className="py-16 px-4 md:px-8 overflow-hidden">

                <section ref={(el) => (sectionsRef.current[1] = el)}>
                    {!isLoading && <HomeCarousel slides={preOwnedIphones} title="Pre-Owned iPhones" />}
                </section>

                {/* Section 3: Add margin-top */}
                <section ref={(el) => (sectionsRef.current[2] = el)} className="category-container mt-20 md:mt-24">
                    <FeaturedCategories />
                </section>

                {/* Section 4: Add margin-top */}
                <section ref={(el) => (sectionsRef.current[3] = el)} className="mt-20 md:mt-24">
                    {!isLoading && <HomeCarousel slides={latestPhones} title="New Arrivals" />}
                </section>

                {/* Section 5: Add margin-top */}
                <section ref={(el) => (sectionsRef.current[4] = el)} className="mt-20 md:mt-24">
                    <SpecialDealsSection />
                </section>
                
                {/* Section 6: Add margin-top */}
                <section ref={(el) => (sectionsRef.current[5] = el)} className="mt-20 md:mt-24">
                    <WhyChooseUs />
                </section>

                {/* Section 7: Add margin-top */}
                <section ref={(el) => (sectionsRef.current[6] = el)} className="mt-20 md:mt-24">
                    {!isLoading && <HomeCarousel slides={bestSellers} title="Best Sellers" />}
                </section>
            </main>
            
            <Footer />
        </div>
    );
};

export default Home;