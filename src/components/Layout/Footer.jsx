import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#F5F6FF] text-[#2A2A2A] py-12 px-5 sm:px-10 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {/* About / Brand */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[#636CCB]">Our Salon</h3>
          <p className="text-sm text-[#2A2A2A]/80">
            Experience luxury and style at our salon. Hair, beauty, and wellness services tailored for you.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="text-[#636CCB] hover:text-[#4E56B2] transition-colors"><FaFacebookF /></a>
            <a href="#" className="text-[#636CCB] hover:text-[#4E56B2] transition-colors"><FaInstagram /></a>
            <a href="#" className="text-[#636CCB] hover:text-[#4E56B2] transition-colors"><FaTwitter /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-[#636CCB]">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-[#4E56B2] transition-colors">About Us</a></li>
            <li><a href="#services" className="hover:text-[#4E56B2] transition-colors">Services</a></li>
            <li><a href="#gallery" className="hover:text-[#4E56B2] transition-colors">Gallery</a></li>
            <li><a href="#contact" className="hover:text-[#4E56B2] transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-[#636CCB]">Contact Us</h4>
          <p className="text-sm text-[#2A2A2A]/80">
            123 Style Street, Glamour City, 560001, India
          </p>
          <p className="text-sm text-[#2A2A2A]/80">
            Email: <a href="mailto:info@oursalon.com" className="hover:text-[#4E56B2]">info@oursalon.com</a>
          </p>
          <p className="text-sm text-[#2A2A2A]/80">
            Phone: <a href="tel:+911234567890" className="hover:text-[#4E56B2]">+91 12345 67890</a>
          </p>
        </div>
      </div>

      {/* Thin Copyright */}
      <div className="mt-4 border-t border-[#636CCB]/20 pt-2 text-center text-xs text-[#2A2A2A]/60">
  &copy; {new Date().getFullYear()} Our Salon. All rights reserved.
</div>

    
    
    </footer>
  );
};

export default Footer;
