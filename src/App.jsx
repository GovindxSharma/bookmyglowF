import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./components/Auth/login.jsx";
import BookingsPage from "./pages/Bookings/BookingsPage";
import AttendancePage from "./pages/Attendance/AttendacePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CustomerPage from "./pages/Home/CustomerPage.jsx";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement.jsx";
import Settings from "@/pages/Settings/Settings";

// Auth
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Navbar from "./components/Layout/Navbar.jsx";
import Credit from "./components/Layout/Credit.jsx";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-[64px] md:pt-[64px]"></div>
      <Routes>
        {/* 🏠 Public Routes */}
        <Route path="/" element={<CustomerPage />} />
        <Route path="/login" element={<Login />} />

        {/* 🧭 Admin Dashboard — only for admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 📅 Bookings — for both admin & receptionist */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Attendance — for both admin & receptionist */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        {/* 🧑‍💼 Employee Management — assume protected for admin */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />

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
