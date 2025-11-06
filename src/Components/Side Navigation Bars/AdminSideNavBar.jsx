import React from 'react';
import Btn from "./SideBarComponents/Btn";
import DropDownBtn from "./SideBarComponents/DropDownBtn";
import Logo from "../../assest/logoTxt.png"
import { useNavigate } from "react-router-dom";

const AdminSideNavBar = () => {
    const navigate = useNavigate();

    // MODIFIED: This function now includes a confirmation step
    const handleLogout = () => {
        // Display a confirmation dialog and proceed only if the user confirms.
        const confirmLogout = window.confirm("Do you want to log out?");
        
        if (confirmLogout) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            navigate('/login');
        }
        // If the user clicks "Cancel", nothing happens.
    };

    return (
        <>
            <aside id="sidebar-multi-level-sidebar" className="w-full h-full">
                <div className="h-[70px] w-[60%] m-auto">
                    <a href="/"><img src={Logo} className="" alt="Logo" /></a>
                </div>

                <div className="h-full px-1 py-7 overflow-y-auto dark:bg-gray-800">
                    <ul className="space-y-2">
                        <li>
                            <span className="pl-5 text-[11px] text-gray-400">MAIN MENU</span>
                        </li>

                        <Btn to={"/admin/dashboard"} lable={"Dashboard"}>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 12C12 11.4477 12.4477 11 13 11H19C19.5523 11 20 11.4477 20 12V19C20 19.5523 19.5523 20 19 20H13C12.4477 20 12 19.5523 12 19V12Z" strokeWidth="2" strokeLinecap="round"></path> <path d="M4 5C4 4.44772 4.44772 4 5 4H8C8.55228 4 9 4.44772 9 5V19C9 19.5523 8.55228 20 8 20H5C4.44772 20 4 19.5523 4 19V5Z" strokeWidth="2" strokeLinecap="round"></path> <path d="M12 5C12 4.44772 12.4477 4 13 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H13C12.4477 8 12 7.55228 12 7V5Z" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
                        </Btn>

                        <li>
                            <span className="pl-5 text-[11px] text-gray-400">ALL PAGES</span>
                        </li>

                        <DropDownBtn lable={"Products"}>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 3V4.4C10 4.96005 10 5.24008 10.109 5.45399C10.2049 5.64215 10.3578 5.79513 10.546 5.89101C10.7599 6 11.0399 6 11.6 6H12.4C12.9601 6 13.2401 6 13.454 5.89101C13.6422 5.79513 13.7951 5.64215 13.891 5.45399C14 5.24008 14 4.96005 14 4.4V3M9.2 21H14.8C15.9201 21 16.4802 21 16.908 20.782C17.2843 20.5903 17.5903 20.2843 17.782 19.908C18 19.4802 18 18.9201 18 17.8V6.2C18 5.0799 18 4.51984 17.782 4.09202C17.5903 3.71569 17.2843 3.40973 16.908 3.21799C16.4802 3 15.9201 3 14.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V17.8C6 18.9201 6 19.4802 6.21799 19.908C6.40973 20.2843 6.71569 20.5903 7.09202 20.782C7.51984 21 8.07989 21 9.2 21Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        </DropDownBtn>

                        <Btn to={"/admin/users"} lable={"Users"}>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 15C21.2091 15 23 16.7909 23 19V21H21M16 10.874C17.7252 10.4299 19 8.86383 19 6.99999C19 5.13615 17.7252 3.57005 16 3.12601M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7ZM5 15H13C15.2091 15 17 16.7909 17 19V21H1V19C1 16.7909 2.79086 15 5 15Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        </Btn>
                    </ul>
                    <li className="relative group text-[13px] font-medium pt-4">
                        <div className="px-3">
                            <button onClick={handleLogout} className="flex items-center p-2 w-full text-gray-900 rounded-lg hover:bg-gray-100 group">
                                <span className="w-[20px] h-[20px] text-gray-500">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 17l-4-4m0 0l-4 4m4-4V3m4 6v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                                <span className="ms-3">Logout</span>
                            </button>
                        </div>
                    </li>
                </div>
            </aside>
        </>
    );
};

export default AdminSideNavBar; 