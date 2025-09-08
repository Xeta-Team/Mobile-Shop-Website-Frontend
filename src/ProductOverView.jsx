import React, { useState } from 'react';
import ProductDetails from './Components/Pages/Product Overview/ProductDetails';
import ImageGallery from './Components/Pages/Product Overview/ImageGallery';

export default function ProductOverView() {
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

