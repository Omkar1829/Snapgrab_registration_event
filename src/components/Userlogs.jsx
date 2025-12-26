import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import config from "./config";
import { jwtDecode } from "jwt-decode";
import { Mail, Pencil, Phone } from "lucide-react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useFormik } from "formik";
import * as Yup from "yup";

const PAGE_SIZE = 20;

const Userlogs = () => {
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [eventId, setEventId] = useState("");
  const [Role, setRole] = useState("");

  // pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // QR / print
  const [showQR, setShowQR] = useState(false);
  const [selectedEmpID, setSelectedEmpID] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const token = localStorage.getItem("token");

  console.log(selectedUser)

  const formik = useFormik({
    initialValues: {
      ID: selectedUser?.ID,
      firstName: selectedUser?.Name,
      email: selectedUser?.Email,
      employeeId: selectedUser?.EmpID,
      eventId: selectedUser?.EventID,
      type: selectedUser?.Type,
    },
    // validationSchema,

    onSubmit: async (values, { resetForm }) => {
      console.log("onSubmit triggered", values);
      try {
        setDisableBtn(true);
        setErrorMsg("");

        await axios.post(
          `${config.apiUrl}/qrregistration/updatetype`,
          {
            ID: values.ID,
            name: values.firstName,
            email: values.email,
            empid: values.employeeId,
            EventID: values.eventId,
            Type: values.type,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Refresh the users list
        fetchUsers();

        // ✅ Show Lottie success popup
        setShowSuccessPopup(true);

        // Auto close popup
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 2500);

        // Close the dialog
        setOpen(false);

        resetForm({
          values: {
            firstName: "",
            email: "",
            employeeId: "",
            eventId: eventId,
            type: "standard",
          },
        });
      } catch (error) {
        console.error(error);
        setErrorMsg("Update failed. Please try again.");
      } finally {
        setDisableBtn(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  // Pre-fill form when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      formik.resetForm({
        values: {
          firstName: selectedUser.Name || "",
          ID: selectedUser.ID,
          email: selectedUser.Email || "",
          employeeId: selectedUser.EmpID || "",
          eventId: selectedUser.EventID || "",
          type: selectedUser.Type || "standard",
        },
      });
    }
  }, [selectedUser]);


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
      setRole(decoded.Role)
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
                <th className="p-4 text-center">EmpID</th>
                <th className="p-4 text-center">Name</th>
                <th className="p-4 text-center">Email</th>
                <th className="p-4 text-center">Type</th>
                <th className="p-4 text-center">Checked In</th>
                {
                  Role === 'admin' ?
                    (
                      <>
                        <th className="p-4 text-center">Email</th>
                        <th className="p-4 text-center">Whatsapp</th>
                        <th className="p-4 text-center">Edit</th>
                        <th className="p-4 text-center">QR</th>
                      </>
                    ) : (
                      <th className="p-4 text-center">QR</th>
                    )
                }
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
                  <td className="p-4 font-medium text-center">{u.EmpID}</td>
                  <td className="p-4 text-center">{u.Name}</td>
                  <td className="p-4 text-center">{u.Email}</td>
                  <td className="p-4 capitalize text-center">{u.Type}</td>
                  <td className="p-4 text-center">
                    <button
                      className={`px-2 py-1 rounded-full text-xs font-medium text-center w-full ${u.IsCheckedIn
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {u.IsCheckedIn ? "Yes" : "No"}
                    </button>
                  </td>
                  {Role === 'admin' ? (
                    <>
                      <td className="p-4 text-center">
                        <button className="px-3 py-1.5 border bg-red-100 text-red-700 font-medium rounded-lg hover:bg-slate-100">
                          {/* <Mail size={16} /> */}
                          Email
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button className="px-3 py-1.5 border rounded-lg bg-green-100 text-green-700 font-medium hover:bg-slate-100">
                          {/* <Phone size={16} /> */}
                          Whatsapp
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => {
                          setSelectedUser(u)
                          setOpen(true)
                        }} className="px-3 py-1.5 border rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-slate-100">
                          {/* <Pencil size={16} /> */}
                          Edit
                        </button>
                        <div>
                          <Dialog open={open} onClose={setOpen} className="relative z-10">
                            <DialogBackdrop
                              transition
                              className="fixed inset-0 bg-gray-900/10  backdrop-blur-[2px] transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                            />

                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <DialogPanel
                                  transition
                                  className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">

                                      <div className="bg-white rounded-xl p-6 md:p-8">
                                        <form onSubmit={handleSubmit} className="space-y-6">

                                          {/* ================= GRID ================= */}
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* NAME */}
                                            <div>
                                              <label className="text-sm font-medium text-slate-700">
                                                ID
                                              </label>
                                              <input
                                                name="ID"
                                                value={values.ID}
                                                readOnly
                                                onChange={handleChange}
                                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 bg-slate-100 focus:ring-slate-400"
                                              />
                                              {touched.ID && errors.ID && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {errors.ID}
                                                </p>
                                              )}
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-slate-700">
                                                Full Name
                                              </label>
                                              <input
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400"
                                              />
                                              {touched.firstName && errors.firstName && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {errors.firstName}
                                                </p>
                                              )}
                                            </div>

                                            {/* EMAIL */}
                                            <div>
                                              <label className="text-sm font-medium text-slate-700">
                                                Email
                                              </label>
                                              <input
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400"
                                              />
                                              {touched.email && errors.email && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {errors.email}
                                                </p>
                                              )}
                                            </div>

                                            {/* EMPLOYEE ID */}
                                            <div>
                                              <label className="text-sm font-medium text-slate-700">
                                                Employee ID
                                              </label>
                                              <input
                                                name="employeeId"
                                                value={values.employeeId}
                                                onChange={handleChange}
                                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400"
                                              />
                                            </div>

                                            {/* EVENT ID */}
                                            <div>
                                              <label className="text-sm font-medium text-slate-700">
                                                Event ID
                                              </label>
                                              <input
                                                name="eventId"
                                                value={values.eventId}
                                                readOnly
                                                className="mt-1 w-full px-3 py-2 border rounded-lg bg-slate-100 text-slate-600"
                                              />
                                            </div>
                                          </div>

                                          {/* TYPE */}
                                          <div>
                                            <label className="text-sm font-medium text-slate-700">
                                              Registration Type
                                            </label>
                                            <select
                                              name="type"
                                              value={values.type}
                                              onChange={handleChange}
                                              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400"
                                            >
                                              <option value="standard">Standard</option>
                                              <option value="vip">VIP</option>
                                            </select>
                                          </div>
                                          <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                              type="submit"
                                              disabled={disableBtn}
                                              className="inline-flex w-full cursor-pointer justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 sm:ml-3 sm:w-auto"
                                            >
                                              {disableBtn ? "Updating..." : "Update"}
                                            </button>
                                            <button
                                              type="button"
                                              data-autofocus
                                              onClick={() => setOpen(false)}
                                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white border text-gray-700 border-gray-700 px-3 py-2 text-sm font-semibold inset-ring inset-ring-white/5 hover:bg-gray-400 hover:text-white cursor-pointer sm:mt-0 sm:w-auto"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>

                                </DialogPanel>
                              </div>
                            </div>
                          </Dialog>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedEmpID(u.EmpID);
                            setShowQR(true);
                          }}
                          className="px-3 py-1.5 border rounded-lg bg-yellow-100 text-yellow-700 font-medium hover:bg-slate-100"
                        >
                          Show QR
                        </button>
                      </td>
                    </>
                  ) : (
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedEmpID(u.EmpID);
                          setShowQR(true);
                        }}
                        className="px-3 py-1.5 border rounded-lg bg-yellow-100 text-yellow-700 font-medium hover:bg-slate-100"
                      >
                        Show QR
                      </button>
                    </td>
                  )}

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
