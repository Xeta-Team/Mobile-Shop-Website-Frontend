import { Routes, Route } from 'react-router';
import './App.css';
import Home from './Pages/Home';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserRegistration from './Pages/UserReistration';
import UserDashboard from './Pages/User/UserDashboard';
import ProductOverView from './ProductOverView';
import IphonePage from './Pages/ProductPages/Iphone';
import MacPage from './Pages/ProductPages/MacBook';
import LoginPage from './Pages/Login';
import { ToastContainer } from 'react-toastify';
import IpadPage from './Pages/ProductPages/Ipad';
import WatchPage from './Pages/ProductPages/Iwatch';
import AirpodPage from './Pages/ProductPages/Airpod';
import Checkout from './Pages/Order/Checkout';

const App = () => {
  return (
    <>
      <main className="overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminDashboard/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<UserRegistration />}/>
          <Route path='/product/:productId' element={<ProductOverView/>}/>
          <Route path="/user/*" element={<UserDashboard />}/>
          <Route path="/iphone" element={<IphonePage/>} />
          <Route path="/mac" element={<MacPage/>} />
          <Route path='/ipad' element={<IpadPage/>}/>
          <Route path='/watch' element={<WatchPage/>}/>
          <Route path='/airpod' element={<AirpodPage/>}/>
          <Route path="/checkout" element={<Checkout />} />

        </Routes>
      </main>
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

