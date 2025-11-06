import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Toaster } from 'react-hot-toast';

// Import child components as defined in your original file structure
import TopNavigationBar from "../../Components/TopNavigationBar";
import Footer from "../../Components/Footer";
import ImageGallery from "./ImageGallery";
import ProductDetails from "./ProductDetails";
import ProductSkeleton from "./ProductSkeleton";

// --- Reusable Sub-Components ---

const Breadcrumb = ({ product }) => (
  <nav className="flex items-center text-sm text-gray-500">
    <Link to="/" className="hover:text-gray-800 transition-colors">Home</Link>
    <ChevronRight size={16} className="mx-1" />
    <span className="font-semibold text-gray-800">{product.name}</span>
  </nav>
);

const ProductNavigation = () => (
  <div className="flex items-center gap-1">
    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Previous Product">
      <ChevronLeft size={20} />
    </button>
    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Next Product">
      <ChevronRight size={20} />
    </button>
  </div>
);

// --- Main Page Component ---

const ProductOverView = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null); // This holds the raw API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    // Abort controller for request cleanup
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:3001/api/products/${productId}`, {
          signal: controller.signal,
        });
        
        const fetchedData = response.data;
        setProduct(fetchedData);
        
        // Robust logic to set the initial active image
        setActiveImage(fetchedData.base_image || fetchedData.variants?.[0]?.image_url || fetchedData.images?.[0] || '');

      } catch (err) {
        // Standard check for aborted requests
        if (err.name === 'CanceledError') {
          console.log("Request was canceled.");
          return;
        }
        setError("Failed to load product details.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Cleanup function to abort the request if the component unmounts
    return () => {
      controller.abort();
    };
  }, [productId]);

  // Data is transformed here using useMemo for performance.
  // This creates the `colors` and `storageOptions` arrays needed by ProductDetails.
  const transformedProduct = useMemo(() => {
    if (!product) return null;
    
    const colorsMap = new Map();
    const storageSet = new Set();

    (product.variants || []).forEach(v => {
        if (v.colorName && v.colorHex && !colorsMap.has(v.colorName)) {
            colorsMap.set(v.colorName, { name: v.colorName, hex: v.colorHex });
        }
        if (v.storage) {
            storageSet.add(v.storage);
        }
    });

    return {
        ...product,
        colors: Array.from(colorsMap.values()),
        storageOptions: Array.from(storageSet),
    };
  }, [product]);

  // Updates the main image when a variant with a specific image is selected
  const handleVariantChange = (variant) => {
    if (variant && variant.image_url) {
      setActiveImage(variant.image_url);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <>
        <TopNavigationBar />
        <ProductSkeleton />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNavigationBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-red-600">Something Went Wrong</h2>
          <p className="text-gray-600">{error}</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!transformedProduct) {
    return (
      <>
        <TopNavigationBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Toaster position="bottom-right" />
      <TopNavigationBar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb product={transformedProduct} />
          <ProductNavigation />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ImageGallery
            product={transformedProduct}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />
          <ProductDetails
            product={transformedProduct}
            onVariantChange={handleVariantChange}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductOverView;