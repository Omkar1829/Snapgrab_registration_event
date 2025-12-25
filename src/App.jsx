import React from 'react'
import Userdashboard from './components/Userdashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Event from './components/Event.jsx'
import Camera from './components/camera'
import EventSettings from './Pages/EventSettings.jsx';
import AdminDashboard from './Pages/AdminDashBord.jsx';
import Registrationform from './components/Registrationform.jsx';
import Userlogs from './components/Userlogs.jsx';
import Login from './components/Login.jsx';
import Boothvisits from './components/Boothvisits.jsx';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Userdashboard />} />
          <Route path='/cam' element={<Event />} />
          <Route path='/form' element={<Registrationform />} />
          <Route path="/Booth" element={<Boothvisits />} />
          <Route path="/User" element={<Userlogs />} />


          {/* ----------------Admin Routes---------------- */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/EventSettings/*' element={<EventSettings  />} />


        </Routes>
      </BrowserRouter>

    </>
    )
}

export default App
