import React from 'react'
import { Button, Form, Input, Select } from 'antd';


// const handeleSubmit = (values) => {
//     const { Username, Email, EmployeeID, EventID } = values.user.name;
//     if (Username === "Ashish" && Email === "ashish@123" && EmployeeID === "1111" && EventID === "10") {
//         console.log("Registration Sucessfull")
//     } else {
//         alert('invlaid Credentials')
//     }
// }




const Login = () => {
    return (
        <>
            <div class=" flex items-center justify-center p-5 mt-10">
                <div class="bg-white rounded-lg shadow-2xl p-10 w-full max-w-md shadow-xl">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8 underline">Login</h2>
                    <form id="loginForm" class="space-y-6">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                            />
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
