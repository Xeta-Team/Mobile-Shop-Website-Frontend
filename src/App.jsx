import { Routes, Route } from 'react-router';
import './App.css';
import Home from './Pages/Home';
import TopNavigationBar from "../src/Components/TopNavigationBar";
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserRegistration from './Pages/UserReistration';
import UserDashboard from './Pages/User/UserDashboard';


const App = () => {


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

        </Routes>
      </main>
    </div>
    </>
  )
} 

export default App;
