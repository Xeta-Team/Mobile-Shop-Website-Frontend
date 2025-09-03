import {useState } from "react"
import DropDownMenu from "./DropDownMenu";
const DropDownBtn = ({children, lable}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)

    return(<>
        <li className="relative group text-[13px] font-medium">
            <span className={`absolute left-0 top-5 -translate-y-1/2 h-8 w-2 bg-black rounded group-hover:flex ${dropdownVisible ? "flex" : "hidden"}`}></span>
            <div className="px-3 relative">
                <button
                    type="button"
                    className={`flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 ${dropdownVisible && "bg-gray-100"}`}
                    aria-controls="dropdown-example"
                    data-collapse-toggle="dropdown-example"
                    onClick={() => {
                    setDropdownVisible(!dropdownVisible);
                    }}
                >
                    <span
                         className={`shrink-0 w-5 h-5 text-gray-500  stroke-gray-500 group-hover:stroke-gray-900 transition duration-75 group-hover:text-gray-900 ${dropdownVisible && "text-gray-900 stroke-gray-900"}`}
                    >
                        {children}
                    </span>
                    <span className="flex-1 text-[13px] font-medium ms-3 text-left rtl:text-right whitespace-nowrap">
                        {lable}
                    </span>
                    <svg
                    className={`w-3 h-3 transition-transform duration-300 ${
                        dropdownVisible ? "rotate-360" : "rotate-270"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                    >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                    </svg>
                </button>
            
                <div className={`overflow-hidden transition-all duration-500 ease-in-out
                   ${dropdownVisible ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                    <DropDownMenu dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} dropDownItems={[{name:"All Products", to:"/admin/all-products"}, {name:"Add Products", to:"/admin/add-product"}]}/>
                </div>
            </div>
        </li>
    </>)
}

export default DropDownBtn