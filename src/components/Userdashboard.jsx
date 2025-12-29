import React, { useEffect, useState } from 'react'
import {
  Users,
  UserCheck,
  Store,
  Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AgCharts } from 'ag-charts-react'
import {
  LegendModule,
  ModuleRegistry,
  PieSeriesModule,
} from 'ag-charts-community'
import Header from './Header'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import config from '../Components/config'

ModuleRegistry.registerModules([LegendModule, PieSeriesModule])

const EventDashboard = () => {

  const navigate = useNavigate()

  const token = jwtDecode(localStorage.getItem('token'))
  const userId = token.UserId
  const eventId = token.EventId

  const [statsData, setStatsData] = useState(null)

  /* =============================
     FETCH DASHBOARD DATA
     ============================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}/admin/data?EventID=${eventId}&UserID=${userId}`
        )
        setStatsData(res.data.data)
      } catch (error) {
        console.error('Dashboard API error:', error)
      }
    }

    fetchDashboardData()
  }, [eventId, userId])

  /* =============================
     STATS CARDS DATA
     ============================= */
  const stats = [
    {
      label: 'Total Registrations',
      value: statsData?.totalRegistration ?? 0,
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Check-ins',
      value: statsData?.totalCheckin ?? 0,
      icon: UserCheck,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Pending Check-ins',
      value:
        (statsData?.totalRegistration ?? 0) -
        (statsData?.totalCheckin ?? 0),
      icon: Clock,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Cities',
      value: statsData?.cityWise?.length ?? 0,
      icon: Store,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  /* =============================
     CITY PIE DATA
     ============================= */
  const cityPieData =
    statsData?.cityWise?.map((item) => ({
      city: item.City,
      count: Number(item.count),
    })) ?? []

  /* =============================
     OVERALL STATUS PIE DATA
     ============================= */
  const statusPieData = [
    {
      type: 'Registered',
      value: statsData?.totalRegistration ?? 0,
    },
    {
      type: 'Checked-in',
      value: statsData?.totalCheckin ?? 0,
    },
    {
      type: 'Pending',
      value:
        (statsData?.totalRegistration ?? 0) -
        (statsData?.totalCheckin ?? 0),
    },
  ]

  /* =============================
     CITY PIE CHART
     ============================= */
  const CityPieChart = () => {
    const options = {
      data: cityPieData,
      title: {
        text: 'City-wise Registrations',
      },
      background: {
        visible: false,
        fill: 'transparent',
      },
      series: [
        {
          type: 'pie',
          angleKey: 'count',
          legendItemKey: 'city',
        },
      ],
    }

    return <AgCharts options={options} />
  }

  /* =============================
     STATUS PIE CHART
     ============================= */
  const StatusPieChart = () => {
    const options = {
      data: statusPieData,
      title: {
        text: 'Registration Status',
      },
      background: {
        visible: false,
        fill: 'transparent',
      },
      series: [
        {
          type: 'pie',
          angleKey: 'value',
          legendItemKey: 'type',
        },
      ],
    }

    return <AgCharts options={options} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* =============================
            STATS CARDS
            ============================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-slate-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* =============================
            PIE CHARTS SECTION
            ============================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="  p-6">
            <CityPieChart />
          </div>

          <div className=" p-6">
            <StatusPieChart />
          </div>
        </div>

      </div>
    </div>
  )
}

export default EventDashboard
