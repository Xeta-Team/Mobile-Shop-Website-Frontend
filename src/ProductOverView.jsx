import { useEffect, useState } from 'react';
import ProductDetails from './Components/Pages/Product Overview/ProductDetails';
import ImageGallery from './Components/Pages/Product Overview/ImageGallery';
import { useParams } from 'react-router';
import axios from 'axios';
import HomeCarousel from './Components/Carousels/HomeCarousel';
import TopNavigationBar from './Components/TopNavigationBar';
import Footer from './Components/Footer';
import { PuffLoader } from "react-spinners";
import { toast } from 'react-toastify';

export default function ProductOverView() {
  const { productId } = useParams()
  const [productDetails, setProductDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [productPrice,setProductPrice] = useState(null)
  const [cardInfo, setCardInfo] = useState([])
  
  useEffect(() => {
    fetchProductData()
    fetchSliderdata()
  }, [productId])

  const fetchProductData = async() => {
    try{
      const productRes = await axios.get(`http://localhost:3001/api/products/${productId}`)
      setProductDetails(productRes.data);
      setSelectedColor(productRes.data.variants[0].colorName)
      setSelectedStorage(productRes.data.variants[0].storage)
      setProductPrice(productRes.data.variants[0].price)
      setIsLoading(false)
    }catch(error){
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  const fetchSliderdata = async() => {
    try{
      const productRes = await axios.get('http://localhost:3001/api/products/latestPhones')

      setCardInfo(productRes.data.firstFiveDevices)
      setIsLoading(false)
    }catch(error){
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }
  
  
  return (<>
   <TopNavigationBar />
    {productDetails ? (
      <div className="bg-white text-black min-h-screen font-sans">
        <div className="container mx-auto px-4 mb-4">
          <main className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <ImageGallery
                images={productDetails.images || []}
                mainImage={productDetails.mainImage}
                alt={productDetails.productName}
              />
              <ProductDetails
                productId={productId}
                mainImage={productDetails.mainImage}
                productName={productDetails.productName}
                productPrice={productPrice}
                setProductPrice={setProductPrice}
                variants={productDetails.variants}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedStorage={selectedStorage}
                setSelectedStorage={setSelectedStorage}
              />
            </div>
          </main>
        </div>
        <div className="px-4">
          <HomeCarousel slides={cardInfo} title="You may also like" />
        </div>
        <Footer />
      </div>
    ) : (
      <div className='flex items-center justify-center min-h-[500px]'>
        <PuffLoader size={80} />
      </div>
    )}
  </>
  );
}

