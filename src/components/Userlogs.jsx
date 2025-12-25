import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import config from "./config";
import { jwtDecode } from "jwt-decode";

const PAGE_SIZE = 20;

const Userlogs = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [eventId, setEventId] = useState("");

  // pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // QR / print
  const [showQR, setShowQR] = useState(false);
  const [selectedEmpID, setSelectedEmpID] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  /* ================= PRINT ================= */
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

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
          pageIndex,
          pageSize: PAGE_SIZE,
        },
      });

      const data = res.data.data;
      setUsers(data.items || []);
      setPageCount(data.pageCount || 0);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error("Fetch users error", err);
    }
  };

  /* Reset page on search */
  useEffect(() => {
    setPageIndex(0);
  }, [search]);

  useEffect(() => {
    if (eventId) fetchUsers();
  }, [eventId, search, pageIndex]);

  const start = pageIndex * PAGE_SIZE + 1;
  const end = Math.min((pageIndex + 1) * PAGE_SIZE, totalCount);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="max-w-7xl mx-auto p-4">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-semibold text-slate-800">
            User Logs
          </h1>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, EmpID..."
            className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white focus:ring-slate-400"
          />
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 text-left">EmpID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Checked In</th>
                <th className="p-4 text-center">QR</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}

              {users.map((u) => (
                <tr
                  key={u.EmpID}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-4 font-medium">{u.EmpID}</td>
                  <td className="p-4">{u.Name}</td>
                  <td className="p-4">{u.Email}</td>
                  <td className="p-4 capitalize">{u.Type}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${u.IsCheckedIn
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {u.IsCheckedIn ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedEmpID(u.EmpID);
                        setShowQR(true);
                      }}
                      className="px-3 py-1.5 border rounded-lg hover:bg-slate-100"
                    >
                      Show QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= PAGINATION ================= */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 border-t bg-slate-50">
            <span className="text-sm text-slate-600">
              Showing <strong>{start}</strong> – <strong>{end}</strong> of{" "}
              <strong>{totalCount}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((p) => p - 1)}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              <span className="px-3 py-1.5 border rounded-lg bg-white text-sm">
                Page {pageIndex + 1} of {pageCount}
              </span>

              <button
                disabled={pageIndex + 1 >= pageCount}
                onClick={() => setPageIndex((p) => p + 1)}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= QR MODAL ================= */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-[90%] max-w-md p-6 relative">

            {!isPrinting && (
              <>

                <button
                  onClick={() => setShowQR(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                  ✕
                </button>

                <h2 className="text-lg font-semibold text-center mb-4">
                  Employee QR
                </h2>
              </>
            )}
            <div className="print-area">
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
            </div>

            {!isPrinting && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setShowQR(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  Print
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Userlogs;
