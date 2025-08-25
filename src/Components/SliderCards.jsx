import React from "react";
import Slider from "react-slick";
import ReusableCard from "./ReusableCard"; // Import your card component

// Import slick-carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NextArrow = ({ onClick }) => {
  return (
    <button
      className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 bg-black/60 hover:bg-black text-white p-3 rounded-full shadow-lg"
      onClick={onClick}
    >
      <FaChevronRight size={20} />
    </button>
  );
};

// Custom Prev Arrow
const PrevArrow = ({ onClick }) => {
  return (
    <button
      className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 bg-black/60 hover:bg-black text-white p-3 rounded-full shadow-lg"
      onClick={onClick}
    >
      <FaChevronLeft size={20} />
    </button>
  );
};

function SliderCard() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    nextArrow: <NextArrow />,  // ✅ Custom Next Arrow
    prevArrow: <PrevArrow />,  // ✅ Custom Prev Arrow
    responsive: [
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 3,
          centerPadding: "20px"
        }
      },
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 3,
          centerPadding: "40px"
        }
      }
    ]
  };

  const cardsData = [
    {
      id: 1,
      title: "16 Pro black - gold",
        subtitle: "Now or Never",
        imageUrl: "https://www.apple.com/in/iphone-16-pro/images/overview/product-stories/design/display__f5509jfp9nyq_xlarge_2x.jpg",
        link: "#"
    },
    {
      id: 2,
      title: "16 Pro black - gold",
        subtitle: "Now or Never",
        imageUrl: "https://www.apple.com/in/iphone-16-pro/images/overview/product-stories/design/display__f5509jfp9nyq_xlarge_2x.jpg",
        link: "#"
    },
     {
      id: 3,
      title: "16 Pro black - gold",
        subtitle: "Now or Never",
        imageUrl: "https://www.apple.com/in/iphone-16-pro/images/overview/product-stories/design/display__f5509jfp9nyq_xlarge_2x.jpg",
        link: "#"
    },
     {
      id: 4,
      title: "16 Pro black - gold",
        subtitle: "Now or Never",
        imageUrl: "https://www.apple.com/in/iphone-16-pro/images/overview/product-stories/design/display__f5509jfp9nyq_xlarge_2x.jpg",
        link: "#"
    },
     {
      id: 5,
      title: "16 Pro black - gold",
        subtitle: "Now or Never",
        imageUrl: "https://www.apple.com/in/iphone-16-pro/images/overview/product-stories/design/display__f5509jfp9nyq_xlarge_2x.jpg",
        link: "#"
    }
  ];

  return (
    <div className="slider-container relative w-[90%] mx-auto">
      <Slider {...settings}>
        {cardsData.map((card) => (
          <div key={card.id} className="flex justify-center">
            <ReusableCard
              imageUrl={card.imageUrl}
              title={card.title}
              subtitle={card.subtitle}
              link={card.link}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SliderCard;