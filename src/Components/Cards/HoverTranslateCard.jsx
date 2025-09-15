import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import CartPopup from "../popup/CartPopup";

const HoverTranslateCard = ({card,index, setShowCartPopup}) => {
  const containerRef = useRef()
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const third = rect.width / 3
    const idx = Math.min(2, Math.max(0, Math.floor(relativeX / third)))
    setActiveIndex(idx)
  }

  const handleZoneClick = (idx) => {
    setActiveIndex(idx)
  }

  
    return(
      <div key={index} className="w-[290px] h-[450px] mt-5 bg-white overflow-visible rounded-2xl group relative">
        <button 
          onClick={() => setShowCartPopup(true)}
          className="w-10 h-10 hidden md:flex justify-center items-center rounded-full bg-black hover:cursor-pointer text-white absolute z-10 -left-5 -top-2 opacity-0 group-hover:opacity-100">
          <img 
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABVUlEQVR4nO2UMUsDQRCFU6TzMJrWk4ABD/9ECP4VtfIXWER/S8qEQBqJIAhibCy0sLCJYpFWRRPU8guDL3AOq3exCBZ5sHDMe/P2ZnZ2C4UF/jWAMrAPHAND4FNrqJhx5b8YF4EDYEw2xtIW85rHwFXK4BTYARJgSStRzLgpLCfOMq8AD0q4B2o5fqgGDJRjuZWfhBFwJ+EFsJLi1oEOMNLqWhUpvgScK9c8otAGTQlu0gK+zJ8DvX8xzv2g5Rqa3rwu4gOoOq4jzqZmTWfUU6zttFV5GOppoq/gYaCykbjYVWV4C+gb4vqhDRozbvAa0B+FNpi26B3YcAldcT21x8xPFGs57aYu4vcWuUO+tllPxRMdqMeTq2oZuA0ecmBMbeRKriVt67lWy5mvApe/jmngog1yXrRt4DHzomU8FbvAlqqM9L0HnM30VMzlsZvLc73AXDEBG+8c+C3rAPAAAAAASUVORK5CYII=" 
          alt="visible--v1"/>
        </button>
        <div
          onClick={() => {navigate(`/product/${card._id}`)}}
          className="relative overflow-hidden h-[70%] rounded-2xl"
          ref={containerRef}
          onMouseMove={handleMouseMove}
        >

          <div
            className="flex w-full h-full transition-transform duration-400 rounded-t-2xl"
            style={{ transform: `translateX(-${activeIndex * 100}%)`}}
          >
              {card.images.map((src, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full object-contain">
                <img
                  src={src}
                  alt={`${card.title} variant ${i + 1}`}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 cursor-pointer"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => handleZoneClick(i)}
                aria-label={`Show image ${i + 1}`}
                role="button"
              />
            ))}
          </div>

          <div className="absolute bottom-0 justify-center w-[70px] left-1/2 transform bg-white p-2 rounded-xl -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {card.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Select image ${i + 1}`}
                className={`w-1 h-1 rounded-full focus:outline-none transition-all ${
                  i === activeIndex ? "ring-2 ring-offset-1 ring-black bg-white" : "bg-black"
                }`}
              ></button>
            ))}
          </div>
        </div>

        <div className="p-4 text-center font-snas">
          <h1 className="text-sm text-gray-400">APPLE</h1>
          <Link to={`/product/${card._id}`} className="text-[15px] font-semibold md:text-lg mb-1 mt-1">{card.productName}</Link>
          <p className="text-[12px] md:text-sm text-gray-600 mb-2">From: <span className="text-black text-[15px] md:text-[17px]">{card.productPrice.toFixed(2)}</span></p>
          <div className="flex gap-2 justify-center">
            {card.variants.map((color, index) => (
            <div key={index} className={`rounded-full w-4 h-4 border`}
              style={{backgroundColor: color.colorHex}}
            ></div>
          ))}
          </div>
        </div>
        
      </div>
      
    )
}

export default HoverTranslateCard
