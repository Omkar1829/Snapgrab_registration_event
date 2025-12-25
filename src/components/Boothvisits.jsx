import React from 'react'
import { Store, Calendar, Camera, LogOut, Users, UserCheck, Clock, Ticket, Zap, SwitchCamera } from 'lucide-react';
import Header from './Header';

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


const Boothvisits = () => {
    return (
        <>
            <Header />
            <div className='max-w-7xl mx-auto px-6 pb-12'>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {registrationTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <div
                                key={type.id}
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
            </div>
        </>
    )
}

export default Boothvisits
