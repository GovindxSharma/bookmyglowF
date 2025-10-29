import React from "react";
import { FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#EEF0FF] to-[#F7F8FF] text-[#2A2A2A] pt-14 pb-8 px-5 sm:px-10 md:px-16 shadow-inner border-t border-[#E0E2FF]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Brand / About */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[#636CCB]">Bunty's Unisex Saloon</h3>
          <p className="text-sm text-[#2A2A2A]/80 leading-relaxed">
            Experience the art of beauty and grooming with our professional stylists.  
            Style, confidence, and care — all under one roof. Visit now.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-5">
          <div>
            <h4 className="text-lg font-semibold text-[#636CCB]">Quick Links</h4>
            <ul className="space-y-2 text-sm mt-3">
              <li>
                <a
                  href="#about"
                  className="hover:text-[#4E56B2] transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-[#4E56B2] transition-colors duration-200"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#book"
                  className="hover:text-[#4E56B2] transition-colors duration-200"
                >
                  Book Now
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[#636CCB]">Reach Us</h4>

          <div className="flex items-start gap-3 text-sm text-[#2A2A2A]/80">
            <FaMapMarkerAlt className="text-[#636CCB] mt-0.5 flex-shrink-0" />
            <a
              href="https://maps.app.goo.gl/NQ282MRtTZpuYnw8A"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4E56B2] leading-relaxed transition-colors duration-200"
            >
              Bunty's Unisex Saloon, above Deep Chinese, near HDFC Bank,  
              Baroi Rd, Mundra
            </a>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#2A2A2A]/80">
            <FaEnvelope className="text-[#636CCB] flex-shrink-0" />
            <a
              href="mailto:buntyunisexsaloon@gmail.com"
              className="hover:text-[#4E56B2] transition-colors duration-200"
            >
              buntyunisexsaloon@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#2A2A2A]/80">
            <FaPhoneAlt className="text-[#636CCB] flex-shrink-0" />
            <a
              href="tel:+919904334450"
              className="hover:text-[#4E56B2] transition-colors duration-200"
            >
              +91 99043 34450
            </a>
            <span className="text-xs text-[#2A2A2A]/60">(Call / WhatsApp)</span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <FaInstagram className="text-[#636CCB] flex-shrink-0" size={18} />
            <a
              href="https://www.instagram.com/buntys_unisex_saloon/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#2A2A2A]/80 hover:text-[#4E56B2] transition-colors duration-200"
            >
              buntys_unisex_saloon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
