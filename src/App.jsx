import React from 'react'
import Userdashboard from './components/Userdashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Event from './components/Event.jsx'

import AdminDashboard from './Pages/AdminDashBord.jsx';
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Userdashboard />} />
          <Route path='cam' element={<Event />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>

    </>)
}

export default App
