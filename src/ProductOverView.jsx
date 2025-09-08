import React, { useState } from 'react';

const StarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "#FFD700" : "none"}
    stroke={filled ? "#FFD700" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-yellow-400"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Fullscreen Image Modal Component
const FullscreenImage = ({ src, alt, onClose }) => (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80"
        onClick={onClose}
    >
        <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
             <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg"/>
        </div>
        <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-8 hover:cursor-pointer bg-gray-200 text-xl text-black rounded-full h-10 w-10 flex items-center justify-center font-bold
                "
                aria-label="Close fullscreen image"
            >
                &times;
            </button>
    </div>
);


// Image Gallery Component with Slider
const ImageGallery = () => {
    const images = [
        { src: "https://placehold.co/600x600/F3F4F6/000000?text=Front+View", alt: "iPhone 16 Pro Max - Front" },
        { src: "https://placehold.co/600x600/F3F4F6/000000?text=Back+View", alt: "iPhone 16 Pro Max - Back" },
        { src: "https://placehold.co/600x600/F3F4F6/000000?text=Camera+View", alt: "iPhone 16 Pro Max - Camera Detail" },
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4">
                <div 
                    className="flex-grow relative w-full bg-gray-100 rounded-xl flex items-center justify-center p-8 aspect-square cursor-pointer"
                    onClick={() => setFullscreenImage(images[currentIndex])}
                >
                    <img 
                        src={images[currentIndex].src} 
                        alt={images[currentIndex].alt} 
                        className="max-w-full h-auto rounded-lg object-contain transition-all duration-300"
                    />
                </div>
                <div className="grid grid-cols-3 md:flex md:flex-col gap-4">
                    {images.map((image, index) => (
                        <div 
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`bg-gray-100 rounded-lg p-2 cursor-pointer border-2 transition-colors ${currentIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-400'}`}
                        >
                            <img 
                                src={image.src.replace('600x600', '200x200')} 
                                alt={`Thumbnail ${image.alt}`} 
                                className="w-full h-full object-cover rounded"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent main image click from firing
                                    setCurrentIndex(index);
                                    setFullscreenImage(image);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {fullscreenImage && (
                <FullscreenImage 
                    src={fullscreenImage.src.replace('600x600', '1200x1200')} 
                    alt={fullscreenImage.alt} 
                    onClose={() => setFullscreenImage(null)} 
                />
            )}
        </>
    );
};


// Rating Component
const Rating = ({ rating, reviews }) => (
    <div className="flex items-center space-x-2">
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < Math.round(rating)} />
            ))}
        </div>
        <span className="text-sm text-gray-500">({reviews} reviews)</span>
    </div>
);


// Product Details Component
const ProductDetails = ({ productPrice, colors, storageOptions, selectedColor, setSelectedColor, selectedStorage, setSelectedStorage }) => (
  <div className="flex flex-col space-y-4">
    <p className="text-sm text-gray-500">Apple</p>
    <h1 className="text-4xl font-bold">Pre-Owned iPhone 16 Pro max</h1>
    <Rating rating={4.8} reviews={120} />
    <p className="text-3xl font-semibold pt-2">Rs {productPrice}</p>
    
    {/* Color Selector */}
    <div className="pt-2">
      <p className="text-md mb-2">Color: <span className="font-semibold">{selectedColor}</span></p>
      <div className="flex space-x-3">
        {colors.map(c => (
          <button
            key={c.name}
            onClick={() => setSelectedColor(c.name)}
            className={`w-8 h-8 rounded-full ${c.color} border-2 transition-all duration-200 ${selectedColor === c.name ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
            aria-label={`Select color ${c.name}`}
          ></button>
        ))}
      </div>
    </div>

    {/* Storage Selector */}
    <div>
      <p className="text-md mb-2">Storage:</p>
      <div className="flex space-x-3">
        {storageOptions.map(storage => (
          <button
            key={storage}
            onClick={() => setSelectedStorage(storage)}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
              selectedStorage === storage
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black hover:bg-gray-100'
            }`}
          >
            {storage}
          </button>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col space-y-4 pt-4">
      <button className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors">
        Add to cart - Rs {productPrice}
      </button>
      <button className="w-full bg-gray-700 text-white font-bold py-4 rounded-full hover:bg-gray-600 transition-colors">
        Buy it now
      </button>
    </div>
  </div>
);


// Main App Component
export default function App() {
  const [selectedStorage, setSelectedStorage] = useState('256GB');
  const [selectedColor, setSelectedColor] = useState('Black Titanium');

  const storageOptions = ['256GB', '512GB', '1TB'];
  const colors = [
    { name: 'Black Titanium', color: 'bg-gray-800' },
    { name: 'Natural Titanium', color: 'bg-gray-400' },
    { name: 'White Titanium', color: 'bg-gray-200' },
    { name: 'Blue Titanium', color: 'bg-blue-900' },
  ];
  const productPrice = "334,900.00";

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <div className="container mx-auto px-4">
        
        <main className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <ImageGallery />
            <ProductDetails 
              productPrice={productPrice}
              colors={colors}
              storageOptions={storageOptions}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedStorage={selectedStorage}
              setSelectedStorage={setSelectedStorage}
            />
          </div>
        </main>
      </div>

    </div>
  );
}

