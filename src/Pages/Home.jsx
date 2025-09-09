import { useEffect } from "react"
import HomeCarousel from "../Components/Carousels/HomeCarousel"
import SliderCard from "../Components/Carousels/SliderCards"
import TopNavigationBar from "../Components/TopNavigationBar"
import axios from "axios"
import { useState } from "react"

const Home = () => {
  const [cardInfo, setCardInfo] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    fetchSliderdata()
  }, [])

  const fetchSliderdata = async() => {
    try{
      const productRes = await axios.get('http://localhost:3001/api/products/latestPhones')

      setCardInfo(productRes.data.firstFiveDevices)
      setIsLoading(false)
    }catch(error){
      console.log(error);
    }
  }
    return(<>
        <TopNavigationBar/>
        <div className="p-8 min-h-screen overflow-visible">
            <SliderCard/>
            {!isLoading && <HomeCarousel slides={cardInfo}/>}
        </div>
        
    </>)
}

export default Home