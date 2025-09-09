import { toast } from "react-toastify";
import { addToCart } from "../../../Actions/CartActions.js";
import { useState } from "react";

const ProductDetails = ({productId, mainImage, productPrice, variants, setProductPrice, selectedColor, setSelectedColor, selectedStorage, setSelectedStorage, productName}) => {
  const [isOutOfStock, setIsOutOfStock] = useState(false)
  const formattedPrice = productPrice.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  
  const checkAvailability = () => {
    const item = variants.find((v) => v.colorName == selectedColor && v.storage == selectedStorage)
    
    if(item){
      if(item.stock){
        setIsOutOfStock(false)
        addToCart({
          id: productId,
          image: mainImage,
          title: productName,
          color: selectedColor,
          storage: selectedStorage,
          price: productPrice,
          quantity: 1
        })
        toast.success('Successfully added to cart')
      }else{
        setIsOutOfStock(true)
      }
    }else{
      setIsOutOfStock(true)
    }
  }
  
  return(<>
    <div className="flex flex-col space-y-4">
    <p className="text-sm text-gray-500">Apple</p>
    <h1 className="text-4xl font-bold">{productName}</h1>
    <p className="text-3xl font-semibold pt-2">Rs {formattedPrice}</p>
    
    {/* Color Selector */}
    <div className="pt-2">
      <p className="text-md mb-2">Color: <span className="font-semibold">{selectedColor}</span></p>
      <div className="flex gap-3">
        <div className="flex space-x-3">
          {variants.map(v => {
            return(
                <button
                  key={v.colorName}
                  onClick={() => setSelectedColor(v.colorName)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${selectedColor === v.colorName ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
                  aria-label={`Select color ${v.colorName}`}
                  style={{backgroundColor: `${v.colorHex}`}}
                ></button>
              )
          })}
        </div>
        <div>
          {isOutOfStock && (<p className="text-red-500">Out of stock</p>)}
        </div>
      </div>
    </div>

    {/* Storage Selector */}
    <div>
      <p className="text-md mb-2">Storage:</p>
      <div className="flex space-x-3">
        {variants.map((v, index)=> {
           return(
              <button
                key={index}
                onClick={() => {
                  setSelectedStorage(v.storage)
                  setProductPrice(v.price)
                }}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                  selectedStorage === v.storage
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black hover:bg-gray-100'
                }`}
              >
                {v.storage}
              </button>
                )
        })}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col space-y-4 pt-4">
      <button className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors"
        onClick={() => {checkAvailability()}}
      >
        Add to cart - Rs {formattedPrice}
      </button>
      <button className="w-full bg-gray-700 text-white font-bold py-4 rounded-full hover:bg-gray-600 transition-colors">
        Buy it now
      </button>
    </div>
  </div>
  </>)
};

export default ProductDetails