import { useEffect } from 'react';
import { Route, Routes, useSearchParams, useNavigate } from "react-router-dom";
import UserSideNavBar from '../../Components/Side Navigation Bars/UserSideNavBar';

// Placeholder components for the user's sections
const UserProfile = () => <div className='p-8'><h1 className='text-2xl font-bold'>My Profile</h1></div>;
const UserOrders = () => <div className='p-8'><h1 className='text-2xl font-bold'>My Orders</h1></div>;
const UserWishlist = () => <div className='p-8'><h1 className='text-2xl font-bold'>My Wishlist</h1></div>;

export default function UserDashboard() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedToken = localStorage.getItem('authToken');
        if (token || storedToken) {
            console.log("Token received, saving to localStorage.");
            localStorage.setItem('authToken', token);
            navigate('/user', { replace: true });

        }else  {
            console.log("No token found, redirecting to login.");
             navigate('/login');
         }
        
    }, [searchParams, navigate]);

    // useEffect(() => {
    //     const storedToken = localStorage.getItem('authToken');
    //     if (!storedToken) {
    //         console.log("No token found, redirecting to login.");
    //         navigate('/login');
    //     }
    // }, [navigate]);

    return (
        <div className="w-full h-screen flex">
            <div className="w-[280px] font-sans">
                <UserSideNavBar />
            </div>
            <div className="w-[calc(100vw-280px)] bg-gray-50 h-full overflow-y-auto">
                <Routes>
                    <Route path="/" element={<UserProfile />} /> 
                    <Route path="/orders" element={<UserOrders />} />
                    <Route path="/wishlist" element={<UserWishlist />} />
                </Routes>
            </div>
        </div>
    );
}