import React from "react";
import { motion } from "framer-motion";
import { Star, Award, Scissors, ArrowRight } from "lucide-react";

const STYLISTS = [
  {
    id: "rahul",
    name: "Rahul Sharma",
    gender: "male",
    role: "Senior Hair Stylist & Colorist",
    exp: "8+ Years Experience",
    rating: "4.95",
    reviews: "320+",
    // Professional Male Hair Stylist
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
    specialties: ["French Balayage", "Layered Scissor Cuts", "Keratin Smoothing"],
  },
  {
    id: "pooja",
    name: "Pooja Patel",
    gender: "female",
    role: "Head Aesthetician & Skin Specialist",
    exp: "6+ Years Experience",
    rating: "4.98",
    reviews: "280+",
    // Professional Female Skin Therapist
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
    specialties: ["Hydra Glow Facials", "O3+ Anti-Tan Therapy", "Diamond Cleanup"],
  },
  {
    id: "komal",
    name: "Komal Jadeja",
    gender: "female",
    role: "Master Bridal Makeup Artist",
    exp: "7+ Years Experience",
    rating: "4.99",
    reviews: "190+",
    // Professional Female Bridal Makeup Artist
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
    specialties: ["HD Bridal Makeup", "Saree & Dupatta Draping", "Engagement Glam"],
  },
  {
    id: "amit",
    name: "Amit Varma",
    gender: "male",
    role: "Men's Barber & Grooming Master",
    exp: "5+ Years Experience",
    rating: "4.92",
    reviews: "210+",
    // Professional Male Barber
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
    specialties: ["Hot Towel Shave", "Beard Shaping", "Scalp Detox Massage"],
  },
];

const StylistsSection = () => {
  return (
    <section id="stylists" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#FDFBF9] text-[#242A26] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Scissors size={14} className="text-[#4E6758]" /> Certified Salon Team
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F2421]">
            Meet Our Stylists & Specialists
          </h2>
          <p className="text-[#68706B] text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Experienced, attentive professionals dedicated to giving you the best look and care.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STYLISTS.map((stylist) => (
            <motion.div
              key={stylist.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl overflow-hidden border border-[#EAE3D9] shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo with Gender Match */}
                <div className="relative h-64 overflow-hidden bg-[#F2ECE4]">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#1F2421] shadow-xs flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{stylist.rating}</span>
                    <span className="text-gray-400 font-normal">({stylist.reviews})</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-2.5">
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#1F2421]">
                      {stylist.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#4E6758]">
                      {stylist.role}
                    </p>
                    <span className="text-[11px] text-[#7D8480] block mt-0.5">
                      {stylist.exp}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#F2ECE4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8C948F] tracking-wider block">
                      Specialties:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {stylist.specialties.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#EDF3EF] text-[#35473C] text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <a
                  href="#book"
                  className="w-full py-2.5 rounded-xl bg-[#EDF3EF] hover:bg-[#4E6758] text-[#35473C] hover:text-white font-semibold text-xs transition duration-200 flex items-center justify-center gap-1.5"
                >
                  <span>Book with {stylist.name.split(" ")[0]}</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StylistsSection;
