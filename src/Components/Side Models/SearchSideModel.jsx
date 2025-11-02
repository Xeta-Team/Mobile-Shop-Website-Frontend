import {useState,useRef, useEffect} from "react"
import { Link } from "react-router"
import { handleTouchEnd, handleTouchMove, handleTouchStart } from "./Side Model Fuctions/TouchHanddle"
import apiClient from "../../api/axiosConfig"
import { toast } from 'react-toastify';

const SearchSideModel = ({isSideModelShow, setIsSideModelShow}) => {
    const [findProduct, setFindProduct] = useState([])
    const [seachText, setSearchText] = useState("")
    const startYRef = useRef(0);
    const currentYRef = useRef(0);
    const [translateY, setTranslateY] = useState(0);
    const [disableTransition, setDisableTransition] = useState(false);
    const [products, setAllProducts] = useState([])
    
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
        const getAllProductDetails = async() => {
            try{
                const productsRes = await apiClient.get('/products/searchbar/products')
                setAllProducts(productsRes.data)  
            }catch(error){
                toast.error('Something went wrong! Please try again..!')
            }
        }
        getAllProductDetails()
    },[])
    
    const handdleInput = (event) => {
        const input = event.target.value.toLowerCase()
        setSearchText(input)
        if(input == ""){
            setFindProduct([])
        }else{
            setFindProduct(products.filter(product => product.name.toLowerCase().includes(input)))
        }  
    }
    console.log(findProduct);
    
    return(<>
        <div className={`bottom-0 rounded-t-[20px] w-full h-6/7 md:h-[100vh] md:top-0 md:right-0 bg-white md:w-2/6 md:rounded-t-[0px] md:rounded-l-[50px] fixed z-20
            ${
              disableTransition ? "transition-none" : "transition-transform duration-1000 ease-out"
            }
            ${isSideModelShow ? "translate-y-0 md:translate-x-0 pointer-events-auto" : "translate-y-full md:translate-y-0 md:translate-x-full pointer-events-none"}`}
            style={{
                transform:
                isSideModelShow && translateY > 0
                    ? `translateY(${translateY}px)`
                    : "",
            }}
            onTouchStart={(event) => {handleTouchStart(event, startYRef)}}
            onTouchMove={(event) => {handleTouchMove(event, setTranslateY, currentYRef, startYRef)}}
            onTouchEnd={(event) => {handleTouchEnd(setIsSideModelShow, translateY, setTranslateY)}}
            >
            
            <div className="flex flex-col h-full">
                <div className="relative border-b-1 border-gray-200 px-[20px] pt-[32px] pb-[24px] md:p-10 flex justify-between">
                    <hr className="w-12 border-2 rounded-full md:hidden absolute top-4 left-[43%] border-gray-200"/>
                    <h1 className="text-[24px] md:text-[30px] text-black font-bold font-inter-sans">Search</h1>
                    <button className="rounded-full bg-black w-[48px] h-[48px] hidden md:flex justify-center items-center hover:cursor-pointer
                        transition-transform duration-300 ease-in-out hover:rotate-90
                    "
                        onClick={() => {setIsSideModelShow(false)}}
                    >
                        <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 10.0234 43.0234 C 9.2266 43.8203 9.2031 45.1797 10.0234 45.9766 C 10.8438 46.7734 12.1797 46.7734 13.0000 45.9766 L 28.0000 30.9766 L 43.0000 45.9766 C 43.7969 46.7734 45.1563 46.7969 45.9766 45.9766 C 46.7734 45.1562 46.7734 43.8203 45.9766 43.0234 L 30.9531 28.0000 L 45.9766 13.0000 C 46.7734 12.2031 46.7969 10.8437 45.9766 10.0469 C 45.1328 9.2266 43.7969 9.2266 43.0000 10.0469 L 28.0000 25.0469 L 13.0000 10.0469 C 12.1797 9.2266 10.8203 9.2031 10.0234 10.0469 C 9.2266 10.8672 9.2266 12.2031 10.0234 13.0000 L 25.0234 28.0000 Z"></path></g></svg>
                    </button>
                </div>
                <div className="md:pt-[32px] md:px-[48px] pt-[24px] px-[20px] overflow-y-auto">
                    <input type="text" className="w-full h-[50px] md:h-[62px] bg-gray-100 outline-0 rounded-lg 
                    text-black font-medium font-inter-sans placeholder:text-gray-400 px-8 text-md md:text-lg" placeholder="Search for ..."
                    onChange={(event) => {handdleInput(event)}}
                    />
                    {seachText !== "" && findProduct.length === 0 ?
                        <div className="flex flex-col justify-center items-center gap-5 py-[32px] w-[300px] text-black text-center m-auto font-inter-sans">
                            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 106.059 106.059" xml:space="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M90.546,15.518C69.858-5.172,36.199-5.172,15.515,15.513C-5.173,36.198-5.171,69.858,15.517,90.547 c20.682,20.684,54.341,20.684,75.027-0.004C111.23,69.858,111.229,36.2,90.546,15.518z M84.757,84.758 c-17.494,17.494-45.96,17.496-63.455,0.002c-17.498-17.497-17.496-45.966,0-63.46C38.796,3.807,67.261,3.805,84.759,21.302 C102.253,38.796,102.251,67.265,84.757,84.758z M77.017,74.001c0.658,1.521-0.042,3.286-1.562,3.943 c-1.521,0.66-3.286-0.042-3.944-1.562c-2.893-6.689-9.73-11.012-17.421-11.012c-7.868,0-14.747,4.319-17.522,11.004 c-0.479,1.154-1.596,1.851-2.771,1.851c-0.384,0-0.773-0.074-1.15-0.23c-1.53-0.636-2.255-2.392-1.62-3.921 c3.71-8.932,12.764-14.703,23.063-14.703C64.174,59.371,73.174,65.113,77.017,74.001z M33.24,38.671 c0-3.424,2.777-6.201,6.201-6.201c3.423,0,6.2,2.776,6.2,6.201c0,3.426-2.777,6.202-6.2,6.202 C36.017,44.873,33.24,42.097,33.24,38.671z M61.357,38.671c0-3.424,2.779-6.201,6.203-6.201c3.423,0,6.2,2.776,6.2,6.201 c0,3.426-2.776,6.202-6.2,6.202S61.357,42.097,61.357,38.671z"></path> </g> </g></svg>
                            <p className="text-2xl font-bold">No results found for "{seachText}".</p>
                            <p className="text-[16px]" style={{color:"#171717"}}>Check the spelling or use a different word or phrase.</p>
                        </div> : (findProduct.length > 0 && (
                        <div className="grid grid-cols-1 text-black mt-6 gap-7">
                            <div>
                                <p className="font-inter-sans text-[12px] tracking-[1.5px] text-gray-400 border-b-1 border-gray-200 pb-1">SUGGESTIONS</p>
                                <ul className="pt-2 space-y-1 text-[15px] md:text-[16px] font-medium font-inter-sans">
                                    {findProduct.map((product, index) => (
                                        <li key={index}><Link to={`/product/${product._id}`} className="hover-underline">{product.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="font-inter-sans text-[12px] tracking-[1.5px] text-gray-400 border-b-1 border-gray-200 pb-1">PRODUCTS</p>
                                {findProduct.map((product, index) => (
                                        <div key={index} className="text-black flex flex-row gap-6 space-y-2 mt-3">
                                            <div className="w-[80px] h-[80px] md:w-[96px] md:h-[96px] overflow-hidden rounded-lg hover:cursor-pointer">
                                                <img src={product.base_image} className="w-full h-full object-contains transition-transform duration-200 ease-in-out hover:scale-105"/>
                                            </div>
                                            <div className="space-y-2 font-inter-sans">
                                                <Link to={`/product/${product._id}`} className="font-medium hover-underline text-[15px] md:text-[16px]">{product.name}</Link>
                                                {product.variants.map((v,idx) => (
                                                    <p key={idx} className="text-[14px]" style={{color: "#171717"}}><span className="text-[11.2px]">From </span>Rs {v.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="font-inter-sans sticky bottom-0">
                                <Link className="bg-black p-3 md:p-4 rounded-full text-[14px] md:text-[16px] text-white bottom-0 my-5 flex justify-center items-center gap-2">
                                See all results
                                <svg className="md:w-[28px] md:h-[28px] w-[22px] h-[22px]" width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>)
}

export default SearchSideModel