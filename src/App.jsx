import { Routes, Route } from 'react-router';
import useAuthListener from '../src/Components/EventListners/useAuthListener'; // 1. Import the listener hook
import './App.css';
import Home from './Pages/Home';
import TopNavigationBar from "../src/Components/TopNavigationBar";
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserRegistration from './Pages/UserReistration';
import UserDashboard from './Pages/User/UserDashboard';
import ProductOverView from './ProductOverView';
import { ToastContainer, toast } from 'react-toastify';



const supabase = window.supabase ? window.supabase.createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY) : null;

const App = () => {
  // 3. Call the hook here to activate the listener
  useAuthListener(supabase);

  return (
    <>
    <div className="flex flex-col h-screen">
      {/* <TopNavigationBar /> */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminDashboard/>}/>
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