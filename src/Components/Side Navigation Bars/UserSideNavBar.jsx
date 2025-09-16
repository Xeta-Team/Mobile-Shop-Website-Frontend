import { useNavigate } from "react-router-dom";
import Btn from "./SideBarComponents/Btn";
import Logo from "../../assest/logoTxt.png";

const UserSideNavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <aside id="sidebar-user" className="w-full h-full border-r">
            <div className="h-[70px] w-[60%] m-auto flex items-center justify-center pt-10">
                <img src={Logo} onClick={() => {navigate('/')}} alt="Mobile 4N Shop Logo" className="cursor-pointer"/>
            </div>
            <div className="h-full px-1 py-7 overflow-y-auto">
                <ul className="space-y-2">
                    <li><span className="pl-5 text-[11px] text-gray-400">MY ACCOUNT</span></li>
                    <Btn to={"/user"} lable={"My Profile"}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0112.28 0C16.43 19.18 14.03 20 12 20z" fill="currentColor"></path></svg>
                    </Btn>
                    <Btn to={"/user/orders"} lable={"My Orders"}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 20h10v-1H7v1zM20 4H4v13h16V4zm-2 2v9H6V6h12z" fill="currentColor"></path></svg>
                    </Btn>
                    <Btn to={"/user/wishlist"} lable={"Wishlist"}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"></path></svg>
                    </Btn>
                    <li className="relative group text-[13px] font-medium pt-4">
                         <div className="px-3">
                            <button onClick={handleLogout} className="flex items-center p-2 w-full text-gray-900 rounded-lg hover:bg-gray-100 group">
                                <span className="w-[20px] h-[20px] text-gray-500"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 17l-4-4m0 0l-4 4m4-4V3m4 6v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                                <span className="ms-3">Logout</span>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default UserSideNavBar;