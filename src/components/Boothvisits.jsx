import React, { useEffect, useState } from "react";
import { Calendar, Users, Ticket, } from "lucide-react";
import {jwtDecode} from "jwt-decode";
import { CSVLink } from "react-csv";
import Header from "./Header";
import config from "./config";

const iconMap = {
  VIP: Ticket,
  STANDARD: Users,
  DEFAULT: Calendar,
};

const Boothvisits = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [visitorData, setVisitorData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [error, setError] = useState(null);

  const eventId = jwtDecode(localStorage.getItem("token"))?.EventId;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          `${config.apiUrl}/activity/stats?EventID=${eventId}`
        );
        const result = await res.json();

        if (result.Status === 200 && result.data?.activities) {
          setActivities(result.data.activities);
        } else {
          throw new Error(result.message || "Failed to fetch activities");
        }
      } catch (err) {
        setError(err.message);
        setActivities([]);
      }
    };

    fetchActivities();
  }, [eventId]);

  const handleCardClick = async (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
    setLoadingVisitors(true);
    setVisitorData([]);

    try {
      const res = await fetch(
        `${config.apiUrl}/activity/users?eventID=${eventId}&activityid=${activity.activityId}`
      );
      const result = await res.json();

      if (result.Status === 200 && result.data) {
        setVisitorData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch visitors");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingVisitors(false);
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {activities.map((activity) => {
            const Icon =
              iconMap[activity.activityType] || iconMap.DEFAULT;

            return (
              <div
                key={activity.activityId}
                onClick={() => handleCardClick(activity)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

                <div className="relative p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {activity.activityName}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {activity.visitorsCount} Visitors
                  </p>
                </div>

                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-10 transform group-hover:scale-150 transition-transform duration-500" />
              </div>
            );
          })}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                Visitors – {selectedActivity?.activityName}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {loadingVisitors ? (
                <p className="text-center text-gray-500">
                  Loading visitor data...
                </p>
              ) : visitorData.length > 0 ? (
                <>
                  <CSVLink
                    data={visitorData}
                    filename={`activity-${selectedActivity.activityId}-visitors.csv`}
                    className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Download CSV
                  </CSVLink>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                          <th className="p-3 border">Name</th>
                          <th className="p-3 border">Email</th>
                          <th className="p-3 border">Type</th>
                          <th className="p-3 border">Total Check-ins</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {visitorData.map((v, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="p-3 border">{v.name}</td>
                            <td className="p-3 border">{v.email}</td>
                            <td className="p-3 border">{v.type}</td>
                            <td className="p-3 border">{v.checkinTimes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">
                  No visitor data available.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Boothvisits;
