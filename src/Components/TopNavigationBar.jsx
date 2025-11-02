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
            {/* --- All 'md:' prefixes changed to 'lg:' --- */}
            <div className="w-full flex flex-wrap items-center justify-between p-4 ">
                
                {/* Hamburger button: Now hidden on lg screens (1024px) and up */}
                <div className="lg:hidden">
                    <CollapseBtn setIscollapseShow={setIscollapseShow}/>
                </div>
                
                {/* Logo: Resized for mobile, restored for desktop, and ordered */}
                <a
                    href="/"
                    className="flex lg:order-1" // Changed to lg:order-1
                >
                    <img
                        src={shopLogoWhite}
                        className="h-[60px] w-auto lg:h-[80px]" // Changed to lg:h-[80px]
                        alt="Flowbite Logo"
                    />
                </a>
                
                {/* --- HTML ORDER FIX: Swapped Nav Links and Action Buttons --- */}

                {/* Nav Links: Now visible on desktop, ordered, and width set to auto */}
                <div
                    // All 'md:' prefixes changed to 'lg:'
                    className="items-center justify-between hidden w-full lg:flex lg:flex-col lg:w-auto lg:order-2 lg:text-[17px]"
                    id="navbar-user"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 text-white rounded-lg md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0">
                        <NavigrationBarBtn name={"Home"} rowNum={"1"} to={"/"} />
                        <NavigrationBarBtn name={"iPhone"} rowNum={"1"} to={"/iphone"}/>
                        <NavigrationBarBtn name={"iPad"} rowNum={"1"} to={"/ipad"} />
                        <NavigrationBarBtn name={"MacBook"} rowNum={"1"} to={"/mac"} />
                        <NavigrationBarBtn name={"Watch"} rowNum={"1"} to={"/watch"} />
                        <NavigrationBarBtn name={"AirPods"} rowNum={"1"} to={"/airpod"} />
                        <NavigrationBarBtn name={"Accessories"} rowNum={"1"} to={"/accessories"} />
                        <NavigrationBarBtn name={"Mobile Phone"} rowNum={"1"} to={"/mobile-phones"} />
                    </ul>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 text-white rounded-lg md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0"> 
                        <NavigrationBarBtn name={"Per-Owned Devices"}  rowNum={2} to={"/pre-owned-devices"}/>
                    </ul>
                </div>

                {/* Action Buttons: Ordered to be on the far right on desktop */}
                <div className="lg:order-3"> {/* Changed to lg:order-3 */}
                    <NavigrationBarActionBtns setIsSideModelShow={setIsSideModelShow} setIsCartSideModelShow={setIsCartSideModelShow}/>
                </div>
            </div>
        </nav>

        <CollapseMenu iscollapseShow={iscollapseShow} setIscollapseShow={setIscollapseShow}/>

        <SearchSideModel isSideModelShow={isSideModelShow} setIsSideModelShow={setIsSideModelShow}/>

        <CartSideModel isCartSideModelShow={isCartSideModelShow} setIsCartSideModelshow={setIsCartSideModelShow}/>
        
        {/* Combined both overlays into one logical component */}
        {isShowOverlay && (
            <Overlay 
                onClick={() => {
                    setIsDropDownShow(false);
                    setIsSideModelShow(false);
                    setIsCartSideModelShow(false);
                    setIscollapseShow(false);
                }} 
                isVisible={isShowOverlay}
            />
        )}
    </>)
}

export default TopNavigationBar