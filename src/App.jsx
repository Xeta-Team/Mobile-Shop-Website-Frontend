import { Routes,Route } from 'react-router'
import './App.css'
import Home from './Pages/Home'
import TopNavigationBar from "../src/Components/TopNavigationBar"

const App = () => {
  return (
    <>
    <div className="flex flex-col h-screen">
      <TopNavigationBar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
    </>
  )
} 

export default App
