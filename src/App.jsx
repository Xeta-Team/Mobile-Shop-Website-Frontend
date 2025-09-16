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


const App = () => {
  return (
    <>
    <div className="flex flex-col h-screen">

      <main className="flex-1 overflow-y-auto">
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

