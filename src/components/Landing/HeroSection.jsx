import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, ArrowRight, Star, Clock, ShieldCheck, Heart } from "lucide-react";
import { SALON_CONFIG } from "@/data/data";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF9] via-[#F8F4EE] to-[#FDFBF9] min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-16 sm:py-20 text-[#242A26]">
      {/* Subtle organic background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[380px] h-[380px] bg-[#E2ECE5]/60 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#F5ECE4]/70 rounded-full blur-[110px] pointer-events-none"></div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="z-10 flex flex-col gap-5 max-w-xl text-center md:text-left"
      >
        {/* Friendly Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF3EF] border border-[#D9E4DD] text-xs font-semibold text-[#35473C] self-center md:self-start">
          <Sparkles size={14} className="text-[#4E6758]" />
          <span>Unisex Hair, Skin & Wellness Day Spa</span>
        </div>

        {/* Clear & Meaningful Headline */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] text-[#1F2421] tracking-tight">
          A welcoming space for your{" "}
          <span className="text-[#4E6758] italic font-serif-soft">
            hair, skin & self-care.
          </span>
        </h1>

        <p className="text-[#555E58] text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
          Experience personalized hair styling, soothing facials, and relaxing spa therapies at{" "}
          <strong className="text-[#242A26] font-semibold">{SALON_CONFIG.name}</strong>. Enjoy friendly stylists, clean single-use kits, and unhurried care.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center md:justify-start pt-2">
          <motion.a
            href="#book"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 bg-[#4E6758] hover:bg-[#405448] text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-soft-md transition duration-200"
          >
            <Calendar size={16} />
            <span>Book an Appointment</span>
          </motion.a>

          <motion.a
            href="#services"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 bg-white border border-[#DDD5CA] hover:bg-[#FAF7F2] text-[#35473C] px-6 py-3.5 rounded-full font-semibold text-sm shadow-soft-sm transition duration-200"
          >
            <span>View Services & Prices</span>
            <ArrowRight size={15} />
          </motion.a>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EAE3D9] text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFF8EB] text-amber-600 border border-amber-100">
              <Star size={15} className="fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1F2421]">4.9 / 5.0</div>
              <div className="text-[11px] text-[#747E78]">650+ Client Reviews</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EDF3EF] text-[#4E6758] border border-[#D9E4DD]">
              <ShieldCheck size={15} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1F2421]">100% Clean</div>
              <div className="text-[11px] text-[#747E78]">Sterilized Tools</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F6EFE9] text-[#9C7D64] border border-[#EDE2D8]">
              <Clock size={15} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1F2421]">Instant Slot</div>
              <div className="text-[11px] text-[#747E78]">Fast Confirmation</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Visual Showcase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative mt-12 md:mt-0 md:ml-10 lg:ml-16 z-10 flex justify-center"
      >
        <div className="relative w-[300px] sm:w-[380px] md:w-[420px] lg:w-[460px] h-[360px] sm:h-[450px] md:h-[480px] rounded-[32px] overflow-hidden shadow-soft-lg border-4 border-white bg-white">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80"
            alt="Relaxing Salon Treatment"
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
          />

          {/* Gentle Floating Card */}
          <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE3D9] shadow-soft-md">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-[#4E6758]">
                Verified Customer
              </span>
            </div>
            <p className="text-xs text-[#4A524D] leading-snug">
              "The most peaceful salon experience in town. Loved the haircut, and the facial gave an instant glow!"
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
