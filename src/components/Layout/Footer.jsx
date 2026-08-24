import React from "react";
import { FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { SALON_CONFIG } from "@/data/data";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import GeometricLogo from "@/components/Common/GeometricLogo";
import { GeometricBanner } from "@/components/Common/GeometricPattern";

const Footer = () => {
  return (
    <footer className="bg-[#FAF6EE] text-[#182A4A] pt-12 pb-8 px-4 sm:px-8 md:px-14 lg:px-20 border-t border-[#E6DCCE]">
      {/* Decorative Geometric Mosaic Strip */}
      <div className="max-w-7xl mx-auto mb-10">
        <GeometricBanner className="h-8 rounded-xl border border-[#E6DCCE] shadow-2xs" opacity={0.85} />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          <GeometricLogo size="md" variant="horizontal" />
          <p className="text-xs text-[#5C6D88] leading-relaxed max-w-sm">
            Where architectural geometric grace harmonizes with holistic botanical hair, skin, and spa rituals. Experience unhurried luxury.
          </p>
          <div className="pt-2">
            <a
              href="#book"
              className="btn-navy-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs shadow-soft-sm"
            >
              <Calendar size={13} />
              <span>BOOK AN APPOINTMENT</span>
            </a>
          </div>
        </div>

        {/* Quick Links (3 Cols) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#C89B3C]">
            EXPLORE STUDIO
          </h4>
          <ul className="space-y-2.5 text-xs text-[#3A4B68] font-medium">
            <li>
              <a href="#about" className="hover:text-[#C89B3C] transition">
                About Our Philosophy
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-[#C89B3C] transition">
                Services & Treatment Menu
              </a>
            </li>
            <li>
              <a href="#packages" className="hover:text-[#C89B3C] transition">
                Custom Package Estimator
              </a>
            </li>
            <li>
              <a href="#memberships" className="hover:text-[#C89B3C] transition">
                VIP Membership Passes
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-[#C89B3C] transition font-bold text-[#182A4A]">
                Staff & Reception Portal
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info (4 Cols) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#C89B3C]">
            LOCATION & CONTACT
          </h4>

          <div className="space-y-2.5 text-xs text-[#3A4B68]">
            <div className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-[#C89B3C] mt-1 flex-shrink-0" />
              <a
                href={SALON_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#182A4A] transition leading-relaxed font-medium"
              >
                {SALON_CONFIG.address}
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <FaEnvelope className="text-[#C89B3C] flex-shrink-0" />
              <a href={`mailto:${SALON_CONFIG.email}`} className="hover:text-[#182A4A] transition font-medium">
                {SALON_CONFIG.email}
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <FaPhoneAlt className="text-[#C89B3C] flex-shrink-0" />
              <a href={`tel:${SALON_CONFIG.phone}`} className="hover:text-[#182A4A] transition font-bold text-[#182A4A]">
                {SALON_CONFIG.phone}
              </a>
              <span className="text-[11px] text-[#8EA89D]">(Concierge Desk)</span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <FaInstagram className="text-[#C89B3C] flex-shrink-0" size={14} />
              <a
                href="https://instagram.com/urbanoasis_studio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#182A4A] transition font-medium"
              >
                @urbanoasis_studio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

