import { Link } from "react-router-dom"
const NavigrationBarBtn = ({name ,to}) => {
    return(<>
    <li className="relative group"
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
        <Link to={to} className="absolute 
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
    </li>
    </>)
}

export default NavigrationBarBtn