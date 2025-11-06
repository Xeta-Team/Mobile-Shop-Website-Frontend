import { useEffect } from 'react';
import { Route, Routes, useSearchParams, useNavigate } from "react-router-dom";
import UserSideNavBar from '../../../Components/Side Navigation Bars/UserSideNavBar';
import UserProfilePage from './Dashboard Pages/UserProfilePage';
import UserOrders from './Dashboard Pages/UserOrders';
import UserWishlist from './Dashboard Pages/UserWishlist';


export default function UserDashboard() {

    return (
        <div className="w-full h-screen flex">
            <div className="w-[280px] font-sans">
                <UserSideNavBar />
            </div>
            <div className="w-[calc(100vw-280px)] bg-gray-50 h-full overflow-y-auto">
                <Routes>
                    <Route path="/" element={<UserProfilePage/>} /> 
                    <Route path="/orders" element={<UserOrders />} />
                    <Route path="/wishlist" element={<UserWishlist />} />
                </Routes>
            </div>
        </div>
    );
}