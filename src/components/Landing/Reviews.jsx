import React from "react";
import { Star, Quote, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const REVIEWS = [
  {
    id: 1,
    name: "Ananya Roy",
    role: "Verified Client • Hair Transformation",
    rating: 5,
    date: "August 2026",
    comment:
      "The balayage and Olaplex treatment done by Rahul was beyond stunning! The salon's minimalist aesthetic, calm music, and organic botanical scents make it an oasis in the city.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    service: "French Balayage & Glaze",
  },
  {
    id: 2,
    name: "Siddharth Malhotra",
    role: "Verified Client • Barber & Facial",
    rating: 5,
    date: "August 2026",
    comment:
      "Best men's grooming experience in the Design District. Amit's beard sculpting and the hot towel facial steam left me completely refreshed. Zero wait time with online booking!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    service: "Hot Towel Shave & Facial",
  },
  {
    id: 3,
    name: "Rhea Sen",
    role: "Verified Client • Bridal Artistry",
    rating: 5,
    date: "July 2026",
    comment:
      "Komal and her team created pure magic for my reception look. The airbrush base lasted 14+ hours without a crease. Truly architectural precision in beauty!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    service: "Ultra-HD Bridal Glamour",
  },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative overflow-hidden">
      {/* Background Subtle Geometric Circles */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-[#E6DCCE] opacity-40 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full border border-[#C89B3C]/20 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Sparkles size={13} /> CLIENT PRAISE & REVIEWS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            STORIES OF RADIANCE
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-xl mx-auto">
            Real feedback from our cherished clients who have experienced our bespoke geometric styling and holistic wellness.
          </p>

          {/* Aggregate Rating Banner */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white border border-[#E6DCCE] shadow-soft-sm mt-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-[#C89B3C] text-[#C89B3C]" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#182A4A]">4.95 / 5.0 Rating</span>
            <span className="text-[11px] text-[#6C8E82] font-semibold">(700+ Google Reviews)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl p-7 border border-[#E6DCCE] shadow-soft-sm flex flex-col justify-between relative group hover:border-[#182A4A] hover:shadow-2xl transition-all duration-300"
            >
              {/* Top Row: Stars + Quote Icon */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-[#C89B3C]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#C89B3C]" />
                    ))}
                  </div>
                  <Quote size={24} className="text-[#E6DCCE] group-hover:text-[#C89B3C] transition-colors" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#3A4B68] leading-relaxed font-normal italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Client Info Footer */}
              <div className="pt-6 mt-6 border-t border-[#FAF6EE] flex items-center gap-3.5">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#182A4A]"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-bold text-sm text-[#182A4A]">{rev.name}</h4>
                    <CheckCircle2 size={13} className="text-[#6C8E82]" />
                  </div>
                  <span className="text-[10px] text-[#C89B3C] font-extrabold uppercase tracking-wider block">
                    {rev.service}
                  </span>
                  <span className="text-[10px] text-[#9A8F7F] block">{rev.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
