import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "@/api/axiosInstance";

// Pages
import Login from "./components/Auth/login.jsx";
import BookingsPage from "./pages/Bookings/BookingsPage";
import AttendancePage from "./pages/Attendance/AttendacePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CustomerPage from "./pages/Home/CustomerPage.jsx";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement.jsx";
import Settings from "@/pages/Settings/Settings";

// Components
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Navbar from "./components/Layout/Navbar.jsx";
import Credit from "./components/Layout/Credit.jsx";
import Loader from "./components/Layout/Loader.jsx";
import { BASE_URL } from "./data/data.js";

const App = () => {
  const [backendReady, setBackendReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Simple ping request — change path if needed
        await axios.get(`${BASE_URL}/`);
        setBackendReady(true);
      } catch (err) {
        console.error("Backend not ready:", err.message);
        setBackendReady(false);
      } finally {
        setChecking(false);
      }
    };

    checkBackend();
  }, []);

  if (checking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (!backendReady) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-center p-6">
        <p className="text-lg font-semibold text-gray-700">
          ⚠️ Our servers are warming up...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait a few moments and refresh the page.
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <div className="pt-[64px] md:pt-[64px]"></div>
      <Routes>
        {/* 🏠 Public Routes */}
        <Route path="/" element={<CustomerPage />} />
        <Route path="/login" element={<Login />} />

        {/* 🧭 Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 📅 Bookings */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Attendance */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        {/* 👩‍💼 Employees */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />

        {/* ⚙️ Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Credit />
    </Router>
  );
};

export default App;
