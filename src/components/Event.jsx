import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import jsQR from "jsqr";
import axios from "axios";
import config from "./config";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import { useReactToPrint } from "react-to-print";

import {
    QrCodeIcon,
    CameraIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

import SuccessAnimation from "../assets/lottie/success.json";
import FailedAnimation from "../assets/lottie/error.json";

/* ================= CARD STYLES ================= */
const boothCardStyles = [
    {
        color: "from-indigo-500 to-purple-600",
        icon: QrCodeIcon,
    },
    {
        color: "from-emerald-500 to-teal-600",
        icon: CameraIcon,
    },
    {
        color: "from-orange-500 to-red-600",
        icon: CheckCircleIcon,
    },
];

const Event = () => {
    /* ================= REFS ================= */
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const printRef = useRef(null);

    /* ================= ROUTER ================= */
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const selectedBooth = query.get("activityId");

    /* ================= STATE ================= */
    const [eventId, setEventId] = useState("");
    const [activities, setActivities] = useState([]);

    const [facingMode, setFacingMode] = useState("environment");
    const [cameraActive, setCameraActive] = useState(true);
    const trackRef = useRef(null);
    const [hasFlash, setHasFlash] = useState(false);
    const [flashOn, setFlashOn] = useState(false);

    const [scanData, setScanData] = useState(null);
    const [showScanModal, setShowScanModal] = useState(false);

    const [showAnimation, setShowAnimation] = useState(false);
    const [animationType, setAnimationType] = useState("success");

    /* ================= INIT ================= */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setEventId(jwtDecode(token).EventId);
        }
    }, []);

    useEffect(() => {
        if (!eventId) return;
        axios
            .get(`${config.apiUrl}/activity?EventId=${eventId}`)
            .then((res) => setActivities(res.data.data || []))
            .catch(console.error);
    }, [eventId]);

    /* ================= CAMERA + QR SCAN ================= */
    useEffect(() => {
        if (!selectedBooth || !eventId || !cameraActive) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        let stream;
        let lastScanTime = 0;
        let phoneStore = [];

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode } })
            .then((s) => {
                stream = s;
                video.srcObject = s;

                // store track for flash/torch control
                trackRef.current = stream.getVideoTracks()[0];
                try {
                    const caps = trackRef.current.getCapabilities ? trackRef.current.getCapabilities() : {};
                    setHasFlash(!!caps.torch);
                } catch (e) {
                    console.error(e);
                    setHasFlash(false);
                }

                video.onloadedmetadata = () => {
                    video.play();

                    const scanDelay = 1000;

                    const scanQRCode = () => {
                        if (!cameraActive) return;

                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;

                        if (!canvas.width || !canvas.height) {
                            requestAnimationFrame(scanQRCode);
                            return;
                        }

                        context.drawImage(video, 0, 0, canvas.width, canvas.height);

                        const imageData = context.getImageData(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );

                        const now = Date.now();
                        if (now - lastScanTime > scanDelay) {
                            const code = jsQR(
                                imageData.data,
                                imageData.width,
                                imageData.height
                            );

                            if (code?.data && !phoneStore.includes(code.data)) {
                                phoneStore.push(code.data);
                                lastScanTime = now;
                                handleScan(code.data);

                                setTimeout(() => {
                                    phoneStore = [];
                                }, 1000);
                            }
                        }

                        requestAnimationFrame(scanQRCode);
                    };

                    scanQRCode();
                };
            })
            .catch(console.error);

        return () => {
            // ensure torch is off when stopping
            if (trackRef.current && flashOn) {
                trackRef.current.applyConstraints?.({ advanced: [{ torch: false }] }).catch(() => {});
            }
            if (stream) stream.getTracks().forEach((t) => t.stop());
            trackRef.current = null;
            setFlashOn(false);
            setHasFlash(false);
        };
    }, [selectedBooth, facingMode, cameraActive, eventId, showScanModal]);

    /* ================= HANDLE SCAN ================= */
    const handleScan = async (empId) => {
        setCameraActive(false);
        setShowAnimation(true);

        try {
            const res = await axios.get(
                `${config.apiUrl}/activity/qr-data`,
                {
                    params: {
                        eventID: eventId,
                        empId,
                        activityid: selectedBooth,
                    },
                }
            );

            setScanData(res.data.data);
            setAnimationType("success");
        } catch (err) {
            setScanData({
                error: err?.response?.data?.message || "Scan failed",
            });
            setAnimationType("fail");
        }

        setTimeout(() => {
            setShowAnimation(false);
            setShowScanModal(true);
        }, 1500);
    };

    /* ================= CHECK-IN ================= */
    const handleCheckIn = async () => {
        await axios.post(`${config.apiUrl}/activity/qr`, {}, {
            params: {
                eventID: eventId,
                empId: scanData.empID,
                activityid: selectedBooth,
            },
        });

        setShowScanModal(false);
        setCameraActive(true);
    };

    /* ================= PRINT ================= */
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        pageStyle: "@page { size: 9in 13in; margin: 0 }",
    });

    // Flash / torch toggle
    const toggleFlash = async () => {
        const track = trackRef.current;
        if (!track) return;
        try {
            const capabilities = track.getCapabilities ? track.getCapabilities() : {};
            if (capabilities.torch) {
                await track.applyConstraints({ advanced: [{ torch: !flashOn }] });
                setFlashOn((f) => !f);
                return;
            }
            if (window.ImageCapture) {
                const imageCapture = new ImageCapture(track);
                const photoCapabilities = await imageCapture.getPhotoCapabilities();
                if (photoCapabilities.fillLightMode && photoCapabilities.fillLightMode.includes("torch")) {
                    await track.applyConstraints({ advanced: [{ torch: !flashOn }] });
                    setFlashOn((f) => !f);
                    return;
                }
            }
            console.warn("Torch/flash not supported on this device/browser.");
        } catch (err) {
            console.error("Flash toggle failed", err);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-slate-100">
            <Header />

            {/* ================= BOOTH SELECTION ================= */}
            {!selectedBooth && (
                <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {activities.map((activity, index) => {
                        const style =
                            boothCardStyles[index % boothCardStyles.length];
                        const Icon = style.icon;

                        return (
                            <div
                                key={activity.ID}
                                onClick={() =>
                                    navigate(`/cam?activityId=${activity.ID}`)
                                }
                                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                                />

                                <div className="relative p-6">
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-br ${style.color} rounded-2xl flex items-center justify-center shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                                    >
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {activity.Name}
                                    </h3>
                                </div>

                                <div
                                    className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${style.color} rounded-full opacity-10 transform group-hover:scale-150 transition-transform duration-500`}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ================= CAMERA ================= */}
            {selectedBooth && (
                <div className="flex flex-col items-center mt-6">
                    <div className="relative w-[90%] md:max-w-sm max-w-lg aspect-square rounded-xl overflow-hidden shadow-2xl shodow-slate-400">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            style={{
                                transform:
                                    facingMode === "user" ? "scaleX(-1)" : "none",
                            }}
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="absolute inset-8 border-4 border-red-700 border-dotted rounded-xl" />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() =>
                                setFacingMode((f) =>
                                    f === "environment" ? "user" : "environment"
                                )
                            }
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                        >
                            Switch Camera
                        </button>

                        {hasFlash && (
                            <button
                                onClick={toggleFlash}
                                className={`px-4 py-2 rounded-lg ${flashOn ? 'bg-yellow-400 text-black' : 'bg-slate-200 text-black'}`}
                            >
                                {flashOn ? 'Flash On' : 'Flash Off'}
                            </button>
                        )}

                        <button
                            onClick={() => {
                                if (trackRef.current) {
                                    trackRef.current.applyConstraints?.({ advanced: [{ torch: false }] }).catch(() => {});
                                }
                                setFlashOn(false);
                                setHasFlash(false);
                                navigate("/cam");
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            )}

            {/* ================= LOTTIE ================= */}
            {showAnimation && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <Lottie
                        animationData={
                            animationType === "success"
                                ? SuccessAnimation
                                : FailedAnimation
                        }
                        className="w-40"
                    />
                </div>
            )}

            {/* ================= RESULT MODAL ================= */}
            {showScanModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
                        <span className="bg-gray-700 rounded-full shadow-2xl shadow-gray-500 cursor-pointer py-4 px-5 text-white"
                        onClick={() => {
                            setShowScanModal(false);
                            setCameraActive(true);
                            setScanData(null);
                            setFlashOn(false);
                            setHasFlash(false);
                            if (trackRef.current) {
                                trackRef.current.applyConstraints?.({ advanced: [{ torch: false }] }).catch(() => {});
                            }
                        }}>X</span>

                        {/* ERROR CASE */}
                        {scanData?.error ? (
                            <>
                                <h2 className="text-lg font-semibold text-red-600 mb-2">
                                    Scan Failed
                                </h2>
                                <p className="text-sm text-slate-600">
                                    {scanData.error}
                                </p>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => {
                                            setShowScanModal(false);
                                            setCameraActive(true);
                                            setFlashOn(false);
                                            setHasFlash(false);
                                            if (trackRef.current) {
                                                trackRef.current.applyConstraints?.({ advanced: [{ torch: false }] }).catch(() => {});
                                            }
                                        }}
                                        className="px-4 py-2 bg-slate-800 text-white rounded-lg"
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* HEADER */}
                                <h2 className="text-xl font-semibold text-slate-800 text-center">
                                    Scan Successful
                                </h2>

                                {/* USER INFO */}
                                <div className="mt-4 space-y-2 text-sm text-slate-700">
                                    <p>
                                        <strong>Name:</strong> {scanData.name}
                                    </p>
                                    <p>
                                        <strong>Emp ID:</strong> {scanData.empID}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {scanData.email || "—"}
                                    </p>
                                    <p>
                                        <strong>Type:</strong> {scanData.type || "—"}
                                    </p>
                                    <p>
                                        <strong>Checked In:</strong>{" "}
                                        <span
                                            className={`font-semibold ${scanData.isCheckedIn
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {scanData.isCheckedIn ? "Yes" : "No"}
                                        </span>
                                    </p>
                                </div>

                                {/* QR PREVIEW */}
                                <div ref={printRef} className="mt-4 flex justify-center">
                                    <img
                                        src={`${config.apiUrl}/qr/EmpID/${scanData.empID}`}
                                        alt="QR"
                                        className="w-40 h-40"
                                    />
                                </div>

                                {/* ACTIONS */}
                                <div className="flex justify-center gap-3 mt-6">
                                    <button
                                        onClick={async () => {
                                            await handleCheckIn();
                                            if (trackRef.current) {
                                                trackRef.current.applyConstraints?.({ advanced: [{ torch: false }] }).catch(() => {});
                                            }
                                            setFlashOn(false);
                                            setHasFlash(false);
                                            setShowScanModal(false);
                                            setCameraActive(true);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                    >
                                        Check In
                                    </button>

                                    <button
                                        onClick={async () => {
                                            await handleCheckIn();
                                            handlePrint();
                                            if (trackRef.current) {
                                                trackRef.current.applyConstraints?.({ advanced: [{ torch: false }] }).catch(() => {});
                                            }
                                            setFlashOn(false);
                                            setHasFlash(false);
                                            setTimeout(() => {
                                                setShowScanModal(false);
                                                setCameraActive(true);
                                            }, 600);
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                                    >
                                        Check In & Print
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Event;
