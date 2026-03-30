import React from 'react'
import { Users, UserCheck, Store, Clock, TrendingUp, MapPin, Calendar, Download, Camera, LogOut } from 'lucide-react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Scanners from './Subcomponents/Scanners'

const Header = () => {

    const { Role } = jwtDecode(localStorage.getItem("token"));

    const handleLogout = () => {
        const enterpassword = window.prompt("Please enter password to continue")

        if (!enterpassword) return

        if (enterpassword === "Ashish") {
            localStorage.removeItem('token');
            navigate("/")
        } else {
            alert("Enter correct password")
        }

    }

    const MenuMap = {
        admin: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Camera', path: '/cam' },
            { name: 'Booth Visits', path: '/Booth' },
            { name: 'Registered Users', path: '/User' },
            { name: 'Registration', path: '/form' },
            { name: 'Logout', action: handleLogout },
        ],
        checkin: [
            { name: 'Camera', path: '/cam' },
            { name: 'Logout', action: handleLogout },
        ],
        registration: [
            { name: 'Registered Users', path: '/User' },
            { name: 'Registration', path: '/form' },
            { name: 'Logout', action: handleLogout },
        ]
    }

    const [openSidebar, setOpenSidebar] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="bg-white border-b border-slate-200 shadow-sm">
            <div
                className='w-full h-16 px-3 md:px-6 gap-1 md:gap-2 flex justify-between '
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer"
                        onClick={() => setOpenSidebar(true)}
                    >
                        <Calendar className="w-6 h-6 text-white" />
                    </div>

                    {/* Sidebar Overlay */}
                    {openSidebar && (
                        <div
                            className="fixed inset-0 bg-transparent z-40"
                            onClick={() => setOpenSidebar(false)}
                        />
                    )}

                    {/* Sidebar Drawer */}
                    <div
                        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-6 transform transition-transform duration-300 
                        ${openSidebar ? "translate-x-0" : "-translate-x-full"}`}
                    >
                        <h2 className="text-xl font-semibold mb-4">Menu</h2>

                        <Menu className="flex flex-col gap-2">
                            {MenuMap[Role].map((item, index) => (
                                item.path ? (
                                    <MenuItem key={index} onClick={() => { navigate(item.path); setOpenSidebar(false); }}> {item.name} </MenuItem>
                                ) : (
                                    <MenuItem key={index} onClick={() => { item.action(); setOpenSidebar(false); }}> {item.name} </MenuItem>
                                )
                            ))}
                            {/* <MenuItem onClick={() => navigate('/dashboard')}> Dashboard </MenuItem>
                            <MenuItem onClick={() => navigate('/cam')}> Camera </MenuItem>
                            <MenuItem onClick={handleLogout}> Logout </MenuItem>
                            <MenuItem onClick={() => navigate('/Booth')}> Booth Visits </MenuItem>
                            <MenuItem onClick={() => navigate('/User')}> Registered Users</MenuItem>
                            <MenuItem onClick={() => navigate('/form')}> Registration </MenuItem> */}
                        </Menu>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 cursor-pointer" onClick={() => { navigate("/dashboard") }}>
                            EventRegister<span className="text-indigo-600 cursor-pointer">.in</span>
                        </h1>
                        {/* <p className="text-sm text-slate-500">Admin Dashboard</p> */}
                    </div>


                </div>

                <div className="flex items-center gap-4 mt-4">

                    {/* ✅ Show ONLY on /User */}
                    {location.pathname === "/User" && (
                        <Scanners />
                    )}

                </div>
            </div>
        </header>
    )
}

export default Header
