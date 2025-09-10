import { Routes, Route } from 'react-router';
import './App.css';
import Home from './Pages/Home';
import TopNavigationBar from "../src/Components/TopNavigationBar";
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserRegistration from './Pages/UserReistration';
import UserDashboard from './Pages/User/UserDashboard';
import ProductOverView from './ProductOverView';
import LoginPage from './Pages/Login';
import { ToastContainer } from 'react-toastify';


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