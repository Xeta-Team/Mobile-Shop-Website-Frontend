import React from 'react';
import { Expand } from 'lucide-react';

const ImageGallery = ({ product, activeImage, setActiveImage }) => {
  const images = product?.images;
  const galleryImages = images && images.length > 0 ? images : ['https://placehold.co/600x400/F8FAFC/000000?text=No+Image'];

  return ( <div className="flex flex-row gap-4">
      {/* Vertical Thumbnail Gallery */}
      <div className="flex flex-col gap-3">
        {galleryImages.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`w-20 h-20 bg-gray-50 p-1 rounded-md border-2 ${
              image === activeImage ? 'border-black' : 'border-transparent'
            } cursor-pointer hover:border-gray-400 transition flex items-center justify-center`}
            onClick={() => setActiveImage(image)}
          >
            <img
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1 bg-gray-50 rounded-lg flex items-center justify-center">
        {/* SALE Badge - assuming a field like `onSale` exists on the product */}
        {product.onSale && (
           <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
            Sale
          </span>
        )}
        <img
          src={activeImage}
          alt="Product Main"
          className="max-h-full max-w-full w-auto object-contain p-4"
        />
        <button className="absolute bottom-4 right-4 text-gray-600 hover:text-black">
          <Expand size={20} />
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;    