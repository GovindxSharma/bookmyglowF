import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Leaf, Droplet, Heart, Check, Flower2, Wind, ShieldCheck } from "lucide-react";

const BOTANICALS = [
  {
    id: "rose",
    name: "Pure Damask Rose & Hibiscus",
    category: "Skin Calming & Foot Soaks",
    origin: "Kannauj, India",
    scentNotes: { top: "Fresh Morning Dew", heart: "Velvet Rose Petals", base: "Warm Amber Honey" },
    benefits: ["Soothes skin redness & micro-inflammation", "Deep cell-level hydration", "Natural mood elevation"],
    treatmentsUsed: ["Deluxe Rose Petal Spa Pedicure", "Diamond Radiance Facial"],
    accentColor: "gold",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "argan",
    name: "Cold-Pressed Moroccan Argan & Keratin",
    category: "Hair Bonding & Cuticle Sealing",
    origin: "Agadir, Morocco",
    scentNotes: { top: "Toasted Almond", heart: "Golden Honey Blossom", base: "Rich Cedarwood" },
    benefits: ["Restores damaged lipid protein bonds", "Seals cuticles with diamond gloss", "Thermal heat protection up to 230°C"],
    treatmentsUsed: ["Organic Keratin Infusion", "French Balayage Olaplex Glaze"],
    accentColor: "navy",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "matcha",
    name: "Ceremonial Japanese Green Tea & Hyaluron",
    category: "Ultrasonic Pore Detox",
    origin: "Uji, Kyoto",
    scentNotes: { top: "Crisp Green Bamboo", heart: "Matcha Leaf Steam", base: "White Musk" },
    benefits: ["Ultrasonic deep pore decongestion", "High concentration of antioxidant EGCG", "Instant glass-skin luminosity"],
    treatmentsUsed: ["Deep Cleansing Hydra Glow Facial", "O3+ Anti-Tan Clarifying Cleanup"],
    accentColor: "teal",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "cedar",
    name: "Himalayan Cedarwood & Bergamot",
    category: "Scalp Detox & Men's Barber Steam",
    origin: "Himalayan Foothills",
    scentNotes: { top: "Sunlit Italian Bergamot", heart: "Crushed Pine Needles", base: "Aged Himalayan Cedar" },
    benefits: ["Clears follicular product buildup", "Stimulates micro-circulation for hair density", "Eases cranial muscle tension"],
    treatmentsUsed: ["Royal Hot Towel Shave & Steam", "Deep Scalp Detox Hair Spa"],
    accentColor: "terracotta",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
  },
];

const BotanicalsSection = () => {
  const [activeItem, setActiveItem] = useState(BOTANICALS[0]);

  return (
    <section id="botanicals" className="py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Leaf size={13} /> SENSORY AROMATHERAPY & PURITY
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            ORGANIC BOTANICAL INGREDIENTS
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-xl mx-auto">
            Every facial serum, hair bonding glaze, and spa soak is infused with certified ethically-sourced botanical actives.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DCCE] shadow-soft-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Photo (5 Cols) */}
            <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden border-2 border-[#182A4A] shadow-md bg-[#FAF6EE]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                  src={activeItem.image}
                  alt={activeItem.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#182A4A]/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                Origin: {activeItem.origin}
              </div>
            </div>

            {/* Ingredient Details & Scent Profile (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#C89B3C] uppercase tracking-wider">
                  {activeItem.category}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#182A4A] leading-tight">
                  {activeItem.name}
                </h3>
              </div>

              {/* Scent Pyramid Notes */}
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E6DCCE] space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A8F7F] flex items-center gap-1.5">
                  <Wind size={13} className="text-[#C89B3C]" />
                  Aromatherapy Scent Pyramid:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-[#E6DCCE]">
                    <span className="text-[9px] font-bold text-[#9A8F7F] block uppercase">Top Note</span>
                    <strong className="text-[11px] text-[#182A4A] block mt-0.5">{activeItem.scentNotes.top}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#E6DCCE]">
                    <span className="text-[9px] font-bold text-[#9A8F7F] block uppercase">Heart Note</span>
                    <strong className="text-[11px] text-[#C89B3C] block mt-0.5">{activeItem.scentNotes.heart}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#E6DCCE]">
                    <span className="text-[9px] font-bold text-[#9A8F7F] block uppercase">Base Note</span>
                    <strong className="text-[11px] text-[#182A4A] block mt-0.5">{activeItem.scentNotes.base}</strong>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A8F7F] block">
                  Therapeutic Benefits:
                </span>
                <div className="space-y-1 text-xs font-semibold text-[#182A4A]">
                  {activeItem.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check size={13} className="text-[#6C8E82]" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured in Treatments */}
              <div className="pt-2 border-t border-[#FAF6EE] flex items-center gap-2 text-xs">
                <span className="text-[#9A8F7F] font-bold">Featured in:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeItem.treatmentsUsed.map((t, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg bg-[#FAF6EE] text-[#182A4A] text-[11px] font-bold border border-[#E6DCCE]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8">
          {BOTANICALS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`p-3.5 rounded-2xl border text-left transition ${
                activeItem.id === item.id
                  ? "bg-white border-2 border-[#182A4A] shadow-soft-sm scale-[1.02]"
                  : "bg-white/60 hover:bg-white border-[#E6DCCE]"
              }`}
            >
              <span className="text-[9px] font-extrabold uppercase text-[#C89B3C] block">
                {item.category.split(" &")[0]}
              </span>
              <h5 className="font-heading font-bold text-xs text-[#182A4A] truncate mt-0.5">
                {item.name.split(" &")[0]}
              </h5>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BotanicalsSection;
