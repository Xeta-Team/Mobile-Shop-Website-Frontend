import { useEffect, useState, useRef } from "react";
import Cart from "./Model Parts/Cart Model/Cart";
import { handleTouchEnd, handleTouchMove, handleTouchStart } from "./Side Model Fuctions/TouchHanddle";
import RecentViews from "./Model Parts/Cart Model/RecentViews";
import { getCartItems, saveCart } from "../../Actions/CartActions";

const CartSideModel = ({ isCartSideModelShow, setIsCartSideModelshow }) => {
  const [isCartClicked, setIsCartClicked] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [recentItems, setRecentItems] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const [translateY, setTranslateY] = useState(0)
  const [disableTransition, setDisableTransition] = useState(false);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      setDisableTransition(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDisableTransition(false);
      }, 200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const cart = getCartItems()
    const recentViews = JSON.parse(localStorage.getItem("recentViews"))

    if(cart) {
      setCartItems(cart);
      calculateTotal()
    }

    if(recentViews){
        saveCart(recentViews)
    }
  }, [isCartSideModelShow]);
  
  useEffect(() => {
    calculateTotal()
  }, [cartItems])

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => {
        return sum = sum + item.price * item.quantity
    },0)
    setSubTotal(total)
  }

  const handdleQuantityChange = (value, index) => {
    const newCartItems = [...cartItems]
    value < 1 ? newCartItems[index].quantity = 1 : newCartItems[index].quantity = Number(value)
    setCartItems(newCartItems)
  }
  return (
    <>
      <div
        className={`bottom-0 rounded-t-[20px] w-full h-6/7 md:rounded-t-[0px] md:h-[100vh] md:top-0 md:right-0 bg-white md:w-3/8 md:rounded-l-[50px] fixed z-20
            ${
              disableTransition ? "transition-none" : "transition-transform duration-1000 ease-out"
            }
            ${
              isCartSideModelShow
                ? "translate-y-0 md:translate-x-0 pointer-events-auto"
                : "translate-y-full md:translate-y-0 md:translate-x-full pointer-events-none"
            }`}
            style={{
                    transform:
                    isCartSideModelShow && translateY > 0
                        ? `translateY(${translateY}px)`
                        : "",
                }}
                onTouchStart={(event) => {handleTouchStart(event, startYRef)}}
                onTouchMove={(event) => {handleTouchMove(event, setTranslateY, currentYRef, startYRef)}}
                onTouchEnd={(event) => {handleTouchEnd(setIsCartSideModelshow, translateY, setTranslateY)}}
      >
        <div className="flex flex-col h-full">
          <div className="relative border-b-1 border-gray-200 px-[20px] pt-[32px] pb-[24px] md:p-10 flex justify-between">
            <hr className="w-12 border-2 rounded-full md:hidden absolute top-4 left-[43%] border-gray-200"/>
            <div className="space-x-12 flex">
              <div className="flex relative">
                {cartItems.length > 0 && (<div className="absolute top-0 -right-3 text-black">
                  {cartItems.length}
                </div>)}
                <button
                  className={`text-[20px] md:text-[25px] ${
                    isCartClicked
                      ? "text-black"
                      : "text-gray-300 hover:text-black"
                  } transition-colors ease-in-out duration-400 font-bold font-inter-sans hover:cursor-pointer`}
                  onClick={() => {
                    setIsCartClicked(true);
                  }}
                >
                  Cart
                </button>
              </div>
              <button
                className={`text-[20px] md:text-[25px] ${
                  isCartClicked
                    ? "text-gray-300 hover:text-black"
                    : "text-black"
                } transition-colors ease-in-out duration-400 font-bold font-inter-sans hover:cursor-pointer`}
                onClick={() => {
                  setIsCartClicked(false);
                }}
              >
                Recently viewed
              </button>
            </div>
            <button
              className="rounded-full bg-black w-[48px] h-[48px] hidden md:flex justify-center items-center hover:cursor-pointer
                        transition-transform duration-300 ease-in-out hover:rotate-90
                    "
              onClick={() => {
                setIsCartSideModelshow(false);
              }}
            >
              <svg
                fill="#ffffff"
                width="20px"
                height="20px"
                viewBox="0 0 56 56"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M 10.0234 43.0234 C 9.2266 43.8203 9.2031 45.1797 10.0234 45.9766 C 10.8438 46.7734 12.1797 46.7734 13.0000 45.9766 L 28.0000 30.9766 L 43.0000 45.9766 C 43.7969 46.7734 45.1563 46.7969 45.9766 45.9766 C 46.7734 45.1562 46.7734 43.8203 45.9766 43.0234 L 30.9531 28.0000 L 45.9766 13.0000 C 46.7734 12.2031 46.7969 10.8437 45.9766 10.0469 C 45.1328 9.2266 43.7969 9.2266 43.0000 10.0469 L 28.0000 25.0469 L 13.0000 10.0469 C 12.1797 9.2266 10.8203 9.2031 10.0234 10.0469 C 9.2266 10.8672 9.2266 12.2031 10.0234 13.0000 L 25.0234 28.0000 Z"></path>
                </g>
              </svg>
            </button>
          </div>
          <div className="pt-[20px] md:pt-[32px] overflow-y-auto">
            {isCartClicked ? <Cart cartItems={cartItems} setIsCartSideModelshow={setIsCartSideModelshow} setCartItems={setCartItems} handdleQuantityChange={handdleQuantityChange} subTotal={subTotal} isCartSideModelShow={isCartSideModelShow}/> 
            : <RecentViews recentItems={recentItems}/>}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSideModel;
