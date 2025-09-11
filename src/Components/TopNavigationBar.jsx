import { useEffect, useState } from "react"
import NavigrationBarActionBtns from "./Buttons/NavigrationBarActionBtns"
import NavigrationBarBtn from "./Buttons/NavigrationBarBtn"
import Overlay from "./Overlay"
import SearchSideModel from "./Side Models/SearchSideModel"
import CartSideModel from "./Side Models/CartSideModel"
import CollapseMenu from "./Collapse Model/CollapseMenu"
import CollapseBtn from "./Buttons/CollapseBtn"
import shopLogoWhite from '../assest/wlogo.png'

const TopNavigationBar = () => {
    const [isSideModelShow, setIsSideModelShow] = useState(false) //For Search Model
    const [isCartSideModelShow, setIsCartSideModelShow] = useState(false) //For Cart and Recentview Model
    const [iscollapseShow, setIscollapseShow] = useState(false)
    const [isDropDownShow, setIsDropDownShow] = useState(false)
    const [isShowOverlay, setIsShowOverlay] = useState(false)

    useEffect(() => {
        if(isDropDownShow || isSideModelShow || isCartSideModelShow || iscollapseShow){
            setIsShowOverlay(true)
        }else{
            const timeout = setTimeout(() => setIsShowOverlay(false),200)
            return () => clearTimeout(timeout)
    }}, [isDropDownShow, isSideModelShow, isCartSideModelShow, iscollapseShow])

    useEffect(() => {
        if(isSideModelShow || isCartSideModelShow || iscollapseShow){
            document.body.style.overflow = "hidden"
        }else{
            document.body.style.overflow = "auto"
        }
    },[isSideModelShow, isCartSideModelShow, iscollapseShow])
    return(<>
        <nav className="bg-black text-white border-gray-200 dark:bg-gray-900 relative h-[120px] bg-fixed">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <CollapseBtn setIscollapseShow={setIscollapseShow}/>
                
                <a
                href="/"
                className="flex"
                >
                    <img
                        src={shopLogoWhite}
                        className="h-[80px] w-[270px] m-auto"
                        alt="Flowbite Logo"
                    />
                </a>
                
                <NavigrationBarActionBtns setIsSideModelShow={setIsSideModelShow} setIsCartSideModelShow={setIsCartSideModelShow}/>

                <div
                className="items-center justify-between hidden w-full md:flex md:flex-col md:w-auto md:order-1 md:text-[17px]"
                id="navbar-user"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 text-white rounded-lg md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0">
                        <NavigrationBarBtn name={"Home"} rowNum={"1"} setIsDropDownShow={setIsDropDownShow}/>
                        <NavigrationBarBtn name={"iPhone"} rowNum={"1"} setIsDropDownShow={setIsDropDownShow} dropdownItems={["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 11"]}/>
                        <NavigrationBarBtn name={"iPad"} rowNum={"1"} setIsDropDownShow={setIsDropDownShow} dropdownItems={["iPad", "iPad Pro", "iPad Air", "iPad Mini"]}/>
                        <NavigrationBarBtn name={"MacBook"} rowNum={"1"} setIsDropDownShow={setIsDropDownShow} dropdownItems={["MacBook Pro", "MacBook Air", "Mac Mini", "Mac Studio", "iMac"]}/>
                        <NavigrationBarBtn name={"Watch"} rowNum={"1"} setIsDropDownShow={setIsDropDownShow} dropdownItems={["Apple Watch Ultra 2", "Apple Watch Series 10", "Apple Watch Series 9", "Apple Watch SE"]}/>
                        <NavigrationBarBtn name={"AirPods"} rowNum={"1"} setIsDropDownShow={setIsDropDownShow} dropdownItems={["AirPods", "AirPods Pro", "AirPods Max"]}/>
                        <NavigrationBarBtn name={"Vision"} rowNum={"1"} setIsDropDownShow={setIsDropDownShow}/>
                        <NavigrationBarBtn name={"Tv & Home"} rowNum={"1"} setIsDropDownShow={setIsDropDownShow} dropdownItems={["Apple Tv 4K", "HomePod", "HomePod Mini"]}/>
                    </ul>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 text-white rounded-lg md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0">
                        <NavigrationBarBtn name={"Accessories"} setIsDropDownShow={setIsDropDownShow} rowNum={2} dropdownItems={["AirTag", "Apple Pencil", "iPhone Accessories", "iPad Accessories", "Apple Watch Accessories", "Mac Accessories"]}/>
                        <NavigrationBarBtn name={"Per-Owned Devices"} setIsDropDownShow={setIsDropDownShow} rowNum={2} dropdownItems={["iPhones"]}/>
                    </ul>
                </div>
            </div>
        </nav>

        <CollapseMenu iscollapseShow={iscollapseShow} setIscollapseShow={setIscollapseShow}/>

        <SearchSideModel isSideModelShow={isSideModelShow} setIsSideModelShow={setIsSideModelShow}/>

        <CartSideModel isCartSideModelShow={isCartSideModelShow} setIsCartSideModelshow={setIsCartSideModelShow}/>
        
        {isShowOverlay && (
            <Overlay onClick={() => {setIsDropDownShow(false)}} isVisible={isDropDownShow} isSideModelShow={isSideModelShow}/>
        )}
        {isShowOverlay && (
            <Overlay onClick={() => {
                setIsSideModelShow(false)
                setIsCartSideModelShow(false)
                setIscollapseShow(false)
            }} isVisible={isShowOverlay} isSideModelShow={isSideModelShow || isCartSideModelShow || iscollapseShow}/>
        )}
    </>)
}

export default TopNavigationBar