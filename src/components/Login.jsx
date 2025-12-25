import React from 'react'
import { Button, Form, Input, Select } from 'antd';
import config from './config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [Password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (username === "Snapgrab@admin" && Password === "Snapgrab@2025") {
            navigate("/admin")
        } else {
            try {

                const response = await axios.post(`${config.apiUrl}/admin/login`, {
                    name: username,
                    password: Password,
                })
                if (response.data.status === 200) {
                    const token = response.data.token
                    localStorage.setItem('token', token)
                    navigate('/')
                }

            } catch (e) {
                alert("Invalid Credentials")
            }
        }
    }


    return (
        <>
            <div class=" flex items-center justify-center p-5 mt-10">
                <div class="bg-white rounded-lg shadow-2xl p-10 w-full max-w-md shadow-xl">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8 underline">Login</h2>
                    <form id="loginForm" class="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        <div className='relative'>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-13 transform -translate-y-1/2 text-gray-500 cursor-pointer'>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</span>
                        </div>
                        
                        <button
                            type="submit"
                            class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200 active:translate-y-0"
                        >
                            Login
                        </button>
                        <div id="message" class="hidden rounded-lg p-3 text-center text-sm font-medium"></div>
                    </form>
                </div>


            </div>

        </>
    )
}

export default Login
