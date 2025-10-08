import { NavLink } from "react-router-dom";

const DropDownMenu = ({ dropdownVisible, dropDownItems }) => {
    return (
        <ul
            id="dropdown-example"
            className={`${dropdownVisible ? "opacity-100" : "opacity-0 pointer-events-none absolute"} top-full left-0 w-full transition-transform duration-500 ease-out py-2 space-y-2 overflow-y-hidden overflow-x-hidden`}
        >
            {dropDownItems.map((item, index) => (
                <li 
                    key={item.name || index} // Added a unique key prop to the list item
                    className={`
                        ${dropdownVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} transition-transform duration-500 ease-in-out
                    `}
                    style={{ transitionDelay: `${index * 100}ms` }}
                >
                    <NavLink
                        to={item.to}
                        className={({ isActive }) => `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group ${isActive && "bg-gray-100"} hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                    >
                        {item.name}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
};

export default DropDownMenu;
