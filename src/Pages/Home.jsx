import HomeCarousel from "../Components/Carousels/HomeCarousel"
import TopNavigationBar from "../Components/TopNavigationBar"
import image1 from "../assest/image1.png"
import image2 from "../assest/image2.png"
import image3 from "../assest/image3.png"
const Home = () => {
    const cardInfo = [{
        imageUrls: [image1, image2, image3],
        title: "Per Owned Iphone 16 Pro Max",
        price: 240000,
        colors: ["black", "white"]
      },  {
        imageUrls: [image1, image2, image3],
        title: "Per Owned Iphone 16 Pro Max",
        price: 240000,
        colors: ["black", "white"]
      },  {
        imageUrls: [image1, image2, image3],
        title: "Per Owned Iphone 16 Pro Max",
        price: 240000,
        colors: ["black", "white"]
      },
    {
        imageUrls: [image1, image2, image3],
        title: "Per Owned Iphone 16 Pro Max",
        price: 240000,
        colors: ["black", "white"]
      },  {
        imageUrls: [image1, image2, image3],
        title: "Per Owned Iphone 16 Pro Max",
        price: 240000,
        colors: ["black", "white"]
      },  {
        imageUrls: [image1, image2, image3],
        title: "Per Owned Iphone 16 Pro Max",
        price: 240000,
        colors: ["black", "white"]
      },  {
        imageUrls: [image1, image2, image3],
        title: "Per Owned Iphone 16 Pro Max",
        price: 240000,
        colors: ["black", "white"]
      }]
    return(<>
        <div className="p-8 min-h-screen overflow-visible">
            <HomeCarousel slides={cardInfo} />
        </div>
    </>)
}

export default Home