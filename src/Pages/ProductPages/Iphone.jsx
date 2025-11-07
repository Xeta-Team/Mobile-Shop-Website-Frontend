import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import TopNavigationBar from "../../Components/TopNavigationBar.jsx";
import HoverTranslateCard from "../../Components/Cards/HoverTranslateCard.jsx";
import Footer from "../../Components/Footer.jsx";
import apiClient from "../../api/axiosConfig.js";


const IphoneHero = () => {
  return (
    <section className="bg-black text-white text-center py-8 md:py-12 overflow-hidden">
      <p className="text-lg text-orange-500 font-semibold">New</p>
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mt-2">
        iPhone 17 Pro
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mt-4 max-w-3xl mx-auto px-4">
        Heat-forged aluminum unibody design for exceptional pro capability.
      </p>
      <div className="mt-6"></div>
      <div className="mt-8 px-4 py-6">
        <video
          src="https://www.apple.com/105/media/us/iphone-17-pro/2025/704d4474-8e63-4ce7-9917-bb47b1ca4ba0/anim/hero/large.mp4"
          alt="iPhone 17 Pro animation"
          className="mx-auto w-full max-w-3xl h-auto"
          autoPlay
          muted
          playsInline
        />
      </div>
    </section>
  );
};

const Iphone = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect data fetching (unchanged)
  useEffect(() => {
    const controller = new AbortController();
    const fetchIphones = async () => {
      try {
        const response = await apiClient.get(`/products/category/iphone`, {
          signal: controller.signal,
        });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        if (err.name === 'CanceledError') {
          console.log("Request aborted");
          return;
        }
        console.error("Error fetching iPhones:", err);
        if (err.response && err.response.status === 404) {
          setError("No iPhone models found.");
        } else {
          setError("Failed to load iPhones. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchIphones();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">iPhones</h1>
          {loading && (
            <div className="text-center py-20">
              <Loader className="w-12 h-12 animate-spin text-black mx-auto" />
            </div>
          )}
          {error && (
            <div className="text-center py-20 text-red-500">{error}</div>
          )}
          {!loading && !error && (

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <HoverTranslateCard key={product._id} card={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- IphonePage component (unchanged) ---
const IphonePage = () => {
  return (
    <div className="bg-white">
      <TopNavigationBar />
      <main>
        <IphoneHero />
        <Iphone />
      </main>
      <Footer />
    </div>
  );
};

export default IphonePage;