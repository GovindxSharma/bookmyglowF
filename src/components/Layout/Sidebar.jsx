import React, { useState, useEffect } from "react";
import { Scissors, CalendarDays, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import AttendanceIcon from "@/assets/icons/attendance.png";
import DashboardIcon from "@/assets/icons/dashboard.png";
import axios from "@/api/axiosInstance";

const Sidebar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout"); // call logout API
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  const allMenus = {
    admin: [
      {
        icon: (
          <img
            src={DashboardIcon}
            alt="Dashboard"
            className="w-[22px] h-[22px]"
          />
        ),
        path: "/dashboard",
        label: "Dashboard",
      },
      { icon: <Scissors size={22} />, path: "/services", label: "Services" },
      { icon: <Settings size={22} />, path: "/settings", label: "Settings" },
      {
        icon: <LogOut size={22} className="text-red-500" />,
        path: "#",
        label: "Logout",
        onClick: handleLogout, // call logout function
      },
    ],
    receptionist: [
      {
        icon: <CalendarDays size={22} />,
        path: "/bookings",
        label: "Bookings",
      },
      {
        icon: (
          <img
            src={AttendanceIcon}
            alt="Attendance"
            className="w-[22px] h-[22px]"
          />
        ),
        path: "/attendance",
        label: "Attendance",
      },
      {
        icon: <LogOut size={22} className="text-red-500" />,
        path: "#",
        label: "Logout",
        onClick: handleLogout,
      },
    ],
  };

  const menuItems = allMenus[role] || [];

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center 
      w-20 h-[65vh] py-6 space-y-6 rounded-3xl shadow-lg bg-[#FEEBF6]/90 
      backdrop-blur-md border border-white/30 overflow-y-auto scrollbar-hide"
    >
      {menuItems.map((item, idx) => {
        if (item.label === "Logout") {
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className="p-3 rounded-2xl transition-all duration-300 text-red-500 hover:bg-red-100"
              title={item.label}
            >
              {item.icon}
            </button>
          );
        }

        return (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `p-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-[#687FE5] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#EBD6FB] hover:text-[#687FE5]"
              }`
            }
            title={item.label}
          >
            {item.icon}
          </NavLink>
        );
      })}
    </div>
  );
};

export default Sidebar;
