import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import TopNavigationBar from "../../Components/TopNavigationBar";
import Footer from "../../Components/Footer";
import ImageGallery from "./ImageGallery";
import ProductDetails from "./ProductDetails";
import ProductSkeleton from "./ProductSkeleton";
import apiClient from "../api/axiosConfig.js";
import { PuffLoader } from "react-spinners";

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
  const [gallaryImages, setGallaryImages] = useState([]);

  useEffect(() => {
    // Abort controller for request cleanup
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/api/products/${productId}`, {
          signal: controller.signal,
        });
        
        const fetchedData = response.data;
        
        setProduct(fetchedData);
        
        
        // Robust logic to set the initial active image
        setActiveImage(prev =>
        prev ||
        fetchedData.base_image ||
        fetchedData.variants?.[0]?.image_url ||
        fetchedData.images?.[0] ||
        ''
      );

      // gallery images
      if(fetchedData.category === 'Airpods'){
        setGallaryImages([fetchedData.base_image])

        setGallaryImages((prev) => ([
          ...prev,
          fetchedData.variants?.map(v => v.image_url)
        ]))
      }else{
        setGallaryImages(
        fetchedData.variants?.map(v => v.image_url) || []
      );
      }


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
  const handleVariantChange = useCallback((variant) => {
    if (variant && variant.image_url) {
        setActiveImage(variant.image_url);
      }
  }, []);

  // --- Render Logic ---

  // if (loading) {
    
  // }

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
      <div className="flex flex-col min-h-screen">
        <TopNavigationBar />
        

        <div className="flex-grow flex justify-center items-center h-[60vh]">
          <PuffLoader 
            color="#000000"   
            size={100}        
            speedMultiplier={1.5}
          />
        </div>
        
        <Footer />
      </div>
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
            galleryImages={gallaryImages}
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