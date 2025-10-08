import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A stylish card component with a hover zoom effect on the background image.
 * @param {string} imageUrl - The URL for the background image.
 * @param {string} title - The main title text.
 * @param {string} subtitle - The smaller subtitle text.
 * @param {string} link - The destination URL for the link.
 */
const HoverCard = ({ imageUrl, title, subtitle, link }) => {
    return (
        <div className="relative block w-full bg-black rounded-3xl overflow-hidden group text-white shadow-lg transition-shadow duration-300 hover:shadow-2xl">
            {/* The entire card content is wrapped in a link. */}
            <Link to={link} className="block aspect-[4/5] w-full">
                {/* Background Image: Fills the container and zooms on hover. */}
                <img
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    src={imageUrl}
                    alt={`Promotional image for ${title}`}
                />
                {/* Gradient Overlay for text legibility. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                
                {/* Content Container */}
                <div className="relative z-10 flex flex-col justify-end h-full p-6">
                    <div>
                        <h2 className="text-xl font-bold mb-1 tracking-tight">{title}</h2>
                        <p className="text-gray-200 text-sm">{subtitle}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default HoverCard;