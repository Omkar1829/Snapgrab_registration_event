import React from 'react'
import Userdashboard from './components/Userdashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Camera from './components/camera'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Userdashboard />} />
          <Route path='cam' element={<Camera/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
