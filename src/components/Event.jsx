import React from 'react'
import { Store, Calendar, Camera, LogOut, Users, UserCheck, Clock, Ticket } from 'lucide-react';


const Event = () => {

    // const cards = [
    //     { id: 1, title: "VIP Registration" },
    //     { id: 2, title: "Standard Registration " },
    //     { id: 3, title: "Normal Registration" },
    // ];

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
            id: 'vip',
            title: 'VIP Registration',
            icon: Ticket,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: 'standard',
            title: 'Standard Registration',
            icon: Users,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: 'normal',
            title: 'Normal Registration',
            icon: Calendar,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: 'normal',
            title: 'Booth 1',
            icon: Calendar,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: 'normal',
            title: 'Booth 2',
            icon: Calendar,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: 'normal',
            title: 'Booth 3',
            icon: Calendar,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: 'normal',
            title: 'Booth 1',
            icon: Calendar,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: 'normal',
            title: 'Booth 2',
            icon: Calendar,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: 'normal',
            title: 'Booth 3',
            icon: Calendar,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: 'normal',
            title: 'Booth 1',
            icon: Calendar,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            id: 'normal',
            title: 'Booth 2',
            icon: Calendar,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: 'normal',
            title: 'Booth 3',
            icon: Calendar,
            color: 'from-blue-500 to-cyan-600',
        },

    ];

    return (
        <>
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="w-full mx-auto px-6 py-4 flex justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                EventRegister<span className="text-indigo-600">.in</span>
                            </h1>
                            <p className="text-sm text-slate-500">Admin Dashboard</p>
                        </div>
                    </div>


                    <div className='flex items-center gap-4'>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium border-none cursor-pointer flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                            <Store className="w-4 h-4" />
                            Booth Visits
                        </button>
                        <button className='cursor-pointer' onClick={() => navigate('cam')}>
                            <Camera />
                        </button>
                        <button className='cursor-pointer'>
                            <LogOut />
                        </button>
                    </div>
                </div>
            </header>



            {/* <div className='grid grid-cols-3 md:grid-cols-3 mt-10 translate-x-28'>
                {cards.map((item) => ( 
                <div key={item.id} className='w-full md:w-44 h-40 bg-white shadow-lg flex items-center justify-center rounded-lg truncate'>
                    <span className='text-lg'> 
                        {item.title}
                    </span>
                </div>
                ))}
            </div> */}

            <main className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {registrationTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <div
                                key={type.id}
                                onMouseEnter={() => setHoveredCard(type.id)}
                                onMouseLeave={() => setHoveredCard(null)}
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
            </main>
        </>
    )
}

export default Event
