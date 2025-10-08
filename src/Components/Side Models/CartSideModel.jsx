import { useEffect, useState, useRef } from "react";
import Cart from "./Model Parts/Cart Model/Cart";
import { handleTouchEnd, handleTouchMove, handleTouchStart } from "./Side Model Fuctions/TouchHanddle";
import RecentViews from "./Model Parts/Cart Model/RecentViews";
import { getCartItems } from "../../Actions/CartActions"; // saveCart is not needed here

const CartSideModel = ({ isCartSideModelShow, setIsCartSideModelshow }) => {
  const [isCartClicked, setIsCartClicked] = useState(true);
  const [cartItems, setCartItems] = useState(getCartItems()); // Initialize state from localStorage
  const [recentItems, setRecentItems] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const [translateY, setTranslateY] = useState(0)
  const [disableTransition, setDisableTransition] = useState(false);

  // This effect listens for our custom event and updates the cart
  useEffect(() => {
    const handleCartUpdate = () => {
      const updatedCart = getCartItems();
      setCartItems(updatedCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

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
    calculateTotal();
  }, [cartItems]); // Recalculate total whenever cartItems state changes

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
    setSubTotal(total);
  }

  const handdleQuantityChange = (value, index) => {
    // This function can be improved, but for now it works locally.
    // For a fully synced experience, this should also call a function in CartActions.js
    const newCartItems = [...cartItems];
    const newQuantity = Number(value);
    if (newQuantity < 1) {
        newCartItems[index].quantity = 1;
    } else {
        newCartItems[index].quantity = newQuantity;
    }
    setCartItems(newCartItems);
    // Note: To persist quantity changes from within the cart, you'd call saveCart(newCartItems) here.
  }
  
  return (
    <>
      <div
        className={`bottom-0 rounded-t-[20px] w-full h-6/7 md:rounded-t-[0px] md:h-[100vh] md:top-0 md:right-0 bg-white md:w-3/7 md:rounded-l-[50px] fixed z-20
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
                onTouchEnd={() => {handleTouchEnd(setIsCartSideModelshow, translateY, setTranslateY)}}
      >
        <div className="flex flex-col h-full">
          <div className="relative border-b-1 border-gray-200 px-[20px] pt-[32px] pb-[24px] md:p-10 flex justify-between">
            <hr className="w-12 border-2 rounded-full md:hidden absolute top-4 left-[43%] border-gray-200"/>
            <div className="space-x-12 flex">
              <div className="flex relative">
                <div className="absolute top-0 -right-3 text-black">
                  {cartItems.length}
                </div>
                <button
                  className={`text-[24px] md:text-[30px] ${
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
               {/* ... rest of JSX ... */}
            </div>
            <button
              className="rounded-full bg-black w-[48px] h-[48px] hidden md:flex justify-center items-center hover:cursor-pointer
                        transition-transform duration-300 ease-in-out hover:rotate-90
                    "
              onClick={() => {
                setIsCartSideModelshow(false);
              }}
            >
             {/* ... SVG Icon ... */}
            </button>
          </div>
          <div className="pt-[20px] md:pt-[32px] overflow-y-auto">
            {isCartClicked ? <Cart cartItems={cartItems} handdleQuantityChange={handdleQuantityChange} subTotal={subTotal} isCartSideModelShow={isCartSideModelShow}/> 
            : <RecentViews recentItems={recentItems}/>}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSideModel;
