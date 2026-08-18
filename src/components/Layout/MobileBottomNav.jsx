import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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

  // 1. Logged in as Admin
  if (role === "admin") {
    const adminTabs = [
      { id: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      {
        id: "/bookings",
        label: "POS & Bills",
        icon: <CalendarDays size={18} />,
        badge: unreadCount > 0 ? unreadCount : null,
      },
      { id: "/attendance", label: "Roster", icon: <Clock size={18} /> },
      { id: "/employees", label: "Stylists", icon: <Users size={18} /> },
      { id: "/", label: "Client View", icon: <Home size={18} /> },
    ];

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EAE3D9] px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {adminTabs.map((tab) => {
            const isActive = location.pathname === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                  isActive ? "text-[#4E6758] font-bold" : "text-[#7D8480] hover:text-[#242A26]"
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-amber-500 text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{tab.label}</span>
                {isActive && <span className="w-1 h-1 bg-[#4E6758] rounded-full mt-0.5" />}
              </button>
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
        label: "Front Desk",
        icon: <CalendarDays size={18} />,
        badge: unreadCount > 0 ? unreadCount : null,
      },
      { id: "/attendance", label: "Attendance", icon: <Clock size={18} /> },
      { id: "/employees", label: "Staff", icon: <Users size={18} /> },
      { id: "/", label: "Client View", icon: <Home size={18} /> },
    ];

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EAE3D9] px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {recepTabs.map((tab) => {
            const isActive = location.pathname === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                  isActive ? "text-[#4E6758] font-bold" : "text-[#7D8480]"
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-amber-500 text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{tab.label}</span>
                {isActive && <span className="w-1 h-1 bg-[#4E6758] rounded-full mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Public / Guest View
  const publicTabs = [
    { id: "home", label: "Home", icon: <Home size={18} />, target: "#home" },
    { id: "services", label: "Services", icon: <Scissors size={18} />, target: "#services" },
    { id: "packages", label: "Packages", icon: <Calculator size={18} />, target: "#packages" },
    { id: "book", label: "Book Now", icon: <Calendar size={18} />, target: "#book", isHighlight: true },
    { id: "login", label: "Staff Login", icon: <Lock size={18} />, target: "/login" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EAE3D9] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {publicTabs.map((tab) => {
          const isSelected = isLanding ? activeSection === tab.id : location.pathname === tab.target;

          if (tab.isHighlight) {
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.target)}
                className="flex flex-col items-center justify-center -mt-4 bg-[#4E6758] text-white p-2.5 rounded-full shadow-soft-md transition hover:scale-105"
              >
                <Calendar size={18} />
                <span className="text-[9px] font-bold mt-0.5">Book</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.target)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                isSelected ? "text-[#4E6758] font-bold" : "text-[#7D8480] hover:text-[#242A26]"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {isSelected && <span className="w-1 h-1 bg-[#4E6758] rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
