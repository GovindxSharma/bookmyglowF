import React, { useState, useEffect } from "react";
import { Scissors, CalendarDays, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import AttendanceIcon from "@/assets/icons/attendance.png";
import DashboardIcon from "@/assets/icons/dashboard.png";

const Sidebar = () => {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
      }
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
    ],
  };

  const menuItems = allMenus[role] || [];

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center 
      w-20 h-[65vh] py-6 space-y-6 rounded-3xl shadow-lg bg-[#FEEBF6]/90 
      backdrop-blur-md border border-white/30 overflow-y-auto scrollbar-hide"
    >
      {menuItems.map((item, idx) => (
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
      ))}
    </div>
  );
};

export default Sidebar;
