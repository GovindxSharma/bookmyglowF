import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Users, CalendarDays, LogOut } from "lucide-react";
import DashboardIcon from "@/assets/icons/dashboard.png";
import AttendanceIcon from "@/assets/icons/attendance.png";
import Loader from "@/components/Layout/Loader.jsx"; // Fullscreen loader

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Loader
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Load token + role on route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, [location]);

  // ✅ Logout function
  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => { // simulate async logout
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole(null);
      setLoading(false);
      navigate("/login");
    }, 500);
  };

  // 🌐 Public navbar links
  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "About Us", href: "/#about" },
    { name: "Staff Login", href: "/login" },
  ];

  // 👥 Role-based menus
  const allMenus = {
    admin: [
      {
        icon: <img src={DashboardIcon} alt="Dashboard" className="w-[22px] h-[22px]" />,
        path: "/dashboard",
        label: "Dashboard",
      },
      { icon: <Users size={22} />, path: "/employees", label: "Employees" },
      { icon: <LogOut size={22} className="text-red-500" />, path: "#logout", label: "Logout", onClick: handleLogout },
    ],
    receptionist: [
      { icon: <CalendarDays size={22} />, path: "/bookings", label: "Bookings" },
      { icon: <img src={AttendanceIcon} alt="Attendance" className="w-[22px] h-[22px]" />, path: "/attendance", label: "Attendance" },
      { icon: <Users size={22} />, path: "/employees", label: "Employees" },
      { icon: <LogOut size={22} className="text-red-500" />, path: "#logout", label: "Logout", onClick: handleLogout },
    ],
  };

  // ✅ Handle link navigation without reload
  const handleLinkClick = (href, onClick) => {
    setIsOpen(false);
    if (onClick) return onClick();
    if (href === "#logout") return handleLogout();

    const [path, hash] = href.split("#");
    if (hash) {
      if (location.pathname === path || path === "/") {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else navigate(href);
      } else {
        navigate(href);
      }
    } else {
      setLoading(true); // ✅ Show loader while navigating
      setTimeout(() => {
        navigate(href);
        setLoading(false);
      }, 300);
    }
  };

  // ✅ Determine which links to render
  const linksToRender = isLoggedIn ? allMenus[role] || [] : publicLinks;

  return (
    <>
      {/* Fullscreen Loader */}
      <AnimatePresence>{loading && <Loader fullscreen={true} size={120} />}</AnimatePresence>

      <nav className="fixed top-0 left-0 w-full z-50 bg-[#636CCB]/10 backdrop-blur-lg border-b border-[#636CCB]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold tracking-wide text-[#7D83E0]"
          >
            Bunty's Unisex <span className="text-gray-800">Saloon</span>
          </motion.a>

          {/* 💻 Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {linksToRender.map((link, idx) => {
              const isActive = location.pathname === link.path; // ✅ Highlight current tab
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleLinkClick(link.path || link.href, link.onClick)}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-[#A3A8F0]/30 text-[#7D83E0]"
                      : "text-gray-700 hover:bg-[#A3A8F0]/20 hover:text-[#7D83E0]"
                  }`}
                >
                  {link.icon && <span>{link.icon}</span>}
                  {link.label || link.name}
                </motion.button>
              );
            })}
          </div>

          {/* 📱 Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#7D83E0] focus:outline-none">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* 📱 Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-lg rounded-b-2xl mx-4 p-4 flex flex-col gap-3 border-t border-gray-200"
          >
            {linksToRender.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={idx}
                  onClick={() => handleLinkClick(link.path || link.href, link.onClick)}
                  className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-all duration-300 text-left ${
                    isActive ? "bg-[#A3A8F0]/30 text-[#7D83E0]" : "text-gray-700 hover:bg-[#A3A8F0]/20 hover:text-[#7D83E0]"
                  }`}
                >
                  {link.icon && <span>{link.icon}</span>}
                  {link.label || link.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
