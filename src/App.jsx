import { Routes, Route } from 'react-router';
import './App.css';
import Home from './Pages/Home';
import TopNavigationBar from "../src/Components/TopNavigationBar";
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserRegistration from './Pages/UserReistration';
import UserDashboard from './Pages/User/UserDashboard';
import LoginPage from './Pages/Login';
import ProductOverView from './ProductOverView';
import { ToastContainer, toast } from 'react-toastify';


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
          <Route path="/user" element={<UserDashboard />}/>
          <Route path='/product/:productId' element={<ProductOverView/>}/>
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
    </div>
    </>
  )
} 

export default App;