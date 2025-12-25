import React from 'react'
import { Users, UserCheck, Store, Clock, TrendingUp, MapPin, Calendar, Download, Camera, LogOut } from 'lucide-react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const Header = () => {



    const handleLogout = () => {
        const enterpassword = window.prompt("Please enter password to continue")

        if (!enterpassword) return

        if (enterpassword === "Ashish") {
            navigate("/")
        } else {
            alert("Enter correct password")
        }

    }

    const [openSidebar, setOpenSidebar] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-slate-200 shadow-sm">
            <div className="w-full mx-auto px-6 py-4 flex justify-between">
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
                             <MenuItem onClick={() => navigate('/dashboard')}> Dashboard </MenuItem>
                            <MenuItem onClick={() => navigate('/cam')}> Camera </MenuItem>
                            <MenuItem onClick={handleLogout}> Logout </MenuItem>
                            <MenuItem onClick={() => navigate('/Booth')}> Booth Visits </MenuItem>
                            <MenuItem onClick={() => navigate('/User')}> Registered Users</MenuItem>
                            <MenuItem onClick={() => navigate('/form')}> Registration </MenuItem>
                        </Menu>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 cursor-pointer" onClick={() => { navigate("/dashboard") }}>
                            EventRegister<span className="text-indigo-600 cursor-pointer">.in</span>
                        </h1>
                        {/* <p className="text-sm text-slate-500">Admin Dashboard</p> */}
                    </div>
                </div>

                {/* <div className='flex items-center gap-4'>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium border-none cursor-pointer flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                            <Store className="w-4 h-4" />
                            Booth Visits
                        </button>
                        <button className='cursor-pointer' >
                            <Camera />
                        </button>
                        <button className='cursor-pointer'>
                            <LogOut />
                        </button>
                    </div> */}
            </div>
        </header>
    )
}

export default Header
