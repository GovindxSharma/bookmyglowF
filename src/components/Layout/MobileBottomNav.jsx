import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Scissors,
  Calendar,
  Sparkles,
  LayoutDashboard,
  CalendarDays,
  Clock,
  Users,
  Lock,
  Calculator,
  Crown,
  Star,
  Layers,
} from "lucide-react";
import axios from "@/api/axiosInstance";

const MobileBottomNav = ({ activeSection }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === "/";

  const [role, setRole] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token && storedRole) {
      setRole(storedRole);
    } else {
      setRole(null);
    }
  }, [location]);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!role) return;
      try {
        const res = await axios.get("/appointments/?for_notification=true");
        setUnreadCount(res.data.count || res.data.appointments?.length || 0);
      } catch {
        // silent
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000);
    return () => clearInterval(interval);
  }, [role, location]);

  const handleNavClick = (target) => {
    if (target.startsWith("#")) {
      const elId = target.replace("#", "");
      if (isLanding) {
        const el = document.getElementById(elId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(elId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      return;
    }
    navigate(target);
  };

  // 1. Logged in as Studio Owner (Admin)
  if (role === "admin") {
    const adminTabs = [
      { id: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
      {
        id: "/bookings",
        label: "POS & Bills",
        icon: <CalendarDays size={17} />,
        badge: unreadCount > 0 ? unreadCount : null,
      },
      { id: "/attendance", label: "Roster", icon: <Clock size={17} /> },
      { id: "/employees", label: "Specialists", icon: <Users size={17} /> },
      { id: "/", label: "Studio", icon: <Home size={17} /> },
    ];

    return (
      <div className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto">
        <div className="bg-[#182A4A]/95 backdrop-blur-2xl border-2 border-[#C89B3C]/40 rounded-[28px] p-1.5 shadow-2xl flex items-center justify-around">
          {adminTabs.map((tab) => {
            const isActive = location.pathname === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleNavClick(tab.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-2.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "text-[#182A4A] font-extrabold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeAdminDock"
                    className="absolute inset-0 bg-[#FAF2DE] rounded-2xl -z-10 shadow-xs border border-[#C89B3C]/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative">
                  {tab.icon}
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[8px] font-extrabold bg-[#C89B3C] text-white rounded-full animate-bounce">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] mt-0.5 uppercase tracking-wider">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Logged in as Receptionist
  if (role === "receptionist") {
    const recepTabs = [
      {
        id: "/bookings",
        label: "POS & Bills",
        icon: <CalendarDays size={17} />,
        badge: unreadCount > 0 ? unreadCount : null,
      },
      { id: "/attendance", label: "Attendance", icon: <Clock size={17} /> },
      { id: "/employees", label: "Staff", icon: <Users size={17} /> },
      { id: "/", label: "Studio", icon: <Home size={17} /> },
    ];

    return (
      <div className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto">
        <div className="bg-[#182A4A]/95 backdrop-blur-2xl border-2 border-[#C89B3C]/40 rounded-[28px] p-1.5 shadow-2xl flex items-center justify-around">
          {recepTabs.map((tab) => {
            const isActive = location.pathname === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleNavClick(tab.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 ${
                  isActive ? "text-[#182A4A] font-extrabold" : "text-white/70 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeRecepDock"
                    className="absolute inset-0 bg-[#FAF2DE] rounded-2xl -z-10 shadow-xs border border-[#C89B3C]/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative">
                  {tab.icon}
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[8px] font-extrabold bg-[#C89B3C] text-white rounded-full animate-bounce">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] mt-0.5 uppercase tracking-wider">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Public Client Floating Bauhaus Capsule Island Dock
  const publicTabs = [
    { id: "home", label: "Home", icon: <Home size={17} />, target: "#home" },
    { id: "services", label: "Menu", icon: <Scissors size={17} />, target: "#services" },
    { id: "book", label: "BOOK", icon: <Sparkles size={18} />, target: "#book", isElevated: true },
    { id: "packages", label: "Combos", icon: <Calculator size={17} />, target: "#packages" },
    { id: "login", label: "Portal", icon: <Lock size={17} />, target: "/login" },
  ];

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-sm mx-auto">
      <div className="bg-[#182A4A]/95 backdrop-blur-2xl border-2 border-[#C89B3C]/40 rounded-[28px] px-2 py-1.5 shadow-2xl flex items-center justify-between">
        {publicTabs.map((tab) => {
          const isSelected = isLanding ? activeSection === tab.id : location.pathname === tab.target;

          // Elevated Center Booking Orb
          if (tab.isElevated) {
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNavClick(tab.target)}
                className="relative -mt-6 flex flex-col items-center justify-center group focus:outline-none"
              >
                {/* Pulsating Glowing Halo */}
                <div className="absolute inset-0 rounded-full bg-[#C89B3C] opacity-40 blur-md animate-pulse" />
                
                <div className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-[#C89B3C] via-[#DFB862] to-[#FAF2DE] text-[#182A4A] p-0.5 flex flex-col items-center justify-center shadow-2xl border-2 border-[#182A4A]">
                  <Sparkles size={16} className="animate-spin-slow text-[#182A4A]" />
                  <span className="font-display text-[9px] font-extrabold tracking-wider uppercase mt-0.5">
                    BOOK
                  </span>
                </div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleNavClick(tab.target)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 ${
                isSelected
                  ? "text-[#182A4A] font-extrabold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activePublicDock"
                  className="absolute inset-0 bg-[#FAF2DE] rounded-2xl -z-10 shadow-xs border border-[#C89B3C]/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.icon}
              <span className="text-[9px] mt-0.5 uppercase tracking-wider font-semibold">
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
