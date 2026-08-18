import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Users,
  CalendarDays,
  LogOut,
  Settings as SettingsIcon,
  LayoutDashboard,
  Clock,
  Sparkles,
  Lock,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Loader from "@/components/Layout/Loader.jsx";
import { SALON_CONFIG } from "@/data/data";
import axios from "@/api/axiosInstance";

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === "/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUserName(u.name || "");
        } catch {
          setUserName("");
        }
      }
    } else {
      setIsLoggedIn(false);
      setRole(null);
      setUserName("");
    }
  }, [location]);

  // Real-time Scroll Spy for Sections
  useEffect(() => {
    if (!isLanding) return;

    const sections = ["home", "services", "packages", "transformations", "stylists", "memberships", "book", "about"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (setActiveSection) setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding, setActiveSection]);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!isLoggedIn) return;
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
  }, [isLoggedIn, location]);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setRole(null);
      setLoading(false);
      navigate("/login");
    }, 300);
  };

  // Clean, focused public links (prevents multi-line wrapping)
  const publicLinks = [
    { id: "services", label: "Services", target: "/#services" },
    { id: "packages", label: "Packages", target: "/#packages" },
    { id: "transformations", label: "Results", target: "/#transformations" },
    { id: "memberships", label: "VIP Passes", target: "/#memberships" },
    { id: "about", label: "About", target: "/#about" },
  ];

  const adminMenus = [
    { icon: <LayoutDashboard size={15} />, path: "/dashboard", label: "Dashboard" },
    {
      icon: <CalendarDays size={15} />,
      path: "/bookings",
      label: "POS & Bills",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { icon: <Clock size={15} />, path: "/attendance", label: "Roster" },
    { icon: <Users size={15} />, path: "/employees", label: "Stylists" },
    { icon: <SettingsIcon size={15} />, path: "/settings", label: "Settings" },
  ];

  const receptionistMenus = [
    {
      icon: <CalendarDays size={15} />,
      path: "/bookings",
      label: "POS & Bills",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { icon: <Clock size={15} />, path: "/attendance", label: "Attendance" },
    { icon: <Users size={15} />, path: "/employees", label: "Stylists" },
  ];

  const handleLinkClick = (target) => {
    setIsOpen(false);
    if (!target) return;

    if (target.startsWith("/#")) {
      const elId = target.replace("/#", "");
      if (isLanding) {
        const el = document.getElementById(elId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        if (setActiveSection) setActiveSection(elId);
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

  return (
    <>
      <AnimatePresence>
        {loading && <Loader fullscreen={true} size={200} />}
      </AnimatePresence>

      <header className="fixed top-0 left-0 w-full z-50 bg-[#FDFBF9]/95 backdrop-blur-md border-b border-[#EAE3D9] h-16 transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-[#EDF3EF] border border-[#D9E4DD] flex items-center justify-center text-[#4E6758] group-hover:scale-105 transition shadow-xs">
              <Sparkles size={15} />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-[#1F2421] leading-none">
                {SALON_CONFIG.name}
              </span>
              <span className="text-[10px] font-medium text-[#7D8480] mt-0.5 hidden sm:block">
                {isLoggedIn ? `${role === "admin" ? "Owner" : "Front Desk"} Portal` : SALON_CONFIG.subtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Single Clean Row) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#4A524D]">
            {isLoggedIn ? (
              // Staff / Admin Menu Links
              <div className="flex items-center gap-1.5 bg-[#F8F5F0] p-1 rounded-2xl border border-[#EAE3D9]">
                {(role === "admin" ? adminMenus : receptionistMenus).map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleLinkClick(item.path)}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                        isActive
                          ? "bg-[#4E6758] text-white font-semibold shadow-xs"
                          : "text-[#555E58] hover:text-[#1F2421] hover:bg-white"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1 text-[9px] font-bold bg-amber-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Public Landing Links
              <div className="flex items-center gap-6">
                {publicLinks.map((item) => {
                  const isCurrent = isLanding && activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.target)}
                      className={`relative py-1 transition-colors ${
                        isCurrent
                          ? "text-[#4E6758] font-bold"
                          : "text-[#555E58] hover:text-[#1F2421]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isCurrent && (
                        <motion.span
                          layoutId="navUnderline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#4E6758] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[#68706B] font-medium hidden lg:inline">
                  {userName || (role === "admin" ? "Admin" : "Staff")}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                  <span>Exit</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleLinkClick("/login")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#555E58] hover:text-[#1F2421] hover:bg-[#F8F5F0] transition"
                  title="Staff Portal Login"
                >
                  <Lock size={12} className="text-[#4E6758]" />
                  <span>Staff Login</span>
                </button>

                <button
                  onClick={() => handleLinkClick("/#book")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4E6758] hover:bg-[#405448] text-white text-xs font-semibold shadow-soft-sm transition duration-200"
                >
                  <Calendar size={13} />
                  <span>Book Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-[#35473C] bg-[#EDF3EF] border border-[#D9E4DD]"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Slide-Down Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-[#EAE3D9] px-6 py-4 space-y-2 shadow-lg max-h-[80vh] overflow-y-auto"
            >
              {isLoggedIn ? (
                <>
                  <div className="text-[10px] font-bold uppercase text-[#7D8480] px-2 tracking-wider">
                    Staff Navigation
                  </div>
                  {(role === "admin" ? adminMenus : receptionistMenus).map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleLinkClick(item.path)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                        location.pathname === item.path
                          ? "bg-[#4E6758] text-white font-bold"
                          : "text-[#4A524D] hover:bg-[#F8F5F0]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={13} opacity={0.6} />
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 mt-2"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="text-[10px] font-bold uppercase text-[#7D8480] px-2 tracking-wider">
                    Menu
                  </div>
                  {publicLinks.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.target)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                        isLanding && activeSection === item.id
                          ? "bg-[#EDF3EF] text-[#35473C] font-bold"
                          : "text-[#4A524D] hover:bg-[#F8F5F0]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={13} opacity={0.6} />
                    </button>
                  ))}
                  <div className="pt-2 border-t border-[#F2ECE4] flex flex-col gap-2">
                    <button
                      onClick={() => handleLinkClick("/#book")}
                      className="w-full py-2.5 rounded-xl bg-[#4E6758] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-soft-sm"
                    >
                      <Calendar size={13} />
                      <span>Book Appointment</span>
                    </button>
                    <button
                      onClick={() => handleLinkClick("/login")}
                      className="w-full py-2 rounded-xl bg-[#F8F5F0] text-[#555E58] font-semibold text-xs border border-[#EAE3D9]"
                    >
                      Staff Portal Login
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
