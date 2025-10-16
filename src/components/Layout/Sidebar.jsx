// src/components/Layout/Sidebar.jsx
import { Home, Scissors, CalendarDays, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={22} />, path: "/", label: "Home" },
    { icon: <CalendarDays size={22} />, path: "/bookings", label: "Bookings" },
    { icon: <Scissors size={22} />, path: "/services", label: "Services" },
    { icon: <Settings size={22} />, path: "/settings", label: "Settings" },
    // Add more menu items as needed
  ];

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 
      flex flex-col items-center 
      w-20 h-[65vh] py-6 space-y-6 
      rounded-3xl shadow-lg bg-[#FEEBF6]/90 
      backdrop-blur-md border border-white/30 
      overflow-y-auto scrollbar-hide"
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
