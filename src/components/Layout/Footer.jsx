import React from "react";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#F5F6FF] text-[#2A2A2A] py-12 px-5 sm:px-10 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Brand / About */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[#636CCB]">Bunty Unisex Salon</h3>
          <p className="text-sm text-[#2A2A2A]/80">
            Experience the art of beauty and grooming with our professional
            stylists. Style, confidence, and care — all under one roof.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://www.instagram.com/buntys_unisex_saloon/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#636CCB] hover:text-[#4E56B2] transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-[#636CCB]">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" className="hover:text-[#4E56B2] transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-[#4E56B2] transition-colors">
                Services
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#4E56B2] transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-[#636CCB]">Contact Us</h4>
          <p className="text-sm text-[#2A2A2A]/80">
            Bunty Unisex Salon, above Deep Chinese, near HDFC bank, Baroi Rd, Mundra.
          </p>
          <p className="text-sm text-[#2A2A2A]/80">
            Email:{" "}
            <a
              href="mailto:buntyunisexsaloon@gmail.com"
              className="hover:text-[#4E56B2]"
            >
              buntyunisexsaloon@gmail.com
            </a>
          </p>
          <p className="text-sm text-[#2A2A2A]/80">
            Phone:{" "}
            <a
              href="tel:+919904334450"
              className="hover:text-[#4E56B2]"
            >
              +91 99043 34450
            </a>{" "}
            (Call / WhatsApp)
          </p>
          <p className="text-sm text-[#2A2A2A]/80">
            <a
              href="https://maps.app.goo.gl/NQ282MRtTZpuYnw8A"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4E56B2]"
            >
              View on Google Maps
            </a>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-4 border-t border-[#636CCB]/20 pt-2 text-center text-xs text-[#2A2A2A]/60">
        &copy; {new Date().getFullYear()} Bunty Unisex Salon. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
