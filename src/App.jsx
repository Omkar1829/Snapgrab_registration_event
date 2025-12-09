import React from 'react'
<<<<<<< HEAD
import Userdashboard from './components/Userdashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Camera from './components/camera'
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> fffbcc7b5e7c2a9839b25f646066f133c1ca7c0c

import AdminDashboard from './Pages/AdminDashBord.jsx';
const App = () => {
  return (
<<<<<<< HEAD
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Userdashboard />} />
          <Route path='cam' element={<Camera/>} />
        </Routes>
      </BrowserRouter>
    </>
=======
    <BrowserRouter>
      <Routes>

        
        <Route path="/admin" element={<AdminDashboard/>} />
       

      </Routes>
    </BrowserRouter>
>>>>>>> fffbcc7b5e7c2a9839b25f646066f133c1ca7c0c
  )
}

export default App
