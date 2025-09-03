import { Link } from "react-router"
const NavigrationBarBtn = ({name, rowNum, dropdownItems, setIsDropDownShow}) => {
    return(<>
    <li className="relative group"
    onMouseEnter={() => {setIsDropDownShow(true)}}
    onMouseLeave={() => {setIsDropDownShow(false)}}
    >
        <span
            href="#"
            className="block
                py-2
                px-3
                transition-all
                duration-400
                ease-in-out
                group-hover:-translate-y-3
                group-hover:opacity-0
                group-hover:cursor-pointer
                pointer-events-none
                group-hover:pointer-events-auto
                "
        >
            {name}
        </span>
        <Link className="absolute 
            inset-0 
            flex 
            items-center 
            justify-center 
            rounded-full 
            bg-white 
            text-black 
            opacity-0 
            translate-y-3 
            transition-all 
            duration-300 
            ease-in-out
            group-hover:translate-y-0
            group-hover:opacity-100
            group-hover:cursor-pointer
            pointer-events-none
            group-hover:pointer-events-auto
            ">
            {name}
        </Link>
        
        {dropdownItems && (
            <div>
                <div className="absolute w-full h-full bg-transparent"/>
                <ul className={`absolute bg-black w-[210px] pointer-events-none ${rowNum == 1 ? "pt-[30px]" : "pt-[10px]"} ${rowNum == 1 ? "top-[80px]" : "top-[60px]"} group-hover:pointer-events-auto group-hover:flex-col space-y-3 text-[15px] rounded-b-2xl p-4 transform translate-y-[-30px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all ease-out duration-300 overflow-visible z-20`}>
                    {dropdownItems.map((item, index) => (
                        <li key={index} style={{ transitionDelay: `${index * 100}ms` }} className="px-5 opacity-0 transform translate-x-[100px] duration-0 transition-all ease-out group-hover:duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                            <span className="relative
                                before:absolute before:bottom-0 before:left-0
                                before:h-[1px] before:w-full before:bg-white
                                before:origin-left before:scale-x-0 before:transition-transform before:duration-300
                                hover:before:scale-x-100
                                hover:cursor-pointer">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </li>
    </>)
}

export default NavigrationBarBtn