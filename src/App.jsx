import React, { useEffect } from 'react'
import Userdashboard from './components/Userdashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Event from './components/Event.jsx'
import EventSettings from './Pages/EventSettings.jsx';
import AdminDashboard from './Pages/AdminDashBord.jsx';
import Registrationform from './components/Registrationform.jsx';
import Userlogs from './components/Userlogs.jsx';
import Login from './components/Login.jsx';
import Boothvisits from './components/Boothvisits.jsx';
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const App = () => {

  const tokenSource = () => localStorage.getItem("token");

  const roleRedirectMap = {
    admin: "/dashboard",
    checkin: "/cam",
    registration: "/User",
  };


  const isValidToken = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  /* ================= ROUTE GUARDS ================= */
  const ProtectedRoute = ({ allowedRoles }) => {
    const token = tokenSource();
    const location = useLocation();

    if (!isValidToken(token)) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (allowedRoles?.length) {
      const { Role } = jwtDecode(token);

      if (!allowedRoles.includes(Role)) {
        const redirectPath = roleRedirectMap[Role] || "/";
        return <Navigate to={redirectPath} replace />;
      }
    }


    return <Outlet />;
  };

  const PublicOnlyRoute = () => {
    const token = tokenSource();

    if (isValidToken(token)) {
      const { Role } = jwtDecode(token);
      const redirectPath = roleRedirectMap[Role] || "/";
      return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
  };


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/" element={<Login />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={["checkin"]} />}>
            <Route path="/cam" element={<Event />} />
            <Route path= '*' element= {<Boothvisits />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["registration"]} />}>
            <Route path='/form' element={<Registrationform />} />
            <Route path="/User" element={<Userlogs />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard" element={<Userdashboard />} />
            <Route path='/cam' element={<Event />} />
            <Route path='/form' element={<Registrationform />} />
            <Route path="/Booth" element={<Boothvisits />} />
            <Route path="/User" element={<Userlogs />} />
          </Route>

          {/* ----------------Admin Routes---------------- */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/EventSettings/*' element={<EventSettings />} />


        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
