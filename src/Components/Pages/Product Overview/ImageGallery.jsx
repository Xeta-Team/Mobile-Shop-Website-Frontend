import React, { useState } from 'react';
import FullscreenImage from "../../Image Models/FullscreenImage";
const ImageGallery = ({images, mainImage, alt}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 h-[500px]">
                <div 
                    className="flex-grow relative w-[60%] bg-gray-100 rounded-xl flex items-center justify-center p-8 aspect-square cursor-pointer"
                    onClick={() => setFullscreenImage(mainImage)}
                >
                    <img 
                        src={mainImage} 
                        alt={alt} 
                        className="max-w-full h-auto rounded-lg object-contain transition-all duration-300"
                    />
                </div>
                <div className="grid grid-cols-3 md:flex md:flex-col gap-4 overflow-y-auto overflow-x-hidden no-scrollbar">
                    {images.map((image, index) => (
                        <div 
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`bg-gray-100 rounded-lg p-2 cursor-pointer border-2 transition-colors  ${currentIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-400'}`}
                        >
                            <img 
                                src={image} 
                                alt={`Thumbnail ${image.alt}`} 
                                className="md:w-40 md:h-40 object-cover rounded"
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
                    src={fullscreenImage.replace('600x600', '1200x1200')} 
                    alt={fullscreenImage.alt} 
                    onClose={() => setFullscreenImage(null)} 
                />
            )}
        </>
    );
};

export default ImageGallery