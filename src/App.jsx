import React from 'react' 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EventSettings from './Pages/EventSetting'
const App = () => {
  return (
  
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Userdashboard />} /> */}
          {/* <Route path='cam' element={<Camera />} /> */}
          {/* <Route path="/admin" element={<AdminDashboard/>} /> */}
          <Route path="/settings" element={<EventSettings/>} />



        </Routes>
      </BrowserRouter>

    </>)
  
}

export default App
