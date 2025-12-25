import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import config from "./config";
import { jwtDecode } from "jwt-decode";

const Userlogs = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [eventId, setEventId] = useState("");

  const [showQR, setShowQR] = useState(false);
  const [selectedEmpID, setSelectedEmpID] = useState("");

  /* ================= GET EVENT ID ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setEventId(decoded.EventId);
    }
  }, []);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/qrregistration`, {
        params: {
          term: search || undefined,
          eventId,
        },
      });
      setUsers(res.data.data.items || []);
    } catch (err) {
      console.error("Fetch users error", err);
    }
  };

  useEffect(() => {
    if (eventId) fetchUsers();
  }, [eventId, search]);

  return (
    <div>
      <Header />

      <div className="w-full p-4 mx-auto mt-4">

        {/* SEARCH (UI UNCHANGED) */}
        <div className="w-full flex justify-between items-center mb-3 mt-1">
          <div className="w-full max-w-sm min-w-[200px] relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white w-full pr-11 h-10 pl-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-slate-400"
              placeholder="Search user..."
            />
          </div>
        </div>

        {/* TABLE (UI UNCHANGED) */}
        <div className="relative flex flex-col w-full overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b bg-slate-50 text-sm text-slate-500">EmpID</th>
                <th className="p-4 border-b bg-slate-50 text-sm text-slate-500">Name</th>
                <th className="p-4 border-b bg-slate-50 text-sm text-slate-500">Email</th>
                <th className="p-4 border-b bg-slate-50 text-sm text-slate-500">Type</th>
                <th className="p-4 border-b bg-slate-50 text-sm text-slate-500">Checked In</th>
                <th className="p-4 border-b bg-slate-50 text-sm text-slate-500">QR</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}

              {users.map((u) => (
                <tr key={u.EmpID} className="hover:bg-slate-50 border-b">
                  <td className="p-4 text-sm">{u.EmpID}</td>
                  <td className="p-4 text-sm">{u.Name}</td>
                  <td className="p-4 text-sm">{u.Email}</td>
                  <td className="p-4 text-sm capitalize">{u.Type}</td>
                  <td className="p-4 text-sm">
                    {u.IsCheckedIn ? "Yes" : "No"}
                  </td>
                  <td className="p-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedEmpID(u.EmpID);
                        setShowQR(true);
                      }}
                      className="px-3 py-1 border rounded hover:bg-slate-100 transition"
                    >
                      Show QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= QR MODAL (TAILWIND) ================= */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 relative">

            <button
              onClick={() => setShowQR(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center">
              Employee QR
            </h2>

            <div className="flex flex-col items-center gap-3">
              <img
                src={`${config.apiUrl}/qr/EmpID/${selectedEmpID}`}
                alt="QR"
                className="w-48 h-48"
              />
              <p className="text-sm">
                <strong>Employee ID:</strong> {selectedEmpID}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowQR(false)}
                className="px-4 py-2 border rounded hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
              >
                Print
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Userlogs;
