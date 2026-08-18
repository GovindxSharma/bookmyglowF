import React from "react";
import { FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { SALON_CONFIG } from "@/data/data";
import { Sparkles, Calendar } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F4EFEA] text-[#242A26] pt-14 pb-8 px-5 sm:px-10 md:px-16 border-t border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#4E6758] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1F2421]">
                {SALON_CONFIG.name}
              </h3>
              <span className="text-[11px] text-[#68706B] font-medium block">
                {SALON_CONFIG.subtitle}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#555E58] leading-relaxed">
            Your neighborhood destination for healthy hair styling, organic skin facials, bridal beauty, and relaxing day spa therapies.
          </p>
          <div className="pt-1">
            <a
              href="#book"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4E6758] hover:bg-[#405448] text-white text-xs font-semibold shadow-xs transition"
            >
              <Calendar size={13} /> Book Appointment
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#35473C] uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-[#555E58]">
            <li>
              <a href="#about" className="hover:text-[#4E6758] transition">
                About Our Salon & Team
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-[#4E6758] transition">
                Services & Price List
              </a>
            </li>
            <li>
              <a href="#book" className="hover:text-[#4E6758] transition">
                Online Appointment Booking
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-[#4E6758] transition font-semibold text-[#4E6758]">
                Staff & Receptionist Login
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#35473C] uppercase tracking-wider">
            Contact & Location
          </h4>

          <div className="space-y-2 text-xs text-[#555E58]">
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-[#4E6758] mt-1 flex-shrink-0" />
              <a
                href={SALON_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#4E6758] transition leading-relaxed"
              >
                {SALON_CONFIG.address}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <FaEnvelope className="text-[#4E6758] flex-shrink-0" />
              <a href={`mailto:${SALON_CONFIG.email}`} className="hover:text-[#4E6758] transition">
                {SALON_CONFIG.email}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#4E6758] flex-shrink-0" />
              <a href={`tel:${SALON_CONFIG.phone}`} className="hover:text-[#4E6758] transition font-semibold text-[#1F2421]">
                {SALON_CONFIG.phone}
              </a>
              <span className="text-[11px] text-[#747E78]">(Call / WhatsApp)</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <FaInstagram className="text-[#4E6758] flex-shrink-0" size={14} />
              <a
                href="https://instagram.com/aurasalon_dayspa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#4E6758] transition"
              >
                @aurasalon_dayspa
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
