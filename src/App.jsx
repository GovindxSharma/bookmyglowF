import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
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
import AmbientPlayer from "@/components/Common/AmbientPlayer";
import axios from "@/api/axiosInstance";
import { Sparkles, Shield, User, Crown, UserCheck, ChevronUp, ChevronDown } from "lucide-react";

// Floating Demo Switcher Component (Compact & Mobile-Optimized)
const PitchDemoToolbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const switchToClient = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const switchToRole = async (email, password, targetRoute) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, role, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      navigate(targetRoute);
      window.location.reload();
    } catch (err) {
      console.error("Demo Switch Error:", err);
    }
  };

  return (
    <div className="fixed bottom-16 md:bottom-5 right-3 md:right-5 z-50">
      <div className="bg-white/95 backdrop-blur-xl border border-[#E6DCCE] rounded-2xl shadow-2xl p-1.5 transition-all duration-300">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#182A4A] hover:bg-[#111E33] text-white text-xs font-bold transition shadow-xs"
          >
            <Sparkles size={13} className="text-[#C89B3C]" />
            <span>⚡ Demo Roles</span>
            <ChevronUp size={13} />
          </button>
        ) : (
          <div className="space-y-1.5 p-1 min-w-[210px]">
            <div className="flex items-center justify-between border-b border-[#FAF6EE] pb-1 px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A8F7F]">
                Quick Studio Roles
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[#9A8F7F] hover:text-[#182A4A]"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={switchToClient}
                className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#FAF6EE] text-[#182A4A] font-semibold transition"
              >
                <User size={13} className="text-[#C89B3C]" />
                <span>🌟 Client Experience</span>
              </button>

              <button
                onClick={() =>
                  switchToRole("reception@bookmyglow.com", "recep123", "/bookings")
                }
                className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#FAF6EE] text-[#182A4A] font-semibold transition"
              >
                <UserCheck size={13} className="text-[#6C8E82]" />
                <span>👩‍💼 Front Desk POS</span>
              </button>

              <button
                onClick={() =>
                  switchToRole("admin@bookmyglow.com", "admin123", "/dashboard")
                }
                className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#FAF6EE] text-[#182A4A] font-semibold transition"
              >
                <Crown size={13} className="text-[#C89B3C]" />
                <span>👑 Studio Owner (Admin)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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

      {/* Floating Studio Ambient Soundscape Sanctuary (Public Landing) */}
      {location.pathname === "/" && <AmbientPlayer />}

      {/* Floating Demo Role Toolbar */}
      <PitchDemoToolbar />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
