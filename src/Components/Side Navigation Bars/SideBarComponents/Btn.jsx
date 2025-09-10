import { NavLink } from "react-router"
const Btn = ({to, lable, children}) => {
    return(<>
        <li className="relative group text-[13px] font-medium">
            <div className="px-3">
            <NavLink
                to={to}
                className={({isActive}) => `
                    flex items-center p-2 text-gray-900  rounded-lg group
                    ${isActive ? "text-gray-500 bg-gray-100" : "hover:bg-gray-100"}
                `}
            >
                {({isActive}) => (<>
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-2 bg-black rounded ${isActive ? "flex" : "hidden group-hover:flex"}`}></span>
                <span
                    className={`w-[20px] h-[20px] text-gray-500 stroke-gray-500 group-hover:stroke-gray-900 transition duration-75 ${isActive ? "text-gray-900 stroke-gray-900" : "group-hover:text-gray-900"}`}
                >
                    {children}
                </span>
                <span className="ms-3">{lable}</span>
                </>)}
            </NavLink>
            </div>
        </li>
    </>)
}

export default Btn