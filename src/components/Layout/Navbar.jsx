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
  ArrowRight,
  Phone,
  MessageCircle,
  Scissors,
  Star,
  MapPin,
} from "lucide-react";
import Loader from "@/components/Layout/Loader.jsx";
import { SALON_CONFIG } from "@/data/data";
import GeometricLogo, { GeometricEmblem } from "@/components/Common/GeometricLogo";
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

  // Lock body scroll when mobile fullscreen canvas is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

    const sections = [
      "home",
      "services",
      "botanicals",
      "packages",
      "transformations",
      "reviews",
      "stylists",
      "memberships",
      "gift-cards",
      "book",
      "about",
    ];
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

  // Curated architectural links with subtitles and quick tags
  const publicLinks = [
    {
      num: "01",
      id: "services",
      label: "SERVICES",
      desktopLabel: "SERVICES",
      tagline: "Hair, Skin, Spa & Grooming",
      badge: "6 Categories",
      target: "/#services",
    },
    {
      num: "02",
      id: "packages",
      label: "PACKAGE ESTIMATOR",
      desktopLabel: "PACKAGES",
      tagline: "Custom Self-Care Combos",
      badge: "15% Combo Off",
      target: "/#packages",
    },
    {
      num: "03",
      id: "transformations",
      label: "RESULTS & CASE STUDIES",
      desktopLabel: "RESULTS",
      tagline: "Before / After Portfolio",
      badge: "Hair & Skin",
      target: "/#transformations",
    },
    {
      num: "04",
      id: "reviews",
      label: "CLIENT PRAISE",
      desktopLabel: "REVIEWS",
      tagline: "Verified Google Feedback",
      badge: "★ 4.95 Rating",
      target: "/#reviews",
    },
    {
      num: "05",
      id: "stylists",
      label: "SPECIALISTS & ARTISTS",
      desktopLabel: "SPECIALISTS",
      tagline: "Master Stylists & Aestheticians",
      badge: "5 Experts",
      target: "/#stylists",
    },
    {
      num: "06",
      id: "memberships",
      label: "VIP PASSES",
      desktopLabel: "MEMBERSHIPS",
      tagline: "Prepaid Wallet Bonus & Perks",
      badge: "Save ₹3,000",
      target: "/#memberships",
    },
    {
      num: "07",
      id: "gift-cards",
      label: "GIFT VOUCHERS",
      desktopLabel: "GIFT CARDS",
      tagline: "Digital Custom Cards",
      badge: "WhatsApp Ready",
      target: "/#gift-cards",
    },
    {
      num: "08",
      id: "about",
      label: "ABOUT STUDIO",
      desktopLabel: "ABOUT",
      tagline: "Bauhaus Philosophy & Location",
      badge: "Design District",
      target: "/#about",
    },
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

  const handleWhatsAppConcierge = () => {
    const text = encodeURIComponent(
      `✨ *${SALON_CONFIG.name} — Concierge Desk* ✨\nHello! I would like to check availability for an appointment.`
    );
    window.open(`https://wa.me/${SALON_CONFIG.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  return (
    <>
      <AnimatePresence>
        {loading && <Loader fullscreen={true} size={200} />}
      </AnimatePresence>

      {/* TOP DESKTOP & MOBILE HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        {/* Top Floating Glass Capsule Bar on Mobile / Full Nav on Desktop */}
        <div className="max-w-7xl mx-auto px-3 sm:px-8 pt-2.5 sm:pt-0">
          <div className="h-16 sm:h-18 px-4 sm:px-6 rounded-2xl sm:rounded-none bg-[#FAF6EE]/95 sm:bg-[#FAF6EE]/90 backdrop-blur-xl border border-[#E6DCCE] sm:border-0 sm:border-b sm:border-[#E6DCCE] shadow-soft-sm sm:shadow-none flex items-center justify-between transition-all">
            
            {/* Brand Logo with Architectural Emblem */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <GeometricLogo size="md" variant="horizontal" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-[0.12em] text-[#182A4A]">
              {isLoggedIn ? (
                // Staff / Admin Menu Links
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E6DCCE] shadow-soft-sm">
                  {(role === "admin" ? adminMenus : receptionistMenus).map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleLinkClick(item.path)}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition text-xs font-semibold ${
                          isActive
                            ? "bg-[#182A4A] text-white shadow-xs"
                            : "text-[#4A5D7A] hover:text-[#182A4A] hover:bg-[#F7F2E7]"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1 text-[9px] font-bold bg-[#C89B3C] text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                // Public Landing Links (Modern Geometric Uppercase — Spacious & Uncongested)
                <div className="flex items-center gap-3.5 lg:gap-4 xl:gap-5 text-[11px] xl:text-xs font-bold tracking-[0.08em] xl:tracking-[0.1em]">
                  {publicLinks.map((item) => {
                    const isCurrent = isLanding && activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleLinkClick(item.target)}
                        className={`relative py-1.5 uppercase transition-colors whitespace-nowrap ${
                          isCurrent
                            ? "text-[#C89B3C] font-extrabold"
                            : "text-[#182A4A]/80 hover:text-[#182A4A]"
                        }`}
                      >
                        <span>{item.desktopLabel || item.label}</span>
                        {isCurrent && (
                          <motion.span
                            layoutId="navUnderline"
                            className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#C89B3C] rounded-full"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </nav>

            {/* Desktop Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-[#4A5D7A] font-semibold hidden xl:inline">
                    {userName || (role === "admin" ? "Studio Owner" : "Front Desk")}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                    title="Sign Out"
                  >
                    <LogOut size={13} />
                    <span>Exit</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 xl:gap-2.5 flex-shrink-0">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-[11px] xl:text-xs font-bold tracking-wider text-[#182A4A]/70 hover:text-[#182A4A] px-2.5 py-2 transition hidden xl:inline-block"
                  >
                    STAFF LOGIN
                  </button>
                  <a
                    href="#book"
                    className="btn-navy-primary px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-soft-sm whitespace-nowrap"
                  >
                    <Calendar size={13} />
                    <span>BOOK NOW</span>
                  </a>
                </div>
              )}
            </div>

            {/* NEW IDEA: Mobile Bauhaus Capsule Controls (Live Status + Menu Trigger) */}
            <div className="flex sm:hidden items-center gap-2">
              {/* Studio Live Status Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-[10px] font-bold text-[#182A4A]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>OPEN</span>
              </div>

              {/* Quick Book Pill */}
              <a
                href="#book"
                className="px-3 py-1.5 rounded-xl bg-[#182A4A] text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs border border-[#C89B3C]/50"
              >
                <Sparkles size={11} className="text-[#C89B3C]" />
                <span>BOOK</span>
              </a>

              {/* Animated Bauhaus Menu Toggle Button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl transition duration-200 flex items-center justify-center ${
                  isOpen
                    ? "bg-[#182A4A] text-white border border-[#182A4A]"
                    : "bg-white text-[#182A4A] hover:bg-[#FAF2DE] border border-[#E6DCCE]"
                }`}
                aria-label="Toggle Fullscreen Menu"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* REVOLUTIONARY: FULLSCREEN BAUHAUS ART CANVAS MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="sm:hidden fixed inset-0 top-0 left-0 w-full h-screen z-50 bg-[#182A4A] text-white flex flex-col justify-between overflow-y-auto"
            >
              {/* Decorative Geometric Shapes Floating in Background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#C89B3C] opacity-30 blur-2xl" />
                <div className="absolute top-1/2 -left-20 w-52 h-52 rounded-full bg-[#8EA89D] opacity-20 blur-2xl" />
                <div className="absolute -bottom-10 right-10 w-48 h-48 rounded-full bg-[#C06C52] opacity-25 blur-xl" />
                <div className="absolute inset-x-8 top-20 h-px bg-white/10" />
                <div className="absolute inset-x-8 bottom-32 h-px bg-white/10" />
              </div>

              {/* Canvas Header (Top Close + Logo) */}
              <div className="relative z-10 p-5 flex items-center justify-between border-b border-white/10 bg-[#182A4A]/90 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                    <GeometricEmblem size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm uppercase tracking-widest text-white">
                      URBAN OASIS
                    </h3>
                    <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#C89B3C] block">
                      GEOMETRIC GRACE
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/15 transition flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Canvas Body: Numbered Bauhaus Navigation List */}
              <div className="relative z-10 px-6 py-6 flex-1 flex flex-col justify-center space-y-3">
                <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-[#C89B3C] block mb-1">
                  // STUDIO DIRECTORY
                </span>

                {isLoggedIn ? (
                  // Staff Options in Mobile Canvas
                  <div className="space-y-2">
                    {(role === "admin" ? adminMenus : receptionistMenus).map((item, idx) => (
                      <motion.button
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 + 0.1 }}
                        onClick={() => handleLinkClick(item.path)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[#C89B3C]/20 text-[#C89B3C]">
                            {item.icon}
                          </div>
                          <span className="font-display text-base font-extrabold tracking-wide uppercase">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-[#C89B3C]" />
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  // Public Client Numbered Links
                  publicLinks.map((item, idx) => {
                    const isCurrent = isLanding && activeSection === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 + 0.08 }}
                        onClick={() => handleLinkClick(item.target)}
                        className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-between transition-all text-left group ${
                          isCurrent
                            ? "bg-white/15 border border-[#C89B3C]"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="font-mono text-xs font-bold text-[#C89B3C] opacity-80">
                            {item.num}
                          </span>
                          <div>
                            <span className="font-display text-lg font-extrabold uppercase tracking-wider block text-white group-hover:text-[#C89B3C] transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-white/60 block">
                              {item.tagline}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-[#C89B3C] border border-white/15">
                          {item.badge}
                        </span>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Canvas Footer: Quick Concierge & Booking Actions */}
              <div className="relative z-10 p-6 pt-4 border-t border-white/10 bg-[#182A4A]/95 backdrop-blur-md space-y-3">
                {/* 2-Action Grid: Book + WhatsApp Concierge */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="#book"
                    onClick={() => setIsOpen(false)}
                    className="btn-gold-primary py-3.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-gold-glow uppercase tracking-wider"
                  >
                    <Calendar size={15} />
                    <span>BOOK SLOT</span>
                  </a>

                  <button
                    onClick={handleWhatsAppConcierge}
                    className="py-3.5 px-3 rounded-2xl bg-[#25D366] hover:bg-[#20BE5A] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft-sm uppercase tracking-wider transition"
                  >
                    <MessageCircle size={15} />
                    <span>WHATSAPP</span>
                  </button>
                </div>

                {/* Staff Login / Logout Footer Strip */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-white/60">
                    <MapPin size={12} className="text-[#C89B3C]" />
                    <span>Design District, Studio #4</span>
                  </div>

                  {!isLoggedIn ? (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/login");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#C89B3C] hover:text-white transition uppercase tracking-wider"
                    >
                      <Lock size={12} />
                      <span>Staff Portal</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition uppercase tracking-wider"
                    >
                      <LogOut size={12} />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
