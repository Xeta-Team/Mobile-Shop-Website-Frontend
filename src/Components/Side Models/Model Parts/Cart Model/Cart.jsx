import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { deleteCartItem } from "../../../../Actions/CartActions";
const Cart = ({cartItems, setIsCartSideModelshow,setCartItems,handdleQuantityChange, subTotal, isCartSideModelShow}) => {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        if (isCartSideModelShow) {
            const timer = setTimeout(() => {
            setProgress(100);
            }, 200);

            return () => clearTimeout(timer);
        } else {
            setProgress(0);
        }
    }, [isCartSideModelShow])
    return(<>
    <div className="text-black">
        {cartItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-5 py-[32px] w-[250px] md:w-[300px] text-black text-center m-auto font-inter-sans">
            <p className="text-2xl md:text-3xl font-bold">
                Your cart is currently empty.
            </p>
            <p className="text-[14px] md:text-[16px]" style={{ color: "#171717" }}>
                Not sure where to start?
                <span className="block">Try these collections:</span>
            </p>
            <button onClick={() => {
                setIsCartSideModelshow(false)
                navigate('/')
            }} className="flex justify-between w-full bg-gray-50 hover:bg-gray-100 hover:cursor-pointer p-3 rounded-full group">
                <p style={{ color: "#171717" }}>Continue shopping</p>
                <div className="transition-transform -translate-x-1 duration-300 group-hover:translate-x-0">
                <svg
                    width="28px"
                    height="28px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                        d="M6 12H18M18 12L13 7M18 12L13 17"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>{" "}
                    </g>
                </svg>
                </div>
            </button>
            </div>
        ) : (
            <div className="h-full flex flex-col">
            <div className="text-black flex-1 font-inter-sans pb-5 px-[20px] md:px-[48px]">
                <div className="space-y-7 md:space-y-10">
                <div className="space-y-3 ">
                    <p className="text-sm text-[14px]">
                    You are eligible for free shipping.
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className="bg-black h-2.5 rounded-full transition-all duration-200 ease-in"
                        style={{ width: `${progress}%` }}
                    ></div>
                    </div>
                </div>
                <div className="space-y-5">
                    {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-6">
                        <div className="w-[80px] h-[80px] md:w-[96px] md:h-[96px] overflow-hidden rounded-lg hover:cursor-pointer">
                        <img
                            src={item.image}
                            className="w-full h-full object-contains transition-transform duration-200 ease-in-out hover:scale-105"
                        />
                        </div>
                        <div className="flex-1">
                        <Link className="text-[14px] md:text-[16px] font-medium hover-underline">
                            {item.title}
                        </Link>
                        {item.colors && (
                            <p
                            className="text-[12px] mt-1"
                            style={{ color: "#17171799" }}
                            >
                            {item.colors}
                            </p>
                        )}
                        {item.storage && (
                            <p
                            className="text-[12px] mt-1"
                            style={{ color: "#17171799" }}
                            >
                            {item.storage}
                            </p>
                        )}
                        <p
                            className="mt-1 text-sm"
                            style={{ color: "#171717" }}
                        >
                            Rs {item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        </div>
                        <div className="flex flex-col px-1 space-y-4">
                        <input
                            type="number"
                            value={item.quantity}
                            className="w-[56px] h-[48px] text-center outline-0"
                            style={{ backgroundColor: "#17171706" }}
                            id="quantity"
                            onChange={(event) => {handdleQuantityChange(event.target.value,index)}}
                            autoComplete="off"
                        />
                        <button
                            className="text-[12px] hover:cursor-pointer"
                            style={{ color: "#171717" }}
                            onClick={() => {deleteCartItem(item.id, setCartItems)}}
                        >
                            <span className="remove-hover-underline">Remove</span>
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            <div className="border-t-1 border-gray-200 font-inter-sans space-y-7 py-5 px-[20px] md:py-8 bottom-0 sticky bg-gray-50 md:pt-[24px] md:px-[48px]">
                <div className="flex justify-between md:gap-10">
                    <div>
                        <p className="text-[#171717] text-[14px] md:text-[16px] md:w-56">
                            Taxes included and shipping calculated at checkout.
                        </p>
                    </div>
                    <div className="text-[18px] md:text-[22px] font-bold text-[#171717]">
                        <span className="block text-[14px] md:text-[16px] font-medium">Subtotal</span> Rs {subTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR
                    </div>
                    </div>
                        <button className="text-[14px] md:text-[16px] w-full bg-black text-white p-2 md:p-3 rounded-full hover:cursor-pointer flex justify-center items-center gap-2">
                        <svg className="w-[16px] h-[16px] md:w-[20px] md:h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        Checkout
                    </button>
                </div>
            </div>
        )}
    </div>
    </>)
}

export default Cart