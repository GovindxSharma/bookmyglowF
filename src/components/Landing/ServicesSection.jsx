import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, ArrowRight, Check, Calendar, Plus, Heart } from "lucide-react";
import { GeometricServiceIcon, GeometricBanner } from "@/components/Common/GeometricPattern";

const CATEGORIES = [
  { id: "all", label: "All Treatments", color: "navy" },
  { id: "hair", label: "Hair & Styling", color: "navy", iconType: "hair" },
  { id: "skin", label: "Skin & Facials", color: "gold", iconType: "skin" },
  { id: "spa", label: "Body Spa & Wellness", color: "teal", iconType: "spa" },
  { id: "nails", label: "Hands & Feet", color: "terracotta", iconType: "nails" },
  { id: "bridal", label: "Bridal Glam", color: "gold", iconType: "bridal" },
  { id: "grooming", label: "Men's Barber", color: "navy", iconType: "grooming" },
];

const SALON_SERVICES = [
  {
    id: "hair",
    category: "hair",
    categoryLabel: "Hair Care & Styling",
    name: "Precision Haircut, Color & Smooth Care",
    iconType: "hair",
    color: "navy",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Bespoke scissor work, rich balayage, and restorative keratin",
    description:
      "From precision modern cuts to dimensional balayage highlights and organic keratin treatments, we keep your hair vibrant and healthy.",
    startingPrice: "₹450",
    duration: "45–90 min",
    highlights: [
      "Signature Haircut & Blowdry Styling (₹450)",
      "French Balayage & Olaplex Gloss (₹2,500)",
      "Organic Keratin Protein Infusion (₹3,500)",
      "Deep Nourishing Botanical Hair Spa (₹950)",
    ],
  },
  {
    id: "skin",
    category: "skin",
    categoryLabel: "Skin Care & Facials",
    name: "Hydra Glow & Brightening Facials",
    iconType: "skin",
    color: "gold",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Ultrasonic deep pore cleansing & glass-skin radiance",
    description:
      "Gentle ultrasonic exfoliation, botanical hydration masks, and anti-tan therapies designed for instant brightening and cellular renewal.",
    startingPrice: "₹550",
    duration: "45–60 min",
    highlights: [
      "Deep Cleansing Hydra Glow Facial (₹1,800)",
      "Diamond Radiance Brightening Facial (₹1,400)",
      "O3+ Anti-Tan & Skin Clarifying Cleanup (₹850)",
      "Herbal Express Glow Cleanup (₹550)",
    ],
  },
  {
    id: "bridal",
    category: "bridal",
    categoryLabel: "Bridal & Occasion Artistry",
    name: "Bridal & Event Glamour",
    iconType: "bridal",
    color: "gold",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Flawless HD makeup, couture hair artistry, and saree draping",
    description:
      "Look your radiant best on weddings, receptions, and festivals with long-lasting HD airbrush makeup and customized bridal hair artistry.",
    startingPrice: "₹2,200",
    duration: "60–120 min",
    highlights: [
      "Complete Ultra-HD Bridal Makeover (₹8,500)",
      "Engagement & Sangeet Cocktail Glam (₹3,200)",
      "Party Glamour & Floral Hair Updo (₹2,200)",
      "Professional Couture Saree Draping (₹400)",
    ],
  },
  {
    id: "nails",
    category: "nails",
    categoryLabel: "Hands, Feet & Nails",
    name: "Luxury Pedicure & Nail Art",
    iconType: "nails",
    color: "terracotta",
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Relaxing rose foot soaks, cuticle therapy, and gel art",
    description:
      "Pamper your hands and feet with warm rose petal botanical soaks, dead skin buffing, tension massage, and long-lasting gel extensions.",
    startingPrice: "₹450",
    duration: "40–60 min",
    highlights: [
      "Deluxe Rose Petal Spa Pedicure (₹650)",
      "Nourishing Manicure with Hot Oil Massage (₹450)",
      "Long-Lasting Gel Polish & Custom Nail Art (₹750)",
      "Callus Smoothing & Foot Reflexology (₹500)",
    ],
  },
  {
    id: "grooming",
    category: "grooming",
    categoryLabel: "Men's Grooming",
    name: "Clean Cuts, Beard Sculpt & Facial Steam",
    iconType: "grooming",
    color: "navy",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Sharp scissor cuts, razor line-up, and hot towel pampering",
    description:
      "Modern men's haircuts, precise beard sculpting with hot towel steam, and detoxifying charcoal cleanups crafted for the modern gentleman.",
    startingPrice: "₹150",
    duration: "20–45 min",
    highlights: [
      "Men's Haircut & Invigorating Head Wash (₹250)",
      "Beard Sculpting & Razor Lineup (₹150)",
      "Hot Towel Royal Shave & Face Massage (₹250)",
      "Charcoal Detox Pore Face Cleanup (₹600)",
    ],
  },
  {
    id: "spa",
    category: "spa",
    categoryLabel: "Body Spa & Holistic Wellness",
    name: "Full Body Aromatherapy Massage",
    iconType: "spa",
    color: "teal",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Essential oil therapies for total muscle relief and calmness",
    description:
      "Melt away physical fatigue with warm herbal compress, Swedish body strokes, and essential aroma oils in our serene private suites.",
    startingPrice: "₹1,800",
    duration: "60–90 min",
    highlights: [
      "Full Body Aromatherapy Stress Relief (₹2,200)",
      "Deep Tissue Muscle Recovery Therapy (₹2,500)",
      "Balinese Relaxing Oil Massage (₹1,800)",
      "Herbal Body Scrub & Glow Polish (₹1,500)",
    ],
  },
];

const ServicesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices =
    selectedCategory === "all"
      ? SALON_SERVICES
      : SALON_SERVICES.filter((s) => s.category === selectedCategory);

  return (
    <section id="services" className="py-20 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative">
      <div className="max-w-7xl mx-auto mb-14">
        <GeometricBanner className="h-10 rounded-2xl border border-[#E6DCCE] shadow-soft-sm mb-12" opacity={0.8} />

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Sparkles size={13} /> CURATED MENU
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            SERVICES & EXPERIENCES
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base font-normal max-w-xl mx-auto">
            Discover precision cuts, rejuvenating skin therapies, and tranquil wellness rituals crafted with certified organic products.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#182A4A] text-white shadow-soft-md scale-105"
                    : "bg-white text-[#182A4A] hover:bg-[#F7F2E7] border border-[#E6DCCE]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    cat.color === "gold"
                      ? "bg-[#C89B3C]"
                      : cat.color === "teal"
                      ? "bg-[#8EA89D]"
                      : cat.color === "terracotta"
                      ? "bg-[#C06C52]"
                      : "bg-[#182A4A]"
                  }`}
                />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E6DCCE] shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] sm:aspect-auto sm:h-56 overflow-hidden bg-[#FAF6EE]">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E6DCCE] text-[10px] font-extrabold uppercase tracking-wider text-[#182A4A] shadow-xs">
                    {service.categoryLabel}
                  </div>

                  <div className="absolute bottom-3 right-3 shadow-md">
                    <GeometricServiceIcon type={service.iconType} color={service.color} />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#8EA89D]">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {service.duration}
                      </span>
                      <span className="text-sm font-extrabold text-[#C89B3C]">
                        Starts {service.startingPrice}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#182A4A] leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#5C6D88] leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#FAF6EE]">
                    <span className="text-[10px] font-extrabold uppercase text-[#9A8F7F] tracking-wider block">
                      Popular Treatments:
                    </span>
                    <ul className="space-y-1.5">
                      {service.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs font-medium text-[#182A4A]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="#book"
                  className="w-full py-3 rounded-xl bg-[#FAF6EE] hover:bg-[#182A4A] text-[#182A4A] hover:text-white font-bold text-xs uppercase tracking-wider transition duration-200 flex items-center justify-center gap-2 border border-[#E6DCCE]"
                >
                  <Calendar size={14} />
                  <span>Book This Treatment</span>
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ServicesSection;
