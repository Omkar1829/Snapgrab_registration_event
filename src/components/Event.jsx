import React from 'react'
import { Store, Calendar, Camera, LogOut, Users, UserCheck, Clock, Ticket, Zap, SwitchCamera } from 'lucide-react';
import Webcam from "react-webcam";
import { useRef, useState } from "react";
import Header from './Header';



const Event = () => {

    const webcamRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);


    const stats = [
        {
            label: 'Total Registrations',
            value: 1,
            change: '+0%',
            icon: Users,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Check-ins',
            value: 1,
            change: '100%',
            icon: UserCheck,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Booth Visits',
            value: 0,
            change: '0%',
            icon: Store,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            label: 'Remaining',
            value: 0,
            change: '0%',
            icon: Clock,
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    const registrationTypes = [
        {
            id: '1',
            title: 'VIP Registration',
            icon: Ticket,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: '2',
            title: 'Standard Registration',
            icon: Users,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: '3',
            title: 'Normal Registration',
            icon: Calendar,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: '4',
            title: 'Booth 1',
            icon: Calendar,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: '5',
            title: 'Booth 2',
            icon: Calendar,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: '6',
            title: 'Booth 3',
            icon: Calendar,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: '7',
            title: 'Booth 1',
            icon: Calendar,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: '8',
            title: 'Booth 2',
            icon: Calendar,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: '9',
            title: 'Booth 3',
            icon: Calendar,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: '10',
            title: 'Booth 1',
            icon: Calendar,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: '11',
            title: 'Booth 2',
            icon: Calendar,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: '12',
            title: 'Booth 3',
            icon: Calendar,
            color: 'from-blue-500 to-cyan-600',
        },

    ];

    const handleCameraOpen = () => {
        setIsCameraOpen(false)
        console.log("ashish")
    }

    return (
        <>
           <Header/>

            <main className="max-w-7xl mx-auto px-6 pb-12">

                {isCameraOpen ? (
                    // Camera modal
                    <div className='flex justify-center mt-20'>
                        <div className=" p-4 w-[90%] max-w-md relative">

                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                mirrored
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "user" }}
                                className="w-full rounded-lg "
                            />
                             <span className='bg-white/50 px-2 py-2 absolute bottom-6 left-5 hover:bg-yellow-300 flex justify-center items-center ml-1 rounded-full cursor-pointer'><Zap size={24}/></span>
                             <span className='bg-white/50 px-2 py-2 absolute bottom-6 right-5 hover:bg-yellow-300 flex justify-center items-center ml-1 rounded-full cursor-pointer'> <SwitchCamera /></span>
                               
                            <button
                                onClick={() => setIsCameraOpen(false)}
                                className="w-2/3 px-52 py-1 bg-red-500 text-white rounded-sm font-medium hover:bg-red-600 transition cursor-pointer mt-3 absolute flex justify-center items-center'
                                "
                            >
                                Exit
                            </button>

                        </div>
                    </div>

                ) : (
                    // Registration
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                        {registrationTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <div
                                    key={type.id}
                                    onClick={() => setIsCameraOpen(true)}
                                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                    <div className="relative p-6">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {type.title}
                                        </h3>
                                    </div>

                                    <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${type.color} rounded-full opacity-10 transform group-hover:scale-150 transition-transform duration-500`} />
                                </div>
                            );
                        })}
                    </div>
                )}

            </main>
        </>
    )
}

export default Event
