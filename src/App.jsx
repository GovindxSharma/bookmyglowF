import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "@/components/Layout/DashboardLayout";

// Pages
import Login from "./components/Auth/login.jsx";
import BookingsPage from "./pages/Bookings/BookingsPage";
import AttendancePage from "./pages/Attendance/AttendacePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CustomerPage from "./pages/Home/CustomerPage.jsx";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement.jsx";

// Auth
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Navbar from "./components/Layout/Navbar.jsx";
import Footer from "./components/Layout/Footer.jsx";

const App = () => {
  return (
    <Router>
    <Navbar/>
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
        <Route
          path="/employees"
          element={
            <DashboardLayout>
              <EmployeeManagement />
            </DashboardLayout>
          }
        />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
