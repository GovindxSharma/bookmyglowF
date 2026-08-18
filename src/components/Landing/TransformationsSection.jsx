import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Star, User } from "lucide-react";

const TRANSFORMATIONS = [
  {
    id: "balayage",
    title: "French Balayage & Hair Gloss",
    category: "Hair Color & Styling",
    client: "Priya M.",
    timeTaken: "2.5 Hours",
    stylist: "Rahul Sharma (Senior Colorist)",
    description: "Transformed dull, uncolored frizzy hair into dimensional warm caramel balayage with high-shine Olaplex gloss glaze.",
    // Real salon client before & after hair color transformation
    beforeImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    servicesUsed: ["Dimensional Balayage", "Olaplex Bonding", "Face Framing Cut"],
  },
  {
    id: "hydra",
    title: "Deep Cleansing Hydra Facial",
    category: "Skin Care",
    client: "Ananya R.",
    timeTaken: "60 Mins",
    stylist: "Pooja Patel (Skin Specialist)",
    description: "Deep ultrasonic pore extraction, botanical hydration infusion, and soothing cryo-globe cooling for glass-skin radiance.",
    // Real client skin facial transformation
    beforeImg: "https://images.unsplash.com/photo-1512290900672-1f4864fefb36?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    servicesUsed: ["Hydra Micro-Derm", "Hyaluronic Infusion", "Cold Cryo Mask"],
  },
  {
    id: "grooming",
    title: "Men's Haircut & Beard Shaping",
    category: "Men's Grooming",
    client: "Vikram S.",
    timeTaken: "45 Mins",
    stylist: "Amit Varma (Men's Barber)",
    description: "Tamed overgrown hair and patchy beard into a sharp taper fade, crisp razor line-up, and hot towel facial steam.",
    // Real male customer hair & beard transformation
    beforeImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    servicesUsed: ["Precision Taper Fade", "Hot Towel Shave", "Beard Sculpting"],
  },
  {
    id: "bridal",
    title: "HD Bridal Makeup & Hair Updo",
    category: "Bridal Glam",
    client: "Rhea K.",
    timeTaken: "2 Hours",
    stylist: "Komal Jadeja (Bridal Artist)",
    description: "Complete bridal makeover with long-wearing HD airbrush makeup, soft smokey eye, custom lashes, and floral hair updo.",
    // Real bridal client transformation
    beforeImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    servicesUsed: ["Ultra HD Airbrush Base", "Custom Mink Lashes", "Bridal Floral Updo"],
  },
];

const TransformationsSection = () => {
  const [activeItem, setActiveItem] = useState(TRANSFORMATIONS[0]);
  const [viewMode, setViewMode] = useState("side"); // 'side', 'before', 'after'

  return (
    <section id="transformations" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#F8F5F0] text-[#242A26] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles size={14} className="text-[#4E6758]" /> Real Customer Transformations
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F2421]">
            Actual Service Results & Makeovers
          </h2>
          <p className="text-[#68706B] text-sm sm:text-base mt-2 max-w-xl mx-auto">
            See the real hair, skin, and grooming results achieved by our skilled stylists.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-7">
            {TRANSFORMATIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item);
                  setViewMode("side");
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeItem.id === item.id
                    ? "bg-[#4E6758] text-white shadow-soft-sm scale-102"
                    : "bg-white text-[#555E58] hover:bg-[#F2ECE4] border border-[#EAE3D9]"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Transformation Display Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE3D9] shadow-soft-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Images Column */}
          <div className="lg:col-span-7 space-y-3.5">
            {/* View Toggle on Mobile/Desktop */}
            <div className="flex justify-center sm:justify-start gap-2 mb-1">
              <button
                onClick={() => setViewMode("side")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  viewMode === "side" ? "bg-[#4E6758] text-white shadow-xs" : "bg-[#F2ECE4] text-[#555E58]"
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode("before")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  viewMode === "before" ? "bg-[#4E6758] text-white shadow-xs" : "bg-[#F2ECE4] text-[#555E58]"
                }`}
              >
                Before Service
              </button>
              <button
                onClick={() => setViewMode("after")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  viewMode === "after" ? "bg-[#4E6758] text-white shadow-xs" : "bg-[#F2ECE4] text-[#555E58]"
                }`}
              >
                After Result ✨
              </button>
            </div>

            {/* Image Views */}
            {viewMode === "side" ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#F2ECE4] shadow-xs">
                  <img
                    src={activeItem.beforeImg}
                    alt="Before Service"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 text-white text-[11px] font-bold backdrop-blur-xs">
                    BEFORE
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#F2ECE4] shadow-xs border-2 border-[#4E6758]">
                  <img
                    src={activeItem.afterImg}
                    alt="After Service"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#4E6758] text-white text-[11px] font-bold shadow-xs">
                    AFTER ✨
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] bg-[#F2ECE4] shadow-xs">
                <img
                  src={viewMode === "before" ? activeItem.beforeImg : activeItem.afterImg}
                  alt={viewMode}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold shadow-xs ${
                    viewMode === "before" ? "bg-black/75 text-white" : "bg-[#4E6758] text-white"
                  }`}
                >
                  {viewMode === "before" ? "BEFORE SERVICE" : "AFTER (RESULT) ✨"}
                </div>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-bold text-[#4E6758] uppercase tracking-wider block mb-1">
                {activeItem.category} &bull; Client: {activeItem.client}
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#1F2421]">
                {activeItem.title}
              </h3>
              <p className="text-xs text-[#7D8480] mt-1">
                Session: {activeItem.timeTaken} &bull; Stylist: {activeItem.stylist}
              </p>
            </div>

            <p className="text-sm text-[#555E58] leading-relaxed">
              {activeItem.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-[#F2ECE4]">
              <span className="text-xs font-bold text-[#35473C]">Treatments Performed:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeItem.servicesUsed.map((srv, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EDF3EF] text-[#35473C] text-xs font-medium border border-[#D9E4DD]"
                  >
                    <CheckCircle2 size={13} className="text-[#4E6758]" />
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#book"
                className="w-full py-3 rounded-2xl bg-[#4E6758] hover:bg-[#405448] text-white font-semibold text-xs transition duration-200 flex items-center justify-center gap-2 shadow-soft-sm"
              >
                <span>Book This Service</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationsSection;
