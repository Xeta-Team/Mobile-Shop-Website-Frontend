import { Link } from "react-router";
const RecentViews = ({recentItems}) => {
    return(<>
    <div className="text-black flex flex-col h-full px-[20px] md:px-[48px]">
        {recentItems.length > 0 ? (
            <div className="text-[#171717] font-inter-sans space-y-3">
                {recentItems.map((item, index) => (
                    <div key={index} className="py-6 border-b border-gray-200 flex gap-6">
                        <div className="w-[80px] h-[80px] md:w-[96px] md:h-[96px] overflow-hidden rounded-lg hover:cursor-pointer">
                            <img
                                src={item.image}
                                className="w-full h-full object-contains transition-transform duration-200 ease-in-out hover:scale-105"
                            />
                        </div>
                        <div className="space-y-1">
                            <Link className="font-medium hover-underline">
                                {item.title}
                            </Link>
                            <p className="text-[14px]"><span className="text-[11.2px]">From </span>Rs {item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                ))}
            </div>
        ): (<div className="text-[#171717] font-inter-sans text-2xl md:text-[27px] font-bold px-17 text-center">
            <p>Your recently viewed is empty.</p>
        </div>)}
    </div>
    </>)
}

export default RecentViews