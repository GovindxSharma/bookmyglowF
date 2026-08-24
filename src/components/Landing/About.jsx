import React from "react";
import { MapPin, Phone, Mail, Clock, Award, ShieldCheck, Heart, Sparkles, Coffee, Calendar, ArrowRight, Check } from "lucide-react";
import { SALON_CONFIG } from "@/data/data";
import { GeometricEmblem } from "@/components/Common/GeometricLogo";

const AboutUs = () => {
  return (
    <section
      id="about"
      className="relative py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] overflow-hidden"
    >
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C89B3C]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#8EA89D]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Heart size={13} /> STUDIO PHILOSOPHY
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#182A4A]">
            ABOUT URBAN OASIS STUDIO
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-xl mx-auto">
            Where architectural geometric design harmonizes with holistic botanical hair, skin, and spa rituals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Geometric Framed Portraits (Fully visible on Mobile & Desktop) */}
          <div className="lg:col-span-5 relative py-2 sm:py-6">
            <div className="relative bg-white rounded-3xl p-4 sm:p-6 border-2 border-[#182A4A] shadow-soft-lg">
              {/* Backing Gold & Terracotta Decorative Tiles */}
              <div className="absolute -top-3 -left-3 w-24 h-24 bg-[#C89B3C] rounded-2xl -rotate-6 -z-10 opacity-70" />
              <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-[#C06C52] rounded-2xl rotate-6 -z-10 opacity-70" />

              {/* Grid of 2 Team Portraits — Full View */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
                {/* Portrait 1 (Master Stylist) */}
                <div className="rounded-2xl overflow-hidden border border-[#E6DCCE] bg-[#182A4A] shadow-sm flex flex-col group">
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80"
                      alt="Rahul Sharma — Master Stylist"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#182A4A]/90 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      Master Stylist
                    </div>
                  </div>
                  <div className="p-2.5 bg-white text-center border-t border-[#E6DCCE]">
                    <h5 className="font-heading font-bold text-xs text-[#182A4A]">Rahul Sharma</h5>
                    <span className="text-[10px] text-[#C89B3C] font-semibold">Hair & Colorist</span>
                  </div>
                </div>

                {/* Portrait 2 (Lead Aesthetician) */}
                <div className="rounded-2xl overflow-hidden border border-[#E6DCCE] bg-[#182A4A] shadow-sm flex flex-col group">
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80"
                      alt="Pooja Patel — Lead Aesthetician"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#C89B3C]/95 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      Skin Specialist
                    </div>
                  </div>
                  <div className="p-2.5 bg-white text-center border-t border-[#E6DCCE]">
                    <h5 className="font-heading font-bold text-xs text-[#182A4A]">Pooja Patel</h5>
                    <span className="text-[10px] text-[#8EA89D] font-semibold">Facials & Spa</span>
                  </div>
                </div>
              </div>

              {/* Floating Architectural Center Emblem Badge */}
              <div className="mt-4 pt-3 border-t border-[#FAF6EE] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GeometricEmblem size={28} />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#182A4A]">
                    Urban Oasis Team
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#6C8E82] bg-[#E6EFEA] px-2.5 py-0.5 rounded-full">
                  ★ 4.95 Rating
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Philosophy & Studio Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="geo-tag text-[#C89B3C] font-extrabold">Architectural Grace & Care</span>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase text-[#182A4A] leading-tight">
                Designed for Calm, Crafted for Beauty.
              </h3>
              <p className="text-[#3A4B68] text-sm sm:text-base leading-relaxed pt-2">
                At <strong>{SALON_CONFIG.name}</strong>, we view hair styling, skincare, and wellness as an art form rooted in proportion, balance, and intentional care. Every consultation is unhurried, using certified eco-luxury products and sterilized instruments in a calm, modern minimalist sanctuary.
              </p>
            </div>

            {/* 4 Core Pillars with Geometric Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E6DCCE] shadow-soft-sm space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#182A4A] text-white flex items-center justify-center">
                  <Award size={16} />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#182A4A]">Certified Specialists</h4>
                <p className="text-xs text-[#5C6D88]">
                  Trained hair colorists, aestheticians, and massage therapists with 5+ years experience.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6DCCE] shadow-soft-sm space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#C89B3C] text-white flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#182A4A]">Sterile & Single-Use</h4>
                <p className="text-xs text-[#5C6D88]">
                  Hospital-grade tool autoclaves, sealed disposable towels, and strict hygiene protocols.
                </p>
              </div>
            </div>

            {/* Studio Address & Working Hours Card */}
            <div className="p-5 rounded-3xl bg-white border border-[#E6DCCE] shadow-soft-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAF6EE] pb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#C89B3C] flex-shrink-0" />
                  <div>
                    <h5 className="font-heading font-bold text-sm text-[#182A4A]">{SALON_CONFIG.name}</h5>
                    <span className="text-xs text-[#5C6D88]">{SALON_CONFIG.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6C8E82] bg-[#E6EFEA] px-3 py-1 rounded-full self-start sm:self-center">
                  <Clock size={13} /> Open Daily: 9:00 AM – 9:00 PM
                </div>
              </div>

              <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#E6DCCE] shadow-inner">
                <iframe
                  title="Studio Location"
                  src="https://maps.google.com/maps?q=Design+District+Salon+Spa&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#book"
                className="btn-gold-primary px-8 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 w-full sm:w-auto shadow-gold-glow"
              >
                <Calendar size={14} />
                <span>BOOK A SESSION</span>
              </a>
              <span className="text-xs text-[#5C6D88] font-medium text-center sm:text-left">
                Walk-ins welcomed • Online bookings receive priority access
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
