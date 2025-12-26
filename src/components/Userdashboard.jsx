import React, { useState } from 'react';
import { Users, UserCheck, Store, Clock, TrendingUp, MapPin, Calendar, Download, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AgCharts } from "ag-charts-react";
import {
    LegendModule,
    ModuleRegistry,
    PieSeriesModule,
} from "ag-charts-community";
import Header from './Header';



ModuleRegistry.registerModules([LegendModule, PieSeriesModule]);


const EventDashboard = () => {

    const ChartExample = () => {
        const [options, setOptions] = useState({
            data: getData(),
            title: {
                text: "Portfolio Composition",
            },
            background: {
                visible: false,
                fill: "transparent",
            },
            series: [
                {
                    type: "pie",
                    angleKey: "amount",
                    legendItemKey: "asset",
                },
            ],
        });

        return <AgCharts options={options} />;
    };

    function getData() {
        return [
            { asset: "Stocks", amount: 60000 },
            { asset: "Bonds", amount: 40000 },
            { asset: "Cash", amount: 7000 },
            { asset: "Real Estate", amount: 5000 },
            { asset: "Commodities", amount: 3000 },
        ];
    }

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

            <Header/>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                    <stat.icon className={`w-6 h-6 ${stat.iconColor} `} />
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

                <div className='w-full flex flex-col md:flex-row items-center justify-evenly'>
                    <ChartExample />
                    <ChartExample />
                </div>
            </div>


        </div>
    );
};

export default EventDashboard;