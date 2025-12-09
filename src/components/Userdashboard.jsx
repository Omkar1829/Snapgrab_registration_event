import React, { useState } from 'react';
import { Users, UserCheck, Store, Clock, TrendingUp, MapPin, Calendar, Download, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventDashboard = () => {

    const navigate = useNavigate();

    const [timeRange, setTimeRange] = useState('today');

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

    const cityData = [
        { city: 'Mumbai', count: 0, percentage: 0 },
        { city: 'Delhi', count: 0, percentage: 0 },
        { city: 'Bangalore', count: 1, percentage: 100 },
        { city: 'Pune', count: 0, percentage: 0 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
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

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default EventDashboard;