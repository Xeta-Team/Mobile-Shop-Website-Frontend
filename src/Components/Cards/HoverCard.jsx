import React from 'react'


const HoverCard = ({ imageUrl, title, subtitle, link }) => {
    return (<>
       <div className="relative block w-[300px] h-full bg-black rounded-3xl overflow-hidden group text-white shadow-gray-400 shadow-[0_8px_24px_rgba(0,0,0,0.3)]" >
            {/* The entire card content is wrapped in a link. */}
            <a href={link}>
                {/* Background Image: Fills the container and zooms on hover. */}
                <img
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    src={imageUrl}
                    alt={`Promotional image for ${title}`}
                />
                {/* Gradient Overlay for text legibility. */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/40 to-black/70"></div>
                
                {/* Content Container: Absolutely positioned at the top. */}
                <div className="absolute left-6 right-6 top-6 flex flex-col justify-start">
                    <div>
                        <h2 className="text-[20px] font-medium mb-2 tracking-normal">{title}</h2>
                        {/* The `text-[13px]` will override the `text-lg` class. */}
                        <p className="text-gray-200 text-[13px] text-lg">{subtitle}</p>
                    </div>
                </div>
            </a>
        </div>
        
    </>
        
    );
};

export default HoverCard;