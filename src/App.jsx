import { Routes, Route } from 'react-router';
import './App.css';
import Home from './Pages/Home';
import AdminDashboard from './Pages/Dashboards/Admin/AdminDashboard.jsx';
import UserRegistration from './Pages/UserReistration';
import UserDashboard from './Pages/Dashboards/User/UserDashboard.jsx';
import ProductOverView from './Pages/Product Overview/ProductOverView.jsx';
import IphonePage from './Pages/ProductPages/Iphone';
import MacPage from './Pages/ProductPages/MacBook';
import LoginPage from './Pages/Login';
import { ToastContainer } from 'react-toastify';
import IpadPage from './Pages/ProductPages/Ipad';
import WatchPage from './Pages/ProductPages/Iwatch';
import AirpodPage from './Pages/ProductPages/Airpod';
import Checkout from './Pages/Order/Checkout';
import EditProductPage from './Pages/Dashboards/Admin/Dashboard Pages/Products/EditProductPage.jsx';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute';
import ProtectedUserRoute from './Components/ProtectedUserRoute'; 
import AccessoriesPage from './Pages/ProductPages/Accessories.jsx'; 
import MobilePhonesPage from './Pages/ProductPages/MobilePhones.jsx'
import PreOwnedPage from './Pages/ProductPages/PreOwnedPage.jsx';
import PrivacyPolicyPage from './Components/PrivacyPolicyPage.jsx';
const App = () => {
  return (
    <>
    <div className="flex flex-col h-screen">

      <main className="flex-1">
        
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<UserRegistration />}/>
          <Route path='/product/:productId' element={<ProductOverView/>}/>
          <Route path="/iphone" element={<IphonePage/>} />
          <Route path="/mac" element={<MacPage/>} />
          <Route path='/ipad' element={<IpadPage/>}/>
          <Route path='/watch' element={<WatchPage/>}/>
          <Route path='/airpod' element={<AirpodPage/>}/>
          <Route path="/accessories" element={<AccessoriesPage />} />
          <Route path="/mobile-phones" element={<MobilePhonesPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pre-owned-devices" element={<PreOwnedPage />} />
          <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />

          {/* Protected Admin Route */}
          <Route element={<ProtectedAdminRoute />}>
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="/admin/*" element={<AdminDashboard/>}/>
          </Route>
          {/* Protected User Route */}
          <Route element={<ProtectedUserRoute />}>
          <Route path="/user/*" element={<UserDashboard />} />
          </Route>

        </Routes>
      </main>
    </div>
          <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"

/>
    </>
  )
} 

export default App;

