import React from 'react'
import Userdashboard from './components/Userdashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Camera from './components/camera'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from './Pages/AdminDashBord.jsx';
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Userdashboard />} />
          <Route path='cam' element={<Camera />} />
          <Route path="/admin" element={<AdminDashboard />} />


        </Routes>
      </BrowserRouter>

    </>)
}

export default App
