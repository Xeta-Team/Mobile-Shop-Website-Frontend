import {  useRef, useState } from "react"
import { handleTouchEnd, handleTouchMove, handleTouchStart } from "../Side Models/Side Model Fuctions/TouchHanddle"
import { Link, useNavigate } from "react-router"
const CollapseMenu = ({iscollapseShow, setIscollapseShow}) => {
    const startYRef = useRef(0)
    const currentYRef = useRef(0)
    const [translateY, setTranslateY] = useState(0)
    const navigate = useNavigate()
    
    const menuItems = [
        { name: "Home", to: "/" },
        { name: "iPhone", to: "/iphone" },
        { name: "iPad", to: "/ipad" },
        { name: "MacBook", to: "/mac" },
        { name: "Watch", to: "/watch" },
        { name: "AirPods", to: "/airpod" },
        { name: "Vision", to: "/vision" },
        { name: "Tv & Home", to: "/tv-home" },
        { name: "Accessories", to: "/accessories" },
        { name: "Per-Owned Devices", to: "/pre-owned-devices" },
    ]
        return(<>
        <div className={`md:hidden bottom-0 w-full h-6/7 bg-white rounded-t-[20px] font-inter-sans fixed z-20
            transform transition-transform ease-out duration-1000
            ${iscollapseShow ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"}
            `}
            style={{
                transform:
                iscollapseShow && translateY > 0
                    ? `translateY(${translateY}px)`
                    : "",
            }}
            onTouchStart={(event) => {handleTouchStart(event, startYRef)}}
            onTouchMove={(event) => {handleTouchMove(event, setTranslateY, currentYRef, startYRef)}}
            onTouchEnd={(event) => {handleTouchEnd(setIscollapseShow, translateY, setTranslateY)}}
            >
            <div className="flex flex-col h-full">
                <div className="relative py-5">
                    <hr className="w-12 border-2 rounded-full md:hidden absolute top-4 left-[43%] border-gray-200"/>
                </div>
                <div className="overflow-auto overflow-x-hidden relative h-full">
                        <ul className={`absolute h-full w-full`}>
                            {menuItems.map((item, index) => (
                                <li key={index} className={`px-[20px] py-[4px] text-[24px] font-bold font-inter-sans flex hover:cursor-pointer
                                    transform transition-transform ease-in-out duration-500
                                    ${iscollapseShow ? "translate-x-0 opacity-100" : "-translate-x-full opacity-40"}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                   <Link 
                                        to={item.to}
                                        className="hover:cursor-pointer w-full"
                                        onClick={() => setIscollapseShow(false)}
                                    >
                                        {item.name}
                                    </Link> 
                                    
                                </li>
                            ))}
                        </ul>
                </div>
                <div className="bg-gray-50 p-[20px] flex justify-between items-center">
                    <div>
                        <button className="bg-black text-white p-3 rounded-full flex items-center gap-2 text-[14px] hover:cursor-pointer"
                            onClick={() => {navigate("/user"); setIscollapseShow(false)}}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18px"
                                height="18px"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="1.656"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            My Account
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    </>)
}

export default CollapseMenu