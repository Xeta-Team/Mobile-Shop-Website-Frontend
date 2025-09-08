import React, { useState } from 'react';
import FullscreenImage from "../../Image Models/FullscreenImage";
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

export default ImageGallery