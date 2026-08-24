import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, ArrowRight, Star, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { SALON_CONFIG } from "@/data/data";
import GeometricLogo, { GeometricEmblem } from "@/components/Common/GeometricLogo";
import { GeometricHeroBackdrop } from "@/components/Common/GeometricPattern";

const HeroSection = ({ onOpenAdvisor }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF6EE] min-h-[92vh] flex items-center justify-center px-4 sm:px-8 md:px-14 lg:px-20 py-12 sm:py-16 text-[#182A4A]">
      {/* Abstract Geometric Art Background */}
      <GeometricHeroBackdrop />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center z-10">
        {/* Left Column: Iconic Geometric Brand Card / Art Centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center order-2 lg:order-1"
        >
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/5] rounded-[32px] sm:rounded-[36px] bg-[#FFFFFF] border-2 border-[#182A4A] p-5 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
            {/* Layered Organic & Bauhaus Geometric Color Shapes in Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Navy Deep Arc */}
              <div className="absolute -top-12 -left-12 w-40 sm:w-48 h-40 sm:h-48 rounded-full bg-[#182A4A]/10 border-[10px] sm:border-[12px] border-[#182A4A]/20" />
              {/* Gold Sun Disc */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-[#C89B3C] opacity-85" />
              {/* Soft Teal Fluid Blob */}
              <div className="absolute bottom-14 -left-6 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-[#8EA89D] opacity-60 blur-[1px]" />
              {/* Terracotta Crescent / Wedge */}
              <div className="absolute -bottom-8 -right-8 w-36 sm:w-44 h-36 sm:h-44 rounded-full bg-[#C06C52] opacity-75" />
            </div>

            {/* Top Card Badge */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#182A4A]/15 pb-3 sm:pb-4">
              <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#182A4A]">
                GEOMETRIC GRACE
              </span>
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#FAF6EE] border border-[#182A4A]/20 text-[9px] sm:text-[10px] font-bold text-[#C89B3C] uppercase tracking-wider">
                Est. 2024
              </span>
            </div>

            {/* Central Architectural Line Art Emblem & Typography */}
            <div className="relative z-10 my-auto py-3 sm:py-6 flex flex-col items-center text-center">
              <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-md border border-[#182A4A]/20 shadow-md">
                <GeometricEmblem size={64} className="sm:hidden" />
                <GeometricEmblem size={80} className="hidden sm:block" />
              </div>
              <div className="mt-3 sm:mt-4">
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.15em] sm:tracking-[0.18em] uppercase text-[#182A4A] leading-tight">
                  Urban Oasis
                </h3>
                <span className="font-heading text-xs sm:text-sm font-extrabold tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#C89B3C] block mt-0.5">
                  STUDIO
                </span>
                <p className="text-[11px] sm:text-xs font-medium text-[#4A5D7A] tracking-wider uppercase mt-1.5">
                  Modern Abstract Aesthetic
                </p>
              </div>
            </div>

            {/* Bottom Card Floating Rating */}
            <div className="relative z-10 pt-3 border-t border-[#182A4A]/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-[#C89B3C] text-[#C89B3C]" />
                ))}
                <span className="font-bold text-[#182A4A] ml-1">4.95 / 5</span>
              </div>
              <span className="text-[11px] font-semibold text-[#6C8E82]">
                700+ Verified Clients
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: High-Impact Typography & Booking Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-7 flex flex-col gap-5 text-center lg:text-left order-1 lg:order-2"
        >
          {/* Geometric Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6DCCE] shadow-soft-sm self-center lg:self-start">
            <span className="w-2 h-2 rounded-full bg-[#C89B3C] animate-pulse" />
            <span className="geo-tag text-[#182A4A]">Modern Abstract Beauty & Wellness</span>
          </div>

          {/* Main Display Headline */}
          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-[1.1]">
              FIND BALANCE
            </h1>
            <p className="font-serif-soft italic text-2xl sm:text-3xl md:text-4xl text-[#C89B3C] font-normal">
              where geometry meets holistic grace.
            </p>
          </div>

          {/* Description */}
          <p className="text-[#3A4B68] text-sm sm:text-base md:text-lg leading-relaxed max-w-xl self-center lg:self-start">
            Welcome to <strong className="text-[#182A4A] font-bold">{SALON_CONFIG.name}</strong>. Step into a thoughtfully designed space blending architectural elegance with custom hair styling, organic skin facials, bridal glamour, and calming day spa therapies.
          </p>

          {/* CTA Buttons & Virtual Style Advisor */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
            <motion.a
              href="#book"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-navy-primary px-7 py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-navy-glow"
            >
              <Calendar size={16} />
              <span>BOOK APPOINTMENT</span>
            </motion.a>

            <motion.button
              type="button"
              onClick={onOpenAdvisor}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3.5 rounded-xl bg-[#FAF2DE] hover:bg-[#F5E7C8] border-2 border-[#C89B3C] text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#182A4A] flex items-center justify-center gap-2 shadow-soft-sm transition"
            >
              <Sparkles size={16} className="text-[#C89B3C]" />
              <span>STYLE ADVISOR QUIZ</span>
            </motion.button>
          </div>

          {/* Trust Metrics with Geometric Accents */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-[#E6DCCE] text-left">
            <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-3.5 rounded-2xl border border-[#E6DCCE] shadow-soft-sm">
              <div className="flex items-center gap-1.5 text-[#C89B3C] mb-1">
                <Star size={14} className="fill-[#C89B3C]" />
                <span className="font-bold text-xs sm:text-sm text-[#182A4A]">4.95 / 5</span>
              </div>
              <span className="text-[11px] font-medium text-[#4A5D7A] block">
                Top Rated Studio
              </span>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-3.5 rounded-2xl border border-[#E6DCCE] shadow-soft-sm">
              <div className="flex items-center gap-1.5 text-[#6C8E82] mb-1">
                <ShieldCheck size={14} />
                <span className="font-bold text-xs sm:text-sm text-[#182A4A]">100% Sterile</span>
              </div>
              <span className="text-[11px] font-medium text-[#4A5D7A] block">
                Single-Use Kits
              </span>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-3.5 rounded-2xl border border-[#E6DCCE] shadow-soft-sm">
              <div className="flex items-center gap-1.5 text-[#C06C52] mb-1">
                <Clock size={14} />
                <span className="font-bold text-xs sm:text-sm text-[#182A4A]">Zero Wait</span>
              </div>
              <span className="text-[11px] font-medium text-[#4A5D7A] block">
                Instant Confirmation
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
