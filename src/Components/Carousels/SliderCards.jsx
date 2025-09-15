import React from "react";
import Slider from "react-slick";
import ReusableCard from "../Cards/HoverCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PuffLoader } from "react-spinners";

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

function SliderCard({isloading}) {
  const settings = {
    className: "center",
    variableWidth:true,
    infinite: false,
    slidesToShow: 3,
    speed: 500,
    nextArrow: <NextArrow />,  // ✅ Custom Next Arrow
    prevArrow: <PrevArrow />,  // ✅ Custom Prev Arrow
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
    <div className="slider-container relative w-auto mx-auto my-5 ">
      {!isloading ? (<Slider {...settings}>
        {cardsData.map((card) => (
          <div key={card.id} className="flex justify-center h-[380px]">
            <ReusableCard
              imageUrl={card.imageUrl}
              title={card.title}
              subtitle={card.subtitle}
              link={card.link}
            />
          </div>
        ))}
      </Slider>): <PuffLoader size={80} className="m-auto"/>}
    </div>
  );
}

export default SliderCard;