import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "@/components/Layout/DashboardLayout";

// Pages
import Login from "./components/login";
import BookingsPage from "./pages/Bookings/BookingsPage";
import AttendancePage from "./pages/Attendance/AttendacePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CustomerPage from "./pages/customerpage.jsx";

// Auth
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🏠 Public Routes */}
        <Route path="/" element={<CustomerPage />} />
        <Route path="/login" element={<Login />} />

        {/* 🧭 Admin Dashboard — only for admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 📅 Bookings — for both admin & receptionist */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <DashboardLayout>
                <BookingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ✅ Attendance — for both admin & receptionist */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <DashboardLayout>
                <AttendancePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
