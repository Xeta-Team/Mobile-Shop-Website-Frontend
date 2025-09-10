import { useEffect, useRef, useState } from "react"
import { handleTouchEnd, handleTouchMove, handleTouchStart } from "../Side Models/Side Model Fuctions/TouchHanddle"
import { Link } from "react-router"
const CollapseMenu = ({iscollapseShow, setIscollapseShow}) => {
    const startYRef = useRef(0)
    const currentYRef = useRef(0)
    const [translateY, setTranslateY] = useState(0)
    const [isDropDownItemsShow, setIsDropDownItemsShow] = useState(false)
    const [dropDownItem, setDropDownItem] = useState({name: "", dropdownItems: []})

    useEffect(() => {
        setIsDropDownItemsShow(false)
    }, [iscollapseShow])
    
    const menuItems = [
        {name: "Home", dropdownItems: []},
        {name: "iPhone", dropdownItems: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 11"]},
        {name: "iPad", dropdownItems: ["iPad", "iPad Pro", "iPad Air", "iPad Mini"]},
        {name: "iPad", dropdownItems: ["MacBook Pro", "MacBook Air", "Mac Mini", "Mac Studio", "iMac"]},
        {name: "MacBook", dropdownItems: ["MacBook Pro", "MacBook Air", "Mac Mini", "Mac Studio", "iMac"]},
        {name: "Watch", dropdownItems: ["Apple Watch Ultra 2", "Apple Watch Series 10", "Apple Watch Series 9", "Apple Watch SE"]},
        {name: "AirPods", dropdownItems: ["AirPods", "AirPods Pro", "AirPods Max"]},
        {name: "Vision", dropdownItems: []},
        {name: "Tv & Home", dropdownItems: ["Apple Tv 4K", "HomePod", "HomePod Mini"]},
        {name: "Accessories", dropdownItems: ["AirTag", "Apple Pencil", "iPhone Accessories", "iPad Accessories", "Apple Watch Accessories", "Mac Accessories"]},
        {name: "Per-Owned Devices", dropdownItems: ["iPhones"]},
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
                        <ul className={`absolute h-full w-full transform transition-transform ease-in-out duration-500
                                    ${isDropDownItemsShow ? "-translate-x-full" : "translate-x-0"}`}>
                            {menuItems.map((item, index) => (
                                <li key={index} className={`px-[20px] py-[4px] text-[24px] font-bold font-inter-sans flex justify-between hover:cursor-pointer
                                    transform transition-transform ease-in-out duration-500
                                    ${iscollapseShow ? "translate-x-0 opacity-100" : "-translate-x-full opacity-40"}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                    onClick={() => {if(item.dropdownItems.length > 0){
                                        setIsDropDownItemsShow(true)
                                        setDropDownItem(item)
                                    }else{
                                        setIsDropDownItemsShow(false)
                                    }}}
                                >
                                    <button className="hover:cursor-pointer">{item.name}</button>
                                    {item.dropdownItems.length > 0 &&
                                        (<svg className="w-[20px] h-[20px]" viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#c7c7c7"></path> </g> </g></svg>)
                                    }
                                </li>
                            ))}
                        </ul>
                        <div className={`absolute h-full w-full transform transition-transform ease-in-out duration-500 hover:cursor-pointer
                            ${isDropDownItemsShow ? "translate-x-0 pointer-events-auto opacity-100" : "translate-x-full pointer-events-none opacity-40"}`}
                            >
                                <div className={`px-[20px] flex items-center gap-3`}
                                    onClick={() => {
                                setIsDropDownItemsShow(false)
                            }}
                                >
                                        <svg className="w-[10px] h-[10px]" viewBox="-19.04 0 75.803 75.803" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Group_64" data-name="Group 64" transform="translate(-624.082 -383.588)"> <path id="Path_56" data-name="Path 56" d="M660.313,383.588a1.5,1.5,0,0,1,1.06,2.561l-33.556,33.56a2.528,2.528,0,0,0,0,3.564l33.556,33.558a1.5,1.5,0,0,1-2.121,2.121L625.7,425.394a5.527,5.527,0,0,1,0-7.807l33.556-33.559A1.5,1.5,0,0,1,660.313,383.588Z" fill="#ababab"></path> </g> </g></svg>
                                        <p className="text-[16px] text-gray-300 font-bold">{dropDownItem.name}</p>
                                </div>
                                {dropDownItem.dropdownItems.length > 0 && (<ul className="text-black">
                                    {dropDownItem.dropdownItems.map((item, index) => (
                                        <li key={index} className={`px-[20px] py-[4px] text-[24px] font-bold font-inter-sans flex justify-between hover:cursor-pointer`}>
                                            <Link className="hover:cursor-pointer">{item}</Link>
                                        </li>
                                    ))}
                                </ul>)}
                        </div>
                </div>
                <div className="bg-gray-50 p-[20px] flex justify-between items-center">
                    <div>
                        <button className="bg-black text-white p-3 rounded-full flex items-center gap-2 text-[14px] hover:cursor-pointer">
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
                    <div>
                        <a
                        href="https://www.facebook.com/share/1CSHLsqTjs/?mibextid=wwXIfr"
                        className="hover:cursor-pointer">
                            <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1168.737 487.897c44.672-41.401 113.824-36.889 118.9-36.663l289.354-.113 6.317-417.504L1539.65 22.9C1511.675 16.02 1426.053 0 1237.324 0 901.268 0 675.425 235.206 675.425 585.137v93.97H337v451.234h338.425V1920h451.234v-789.66h356.7l62.045-451.233H1126.66v-69.152c0-54.937 14.214-96.112 42.078-122.058" fillRule="evenodd"></path> </g></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default CollapseMenu