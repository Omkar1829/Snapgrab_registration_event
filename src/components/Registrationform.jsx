import React, { useState } from "react";
import Header from "./Header";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import config from "./config";
import { jwtDecode } from "jwt-decode";

/* ================= VALIDATION SCHEMA ================= */
const validationSchema = Yup.object({
    firstName: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    employeeId: Yup.string(),
    eventId: Yup.string().required("Event ID is required"),
    type: Yup.string().required("Type is required"),
});

const Registrationform = () => {
    const [disableBtn, setDisableBtn] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

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

                

                setSuccessMsg("Registration Successful!");
                if (successMsg){
                    alert('Registration Successful!')
                }
                resetForm();
            } catch (error) {
                alert("Registration Failed");
                console.error(error);
            } finally {
                setDisableBtn(false);
            }
        },
    });

    const { values, errors, touched, handleChange, handleSubmit } = formik;

    return (
        <>
            <Header />

            <div className=" gap-4">
                <h1 className="text-4xl text-center my-8">Registration Form</h1>
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* NAME */}
                        <div className="md:grid grid-cols-2 gap-4 ">
                            <div >
                                <label className="block text-sm text-gray-700 font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                                {errors.firstName && touched.firstName && (
                                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                                {errors.email && touched.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>

                            {/* EMPLOYEE ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={values.employeeId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                            </div>

                            {/* EVENT ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event ID</label>
                                <input
                                    type="text"
                                    name="eventId"
                                    value={values.eventId}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        {/* TYPE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Registration Type
                            </label>
                            <select
                                name="type"
                                value={values.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            >
                                <option value="standard">Standard</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>


                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={disableBtn}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold cursor-pointer"
                        >
                            {disableBtn ? "Submitting..." : "Register"}
                        </button>

                        {successMsg && (
                            <p className="text-green-600 text-center font-semibold">
                                {successMsg}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Registrationform;
