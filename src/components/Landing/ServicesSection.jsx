import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, ArrowRight, Check } from "lucide-react";

const SALON_SERVICES = [
  {
    id: "hair",
    category: "Hair Care & Styling",
    name: "Haircut, Color & Smooth Care",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Custom cuts, rich hair color, and deep nourishing spas",
    description:
      "From precision trims to seamless highlights and organic keratin treatments, we keep your hair healthy and manageable.",
    startingPrice: "₹450",
    duration: "45–90 min",
    highlights: [
      "Haircut & Blowdry Styling (₹450)",
      "Global Hair Color & Highlights (₹2,500)",
      "Keratin Protein Smoothing (₹3,500)",
      "Deep Nourishing Hair Spa (₹950)",
    ],
  },
  {
    id: "skin",
    category: "Skin Care & Facials",
    name: "Hydra Glow & Brightening Facials",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Deep pore cleansing and natural radiant glow",
    description:
      "Gentle exfoliation, organic hydration masks, and anti-tan therapies designed for refreshing and brightening your skin.",
    startingPrice: "₹550",
    duration: "45–60 min",
    highlights: [
      "Deep Cleansing Hydra Glow Facial (₹1,800)",
      "Brightening Diamond Facial (₹1,400)",
      "O3+ Anti-Tan & Skin Clarifying Cleanup (₹850)",
      "Herbal Express Fruit Cleanup (₹550)",
    ],
  },
  {
    id: "bridal",
    category: "Bridal & Occasion Makeup",
    name: "Bridal & Event Glamour",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Flawless HD makeup, hair styling, and saree draping",
    description:
      "Look your radiant best on weddings, receptions, and festivals with long-lasting HD makeup and customized hair artistry.",
    startingPrice: "₹2,200",
    duration: "60–120 min",
    highlights: [
      "Complete HD Bridal Makeup Package (₹8,500)",
      "Engagement & Sangeet Makeup (₹3,200)",
      "Party Makeup & Hair Updo (₹2,200)",
      "Professional Saree Draping (₹400)",
    ],
  },
  {
    id: "nails",
    category: "Hands, Feet & Nails",
    name: "Luxury Pedicure & Nail Care",
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Relaxing foot soaks, nail shaping, and long-lasting gel art",
    description:
      "Pamper your hands and feet with warm botanical soaks, dead skin buffing, cuticle care, and elegant nail art.",
    startingPrice: "₹450",
    duration: "40–60 min",
    highlights: [
      "Deluxe Rose Petal Spa Pedicure (₹650)",
      "Nourishing Manicure with Massage (₹450)",
      "Gel Polish & Nail Art (₹750)",
    ],
  },
  {
    id: "grooming",
    category: "Men's Grooming",
    name: "Haircut, Beard Trim & Face Cleanup",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Clean cuts, sharp beard styling, and refreshing cleanups",
    description:
      "Modern haircuts, precise beard shaping with hot towel steam, and detoxifying charcoal facials for men.",
    startingPrice: "₹150",
    duration: "20–45 min",
    highlights: [
      "Men's Haircut & Head Wash (₹250)",
      "Beard Trimming & Razor Lineup (₹150)",
      "Hot Towel Shave & Face Massage (₹250)",
      "Charcoal Detox Face Cleanup (₹600)",
    ],
  },
  {
    id: "spa",
    category: "Body Spa & Massage",
    name: "Full Body Relaxation Therapy",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    tagline: "Calming essential oils, Swedish massage, and body scrubs",
    description:
      "Melt away everyday stress with gentle aromatherapy massage, warm herbal compresses, and full-body exfoliating scrubs.",
    startingPrice: "₹1,600",
    duration: "60–90 min",
    highlights: [
      "Aromatherapy Full Body Relaxation (₹2,200)",
      "Swedish Deep Tissue Relief (₹2,500)",
      "Exfoliating Coffee Body Scrub (₹1,600)",
    ],
  },
];

const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState("all");

  const displayedServices =
    activeTab === "all"
      ? SALON_SERVICES
      : SALON_SERVICES.filter((s) => s.id === activeTab);

  return (
    <section
      id="services"
      className="py-20 px-6 sm:px-10 md:px-16 lg:px-24 bg-[#FDFBF9] text-[#242A26] relative"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles size={14} className="text-[#4E6758]" /> Our Service Menu & Pricing
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F2421]">
            Treatments & Everyday Care
          </h2>
          <p className="text-[#68706B] text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Transparent pricing, skilled stylists, and quality products for all hair and skin types.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-7">
            {[
              { id: "all", label: "All Services" },
              { id: "hair", label: "Hair Care" },
              { id: "skin", label: "Skin & Facials" },
              { id: "bridal", label: "Bridal & Party" },
              { id: "nails", label: "Hands & Feet" },
              { id: "grooming", label: "Men's Grooming" },
              { id: "spa", label: "Body Spa" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#4E6758] text-white shadow-soft-sm scale-102"
                    : "bg-white text-[#555E58] hover:bg-[#F2ECE4] border border-[#EAE3D9]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence>
            {displayedServices.map((service, idx) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group relative rounded-3xl overflow-hidden bg-white border border-[#EAE3D9] shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Service Image */}
                  <div className="relative h-56 overflow-hidden bg-[#F2ECE4]">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE3D9] text-[#35473C] text-xs font-bold shadow-soft-sm">
                      Starting {service.startingPrice}
                    </div>

                    <div className="absolute bottom-3 left-4">
                      <span className="text-[11px] font-semibold text-[#4E6758] bg-white/95 px-2.5 py-0.5 rounded-md backdrop-blur-md">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3.5">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1F2421]">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#68706B] leading-relaxed">
                      {service.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 pt-2 border-t border-[#F2ECE4]">
                      <span className="text-[11px] font-semibold text-[#8C948F]">
                        Popular Options:
                      </span>
                      {service.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-[#4A524D]"
                        >
                          <Check size={13} className="text-[#4E6758] flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 sm:p-6 pt-0">
                  <a
                    href="#book"
                    className="w-full py-2.5 rounded-2xl bg-[#EDF3EF] hover:bg-[#4E6758] text-[#35473C] hover:text-white font-semibold text-xs transition duration-200 flex items-center justify-center gap-1.5"
                  >
                    <span>Book This Service</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
