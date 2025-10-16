import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "@/components/Layout/DashboardLayout";

// Pages
import Login from "./components/login";
import BookingsPage from "./pages/Bookings/BookingsPage";
import AttendancePage from "./pages/Attendance/AttendacePage.jsx"; // ✅ new page added

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🏠 Login Route */}
        <Route path="/" element={<Login />} />

        {/* 📅 Bookings (wrapped in Dashboard layout) */}
        <Route
          path="/bookings"
          element={
            <DashboardLayout>
              <BookingsPage />
            </DashboardLayout>
          }
        />

        {/* ✅ Attendance Section */}
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
