import {Route, Routes} from "react-router-dom"
import AdminSideNavBar from "../../Components/Side Navigation Bars/AdminSideNavBar"
import MainDashboard from "./Dashboard Pages/MainDashboard"
import AllProducts from "./Dashboard Pages/Products/AllProducts"
import AddProduct from "./Dashboard Pages/Products/AddProduct"
import Users from "./Dashboard Pages/Users"

const AdminDashboard = () => {
    return(<>
        <div className="w-full h-screen flex">
            <div className="w-[280px] font-sans">
                <AdminSideNavBar/>
            </div>
            <div className="w-[calc(100vw-280px)] bg-gray-50 h-full overflow-y-auto">
                <Routes>
                    <Route path="/dashboard" element={<MainDashboard/>}/>
                    <Route path="/all-products" element={<AllProducts/>}/>
                    <Route path="/add-product" element={<AddProduct/>}/>
                    <Route path="/users" element={<Users/>}/>
                </Routes>
            </div>
        </div>
    </>)
}

export default AdminDashboard

