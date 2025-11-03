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
        <nav className={`w-full top-0 z-20 transition-colors duration-300`}>
            <div className={`bg-black flex items-center justify-between mx-auto px-4 lg:px-8 h-[120px]`}>
                <CollapseBtn setIscollapseShow={setIscollapseShow}/>
                
                <a
                href="/"
                className="flex"
                >
                    <img
                        src={shopLogoWhite}
                        className="h-[80px] min-w-[270px] m-auto"
                        alt="Flowbite Logo"
                    />
                </a>
                
                <NavigrationBarActionBtns setIsSideModelShow={setIsSideModelShow} setIsCartSideModelShow={setIsCartSideModelShow}/>

                <div
                className=" justify-center lg:text-[18px]  hidden w-full md:flex md:w-auto"
                id="navbar-user"
                >
                    <ul className="flex flex-wrap justify-center font-medium  text-white rounded-lg lg:space-x-2 md:space-x-0 rtl:space-x-reverse md:flex-row max-w-[800px] md:space-y-0">
                        <NavigrationBarBtn name={"Home"} to={"/"} />
                        <NavigrationBarBtn name={"iPhone"} to={"/iphone"}/>
                        <NavigrationBarBtn name={"iPad"} to={"/ipad"} />
                        <NavigrationBarBtn name={"MacBook"} to={"/mac"} />
                        <NavigrationBarBtn name={"Watch"} to={"/watch"} />
                        <NavigrationBarBtn name={"AirPods"} to={"/airpod"} />
                        <NavigrationBarBtn name={"Accessories"} to={"/accessories"} />
                        <NavigrationBarBtn name={"Mobile Phone"} to={"/mobile-phones"} />
                        <NavigrationBarBtn name={"Per-Owned Devices"}  to={"/pre-owned-devices"}/>
                 
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