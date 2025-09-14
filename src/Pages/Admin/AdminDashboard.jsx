import {Route, Routes, useNavigate} from "react-router-dom"
import AdminSideNavBar from "../../Components/Side Navigation Bars/AdminSideNavBar"
import MainDashboard from "./Dashboard Pages/MainDashboard"
import AllProducts from "./Dashboard Pages/Products/AllProducts"
import AddProduct from "./Dashboard Pages/Products/AddProduct"
import Users from "./Dashboard Pages/Users"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import apiClient from "../../api/axiosConfig"

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')

        if(!token){
            toast.error('Authorization fails! Please login again')
            navigate('/login')
            return
        }

        fetchRole()
    })

    const fetchRole = async() => {
        try{
            const roleResponse = await apiClient.get('/users/role')
            
            if(roleResponse.data == 'user'){
                navigate('/')
                return
            }
            setLoading(false)
            
        }catch(error){
            toast.error(error?.response?.data?.message)
        }
    }
    return(<>
        {!loading && <div className="w-full h-screen flex">
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
        </div>}
    </>)
}

export default AdminDashboard

