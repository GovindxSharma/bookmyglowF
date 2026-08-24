import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Award, Scissors, ArrowRight, Calendar, X, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { GeometricEmblem } from "@/components/Common/GeometricLogo";

const STYLISTS = [
  {
    id: "rahul",
    name: "Rahul Sharma",
    gender: "male",
    role: "Master Hair Artistry & Colorist",
    exp: "8+ Years Studio Experience",
    rating: "4.96",
    reviews: "340+",
    accentColor: "navy",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
    bio: "Certified by Vidal Sassoon London. Specializes in dimensional balayage, French root melting, precision scissor shaping, and structural hair wellness.",
    certifications: ["Vidal Sassoon Master Colorist", "Olaplex Certified Educator", "L'Oréal Professionnel Paris"],
    signatureTreatments: [
      { name: "French Balayage & Olaplex Glaze", price: "₹2,500", time: "120 min" },
      { name: "Signature Haircut & Blowdry Styling", price: "₹450", time: "45 min" },
      { name: "Organic Keratin Protein Infusion", price: "₹3,500", time: "90 min" },
    ],
    lookbook: [
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80",
    ],
    specialties: ["French Balayage", "Layered Scissor Cuts", "Organic Keratin"],
  },
  {
    id: "pooja",
    name: "Pooja Patel",
    gender: "female",
    role: "Lead Aesthetician & Skincare Master",
    exp: "6+ Years Studio Experience",
    rating: "4.98",
    reviews: "290+",
    accentColor: "gold",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
    bio: "CIDESCO Zurich Certified aesthetician. Expert in ultrasonic pore extractions, Hydra Dermabrasion, cold cryo infusions, and holistic glass-skin rituals.",
    certifications: ["CIDESCO Diploma in Aesthetics", "HydraFacial MD Certified", "O3+ Skincare Specialist"],
    signatureTreatments: [
      { name: "Deep Cleansing Hydra Glow Facial", price: "₹1,800", time: "60 min" },
      { name: "Diamond Radiance Brightening Facial", price: "₹1,400", time: "50 min" },
      { name: "O3+ Anti-Tan & Skin Clarifying Cleanup", price: "₹850", time: "45 min" },
    ],
    lookbook: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512290900672-1f4864fefb36?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80",
    ],
    specialties: ["Hydra Glow Facials", "O3+ Anti-Tan Therapy", "Ultrasonic Peel"],
  },
  {
    id: "komal",
    name: "Komal Jadeja",
    gender: "female",
    role: "Master Bridal Makeup & Glamour Artist",
    exp: "7+ Years Studio Experience",
    rating: "4.99",
    reviews: "210+",
    accentColor: "gold",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
    bio: "International Makeup Academy graduate. Known for long-wearing HD airbrush makeup, soft smokey eye transitions, and couture Indian bridal draping.",
    certifications: ["IMA International Bridal Artistry", "Temptu HD Airbrush Pro", "Certified Saree Draper"],
    signatureTreatments: [
      { name: "Complete Ultra-HD Bridal Makeover", price: "₹8,500", time: "180 min" },
      { name: "Engagement & Sangeet Cocktail Glam", price: "₹3,200", time: "90 min" },
      { name: "Party Glamour & Floral Hair Updo", price: "₹2,200", time: "75 min" },
    ],
    lookbook: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80",
    ],
    specialties: ["HD Bridal Artistry", "Couture Saree Draping", "Cocktail Glam"],
  },
  {
    id: "amit",
    name: "Amit Varma",
    gender: "male",
    role: "Master Barber & Men's Grooming",
    exp: "5+ Years Studio Experience",
    rating: "4.94",
    reviews: "230+",
    accentColor: "terracotta",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=700&q=80",
    bio: "Master of classic hot towel straight-razor shaves, modern architectural fades, beard sculpting, and restorative tea tree scalp massages.",
    certifications: ["Truefitt & Hill Master Barbering", "Wahl Professional Educator"],
    signatureTreatments: [
      { name: "Royal Hot Towel Shave & Steam", price: "₹400", time: "30 min" },
      { name: "Precision Taper Fade & Beard Sculpt", price: "₹650", time: "45 min" },
      { name: "Deep Scalp Detox & Hair Spa", price: "₹850", time: "45 min" },
    ],
    lookbook: [
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.1.0&auto=format&fit=crop&w=600&q=80",
    ],
    specialties: ["Royal Hot Towel Shave", "Beard Sculpting", "Scalp Detox"],
  },
];

const StylistsSection = () => {
  const [selectedStylist, setSelectedStylist] = useState(null);

  const handleBookWithArtist = (stylistName) => {
    setSelectedStylist(null);
    const bookEl = document.getElementById("book");
    if (bookEl) bookEl.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="stylists" className="py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Scissors size={13} /> MASTER PRACTITIONERS & ARTISTS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            MEET OUR ARTISTS & STYLISTS
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-xl mx-auto">
            Experienced, passionate specialists dedicated to bespoke precision and restorative self-care. Click any specialist to view their Lookbook & Credentials.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {STYLISTS.map((stylist) => (
            <motion.div
              key={stylist.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedStylist(stylist)}
              className="bg-white rounded-3xl overflow-hidden border border-[#E6DCCE] shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Photo with Rating (Full portrait visibility on mobile) */}
                <div className="relative aspect-[4/5] sm:aspect-auto sm:h-64 overflow-hidden bg-[#FAF6EE]">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-extrabold text-[#182A4A] shadow-xs flex items-center gap-1 border border-[#E6DCCE]">
                    <Star size={11} className="fill-[#C89B3C] text-[#C89B3C]" />
                    <span>{stylist.rating}</span>
                    <span className="text-[#8EA89D] font-normal">({stylist.reviews})</span>
                  </div>

                  {/* Lookbook Badge */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-[#182A4A]/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                    <Sparkles size={10} className="text-[#C89B3C]" /> View Lookbook
                  </div>

                  {/* Geometric Color Accent Bar */}
                  <div
                    className={`absolute bottom-0 inset-x-0 h-1.5 ${
                      stylist.accentColor === "gold"
                        ? "bg-[#C89B3C]"
                        : stylist.accentColor === "terracotta"
                        ? "bg-[#C06C52]"
                        : "bg-[#182A4A]"
                    }`}
                  />
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#182A4A] group-hover:text-[#C89B3C] transition">
                      {stylist.name}
                    </h3>
                    <p className="text-xs font-bold text-[#C89B3C] mt-0.5">
                      {stylist.role}
                    </p>
                    <span className="text-[11px] text-[#5C6D88] font-medium block mt-0.5">
                      {stylist.exp}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-[#FAF6EE] space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-[#9A8F7F] tracking-wider block">
                      Specialties:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {stylist.specialties.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#FAF6EE] text-[#182A4A] text-[10px] font-semibold border border-[#E6DCCE]"
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStylist(stylist);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#FAF6EE] hover:bg-[#182A4A] text-[#182A4A] hover:text-white font-bold text-xs uppercase tracking-wider transition duration-200 flex items-center justify-center gap-1.5 border border-[#E6DCCE]"
                >
                  <Sparkles size={13} className="text-[#C89B3C]" />
                  <span>View Lookbook & Bio</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🌟 Interactive Stylist Lookbook & Profile Modal */}
      <AnimatePresence>
        {selectedStylist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#182A4A]/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border-2 border-[#182A4A] rounded-[32px] sm:rounded-[36px] shadow-2xl w-full max-w-2xl overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-[#FAF6EE] border-b border-[#E6DCCE] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-white border border-[#E6DCCE] shadow-soft-sm">
                    <GeometricEmblem size={28} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C89B3C]">
                      SPECIALIST LOOKBOOK & CREDENTIALS
                    </span>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-[#182A4A] leading-tight">
                      {selectedStylist.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStylist(null)}
                  className="p-2 rounded-xl text-[#182A4A] hover:bg-white border border-[#E6DCCE] transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
                {/* Top Profile Card */}
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start p-4 rounded-3xl bg-[#FAF6EE] border border-[#E6DCCE]">
                  <img
                    src={selectedStylist.image}
                    alt={selectedStylist.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-[#182A4A] shadow-md flex-shrink-0"
                  />
                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-heading font-extrabold text-lg text-[#182A4A]">
                        {selectedStylist.name}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E6EFEA] text-[#6C8E82] font-bold text-xs flex items-center gap-1">
                        ★ {selectedStylist.rating} ({selectedStylist.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#C89B3C]">{selectedStylist.role}</p>
                    <p className="text-xs text-[#5C6D88] leading-relaxed pt-1">
                      "{selectedStylist.bio}"
                    </p>
                  </div>
                </div>

                {/* Certified Credentials */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A8F7F] flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#6C8E82]" />
                    Accreditations & Certifications:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedStylist.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-white border border-[#E6DCCE] text-xs font-bold text-[#182A4A] shadow-2xs"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Signature Treatments & Pricing */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A8F7F] block">
                    Signature Treatment Menu:
                  </span>
                  <div className="space-y-2">
                    {selectedStylist.signatureTreatments.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white border border-[#E6DCCE] flex items-center justify-between hover:border-[#182A4A] transition"
                      >
                        <div>
                          <h5 className="font-heading font-bold text-xs text-[#182A4A]">{item.name}</h5>
                          <span className="text-[10px] text-[#8EA89D]">⏱ {item.time}</span>
                        </div>
                        <span className="font-extrabold text-xs text-[#C89B3C]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lookbook Photo Gallery */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A8F7F] block">
                    Recent Lookbook Transformations:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedStylist.lookbook.map((img, i) => (
                      <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#182A4A] shadow-sm">
                        <img src={img} alt="Lookbook" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 sm:p-6 bg-[#FAF6EE] border-t border-[#E6DCCE] flex gap-3">
                <button
                  onClick={() => handleBookWithArtist(selectedStylist.name)}
                  className="btn-navy-primary flex-1 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-navy-glow uppercase tracking-wider"
                >
                  <Calendar size={15} />
                  <span>Book Appointment with {selectedStylist.name.split(" ")[0]}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StylistsSection;
