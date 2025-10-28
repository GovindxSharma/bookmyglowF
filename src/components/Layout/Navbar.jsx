import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "About Us", href: "/#about" },
    { name: "Reviews", href: "/#reviews" },
    { name: "Staff Login", href: "/login" },
  ];

  // Smooth scroll if on same page
  const handleLinkClick = (href) => {
    setIsOpen(false);
    const [path, hash] = href.split("#");

    if (hash) {
      if (location.pathname === path || path === "/") {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = href; // fallback
        }
      } else {
        window.location.href = href;
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#636CCB]/10 backdrop-blur-lg border-b border-[#636CCB]/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold tracking-wide text-[#7D83E0]"
        >
          Bunty <span className="text-gray-800">Salon</span>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.button
              key={index}
              onClick={() => handleLinkClick(link.href)}
              whileHover={{ scale: 1.05 }}
              className={`text-gray-700 font-medium px-4 py-2 rounded-full hover:bg-[#A3A8F0]/20 hover:text-[#7D83E0] transition-all duration-300`}
            >
              {link.name}
            </motion.button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#7D83E0] focus:outline-none"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/95 backdrop-blur-xl shadow-lg rounded-b-2xl mx-4 p-4 flex flex-col gap-3 border-t border-gray-200"
        >
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link.href)}
              className="text-gray-700 font-medium px-4 py-2 rounded-full hover:bg-[#A3A8F0]/20 hover:text-[#7D83E0] transition-all duration-300 text-left"
            >
              {link.name}
            </button>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
