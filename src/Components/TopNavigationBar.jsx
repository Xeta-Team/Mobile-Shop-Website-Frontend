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
    const [scrolled, setScrolled] = useState(false)
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)       
        return () => window.removeEventListener("scroll", handleScroll)
        
    }, [])

    
return(<>
        <nav className={`w-full fixed top-0 z-20 transition-colors duration-300 ${scrolled ? 'bg-gray-800' : 'bg-transparent'}`}>
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
                className="items-center justify-center hidden w-full md:flex md:flex-col md:w-auto md:order-1 md:text-[19px] mr-12"
                id="navbar-user"
                >
                    <ul className="flex flex-col flex-wrap justify-center items-center font-medium p-4 md:p-0 text-white rounded-lg md:space-x-1 rtl:space-x-reverse md:flex-row max-w-[700px] md:mt-2 md:space-y-0">
                        <NavigrationBarBtn name={"Home"} rowNum={"1"} to={"/"} />
                        <NavigrationBarBtn name={"iPhone"} rowNum={"1"} to={"/iphone"}/>
                        <NavigrationBarBtn name={"iPad"} rowNum={"1"} to={"/ipad"} />
                        <NavigrationBarBtn name={"MacBook"} rowNum={"1"} to={"/mac"} />
                        <NavigrationBarBtn name={"Watch"} rowNum={"1"} to={"/watch"} />
                        <NavigrationBarBtn name={"AirPods"} rowNum={"1"} to={"/airpod"} />
                        <NavigrationBarBtn name={"Accessories"} rowNum={"1"} to={"/accessories"} />
                        <NavigrationBarBtn name={"Mobile Phone"} rowNum={"1"} to={"/mobile-phones"} />
                        <NavigrationBarBtn name={"Per-Owned Devices"}  rowNum={2} to={"/pre-owned-devices"}/>
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