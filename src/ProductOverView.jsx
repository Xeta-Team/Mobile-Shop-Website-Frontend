import { useEffect, useState } from 'react';
import ProductDetails from './Components/Pages/Product Overview/ProductDetails';
import ImageGallery from './Components/Pages/Product Overview/ImageGallery';
import { useParams } from 'react-router';
import axios from 'axios';
import HomeCarousel from './Components/Carousels/HomeCarousel';

export default function ProductOverView() {
  const { productId } = useParams()
  const [productDetails, setProductDetails] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [productPrice,setProductPrice] = useState(null)
  const [cardInfo, setCardInfo] = useState([])
  
  useEffect(() => {
    fetchProductData()
    fetchSliderdata()
  }, [])

  const fetchProductData = async() => {
    try{
      const productRes = await axios.get(`http://localhost:3001/api/products/${productId}`)
      setProductDetails(productRes.data);
      setSelectedColor(productRes.data.variants[0].colorName)
      setSelectedStorage(productRes.data.variants[0].storage)
      setProductPrice(productRes.data.variants[0].price)
      setIsLoading(false)
    }catch(error){
      console.log(error);
    }
  }

  const fetchSliderdata = async() => {
    try{
      const productRes = await axios.get('http://localhost:3001/api/products/latestPhones')

      setCardInfo(productRes.data.firstFiveDevices)
      setIsLoading(false)
    }catch(error){
      console.log(error);
    }
  }

  return (<>
  {!isLoading && (
    <div className="bg-white text-black min-h-screen font-sans">
      <div className="container mx-auto px-4 mb-4">
        <main className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <ImageGallery images={productDetails.images} mainImage={productDetails.mainImage} alt={productDetails.productName}/>
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
      <HomeCarousel slides={cardInfo} title={"You may also like"}/>
    </div>
  )}
  </>
  );
}

