import React, { useState, useEffect } from "react";
import { CalendarDays, LogOut, Users } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import AttendanceIcon from "@/assets/icons/attendance.png";
import DashboardIcon from "@/assets/icons/dashboard.png";
import axios from "@/api/axiosInstance";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => setRole(localStorage.getItem("role"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  const allMenus = {
    admin: [
      { icon: <img src={DashboardIcon} alt="Dashboard" className="w-[22px] h-[22px]" />, path: "/dashboard", label: "Dashboard" },
      { icon: <Users size={22} />, path: "/employees", label: "Employees" },
      { icon: <LogOut size={22} className="text-red-500" />, path: "#", label: "Logout", onClick: handleLogout },
    ],
    receptionist: [
      { icon: <CalendarDays size={22} />, path: "/bookings", label: "Bookings" },
      { icon: <img src={AttendanceIcon} alt="Attendance" className="w-[22px] h-[22px]" />, path: "/attendance", label: "Attendance" },
      { icon: <Users size={22} />, path: "/employees", label: "Employees" },
      { icon: <LogOut size={22} className="text-red-500" />, path: "#", label: "Logout", onClick: handleLogout },
    ],
  };

  const menuItems = allMenus[role] || [];
  const activeItem = menuItems.find((item) => location.pathname.startsWith(item.path));

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-4 top-[15%] transition-all duration-500 ease-in-out
        rounded-3xl shadow-lg bg-[#FEEBF6]/90 backdrop-blur-md border border-white/30
        overflow-hidden flex flex-col items-center
        ${isHovered ? "w-20 py-5 space-y-5" : "w-16 h-[70px] py-2 justify-center"}`}
      style={{
        height: isHovered ? "auto" : "70px", // ✨ auto-adjust height when expanded
      }}
    >
      {isHovered ? (
        menuItems.map((item, idx) =>
          item.label === "Logout" ? (
            <button
              key={idx}
              onClick={item.onClick}
              className="p-3 rounded-2xl text-red-500 hover:bg-red-100 transition-all duration-300"
              title={item.label}
            >
              {item.icon}
            </button>
          ) : (
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
          )
        )
      ) : (
        activeItem && (
          <div
            className="p-3 rounded-2xl bg-[#687FE5] text-white shadow-md flex items-center justify-center"
            title={activeItem.label}
          >
            {activeItem.icon}
          </div>
        )
      )}
    </div>
  );
};

export default Sidebar;
