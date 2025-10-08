import { useState, useRef } from "react";
import { X } from "lucide-react";

const CartPopup = ({ onClose }) => {
  const product = {
    brand: "Apple",
    name: "Pre-Owned iPhone 16 Plus",
    price: 249900.0,
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Teal", hex: "#0D9488" },
      { name: "Pink", hex: "#F9A8D4" },
      { name: "Black", hex: "#000000" },
    ],
    storages: ["128GB", "256GB", "512GB"],
    images: [
      "public/images/iphone1.jpg",
      "public/images/iphone2.jpeg",
      "../images/iphone-blue-3.png",
    ],
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedStorage, setSelectedStorage] = useState(product.storages[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const [showFloatingClose, setShowFloatingClose] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!popupRef.current) return;
    const popupRect = popupRef.current.getBoundingClientRect();
    const inside =
      e.clientX >= popupRect.left &&
      e.clientX <= popupRect.right &&
      e.clientY >= popupRect.top &&
      e.clientY <= popupRect.bottom;
    setShowFloatingClose(!inside);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto p-4"
      onMouseMove={handleMouseMove}
      >
        // Floating Close Button
      {showFloatingClose && (
        <button
          onClick={onClose}
          style={{
            position: "fixed",
            left: mousePos.x ,
            top: mousePos.y ,
            // zIndex: 0,
            pointerEvents: "auto",
          }}
          className="bg-black text-white rounded-full p-2 shadow-5xl transition hover:bg-gray-700"
        >
          <X size={30} />
        </button>
      )}

        <div
            ref={popupRef} 
            className="relative bg-white rounded-2xl w-full max-w-7xl shadow-lg overflow-hidden backdrop-blur-sm"
        >
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={onClose}
                    className="bg-black text-white rounded-full p-2 hover:bg-gray-700 hover:scale-110 hover:rotate-90 active:scale-95 transition-transform duration-200"
                >
                    <X size={20} />
                </button>
            </div>
        

            {/* Content Wrapper */}
            <div className="flex flex-col md:flex-row"> 
            {/* Image Section */}
                <div className="md:w-1/2 flex flex-col items-center h-155 ">
                    <img
                        src={product.images[currentImage]}
                        alt="product"
                        className="rounded-lg object-cover w-full h-full"
                    />
                    {/* Image Thumbnails */}
                    <div className="flex flex w-20 h-5 bottom-2 bg-white p-2 rounded-md shadow-md">
                        <div className="absolute bottom-2 mt-4 flex gap-3">
                          {product.images.map((img, index) => (
                              <button
                                  key={index}
                                  onClick={() => setCurrentImage(index)}
                                  className={`w-3 h-3 rounded-full ${
                                      currentImage === index ? "bg-black" : "bg-gray-300"
                              }`}
                            
                              />
                          ))}
                        </div>
                      </div>
                </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                <h4 className="text-gray-500">{product.brand}</h4>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-lg font-semibold mt-2">
                    Rs {product.price.toLocaleString()}
                </p>

                {/* Colors */}
                <div className="mt-4">
                    <p className="font-semibold">
                    Color:{" "}
                    <span className="text-gray-600">{selectedColor}</span>
                    </p>
                    <div className="flex gap-2 mt-2">
                    {product.colors.map((color) => (
                        <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-md border-2 ${
                            selectedColor === color.name
                            ? `border-4 border-black `
                            : "hover:border-gray-300"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        ></button>
                    ))}
                    </div>
                </div>

                {/* Storage */}
                <div className="mt-4">
                    <p className="font-semibold">Storage:</p>
                    <div className="flex gap-2 mt-2">
                    {product.storages.map((storage) => (
                        <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`px-4 py-2 rounded-md border-1 ${
                            selectedStorage === storage
                            ? "border-3 border-black"
                            : "hover:border-gray-300"
                        }`}
                        >
                        {storage}
                        </button>
                    ))}
                    </div>
                </div>

                {/* Quantity */}
                <div className="mt-4 flex items-center gap-4">
                    <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="border px-3 py-1 rounded-md"
                    >
                    -
                    </button>
                    <span>{quantity}</span>
                    <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="border px-3 py-1 rounded-md"
                    >
                    +
                    </button>
                </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex flex-col gap-3">
                <button className="bg-black text-white py-3 rounded-md hover:bg-gray-800 active:scale-95 transition-transform duration-200">
                    Add to cart – Rs {product.price.toLocaleString()}
                </button>
                <button className="border border-black py-3 rounded-md active:scale-95 transition-transform duration-200">
                    Buy it now
                </button>
                </div>
            </div>
            </div>
      </div>
    </div>
  );
};

export default CartPopup;