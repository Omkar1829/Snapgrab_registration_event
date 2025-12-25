import React, { useState } from "react";
import Header from "./Header";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import config from "./config";
import { jwtDecode } from "jwt-decode";
import Lottie from "lottie-react";
import successAnimation from "../assets/lottie/success.json";

/* ================= VALIDATION SCHEMA ================= */
const validationSchema = Yup.object({
  firstName: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  employeeId: Yup.string(),
  eventId: Yup.string().required("Event ID is required"),
  type: Yup.string().required("Type is required"),
});

const Registrationform = () => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ================= GET EVENT ID FROM TOKEN ================= */
  const token = localStorage.getItem("token");
  const eventId = token ? jwtDecode(token)?.EventId : "";

  /* ================= FORMIK ================= */
  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      employeeId: "",
      eventId: eventId,
      type: "standard",
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        setDisableBtn(true);
        setErrorMsg("");

        await axios.post(
          `${config.apiUrl}/qrregistration/register`,
          {
            name: values.firstName,
            email: values.email,
            empid: values.employeeId,
            EventID: values.eventId,
            type: values.type,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // ✅ Show Lottie success popup
        setShowSuccessPopup(true);

        // Auto close popup
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 2500);

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
        setErrorMsg("Registration failed. Please try again.");
      } finally {
        setDisableBtn(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          New Registration
        </h1>

        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ================= GRID ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NAME */}
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

            {/* ERROR MESSAGE */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={disableBtn}
              className="w-full py-3 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 disabled:opacity-60"
            >
              {disableBtn ? "Submitting..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      {/* ================= SUCCESS LOTTIE POPUP ================= */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-xl">

            <Lottie
              animationData={successAnimation}
              loop={false}
              className="h-40 mx-auto"
            />

            <h3 className="text-lg font-semibold text-slate-800 mt-2">
              Registration Successful
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              User has been registered successfully
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registrationform;
