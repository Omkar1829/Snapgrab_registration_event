import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from './Pages/AdminDashBord.jsx';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route path="/admin" element={<AdminDashboard/>} />
       

      </Routes>
    </BrowserRouter>
  )
}

export default App
