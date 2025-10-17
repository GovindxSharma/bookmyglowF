import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "@/components/Layout/DashboardLayout";

// Pages
import Login from "./components/login";
import BookingsPage from "./pages/Bookings/BookingsPage";
import AttendancePage from "./pages/Attendance/AttendacePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx"; // ✅ new dashboard page
import CustomerPage from "./pages/customerpage.jsx";

const App = () => {
  return (
    <Router>
      <Routes>

      <Route path="/" element={<CustomerPage />} />
        {/* 🏠 Login Route */}
        <Route path="/login" element={<Login />} />

        {/* 🧭 Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          }
        />

        {/* 📅 Bookings */}
        <Route
          path="/bookings"
          element={
            <DashboardLayout>
              <BookingsPage />
            </DashboardLayout>
          }
        />

        {/* ✅ Attendance */}
        <Route
          path="/attendance"
          element={
            <DashboardLayout>
              <AttendancePage />
            </DashboardLayout>
          }
        />

        {/* 🔧 Add more routes later (e.g. /services, /settings, etc.) */}
      </Routes>
    </Router>
  );
};

export default App;
