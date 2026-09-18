import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import MobileBottomNav from "@/components/Layout/MobileBottomNav";
import LandingPage from "@/pages/LandingPage";
import Login from "@/components/Auth/login";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AdminDashboard from "@/pages/AdminDashboard";
import BookingTabs from "@/components/Bookings/BookingTabs";
import AttendacePage from "@/pages/Attendance/AttendacePage";
import EmployeeManagement from "@/pages/EmployeeManagement/EmployeeManagement";
import SettingsPage from "@/pages/Settings/Settings";
import { AmbientAudioProvider } from "@/context/AmbientAudioContext";

import DesktopAmbientSpeaker from "@/components/Common/DesktopAmbientSpeaker";

// Main App Layout Wrapper with Scroll-Spy & Mobile Safe Padding
const AppContent = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#182A4A] pb-16 md:pb-0">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="pt-[70px]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
                <BookingTabs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
                <AttendacePage />
              </ProtectedRoute>
            }
          />
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
              <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          {/* Fallback 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* App-like Native Mobile Bottom Dock */}
      <MobileBottomNav activeSection={activeSection} />

      {/* Desktop-Only Minimal Floating Ambient Speaker Pill (Hidden on Mobile) */}
      <DesktopAmbientSpeaker />
    </div>
  );
};

function App() {
  return (
    <AmbientAudioProvider>
      <Router>
        <AppContent />
      </Router>
    </AmbientAudioProvider>
  );
}

export default App;
