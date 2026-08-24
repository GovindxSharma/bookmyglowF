import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Star, User, Calendar, MoveHorizontal, Split } from "lucide-react";

const TRANSFORMATIONS = [
  {
    id: "balayage",
    title: "French Balayage & Olaplex Glaze",
    category: "Hair Color & Styling",
    client: "Priya M.",
    timeTaken: "2.5 Hours",
    stylist: "Rahul Sharma (Senior Colorist)",
    description: "Transformed dull, uneven color into seamless warm caramel balayage ribbons with ultra-shine Olaplex gloss glaze.",
    beforeImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    servicesUsed: ["Dimensional Balayage", "Olaplex Bonding", "Face Framing Cut"],
  },
  {
    id: "hydra",
    title: "Hydra Glow Ultrasonic Facial",
    category: "Skin Care",
    client: "Ananya R.",
    timeTaken: "60 Mins",
    stylist: "Pooja Patel (Skin Specialist)",
    description: "Deep ultrasonic pore extraction, botanical hydration infusion, and soothing cryo-globe cooling for glass-skin radiance.",
    beforeImg: "https://images.unsplash.com/photo-1512290900672-1f4864fefb36?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    servicesUsed: ["Hydra Micro-Derm", "Hyaluronic Infusion", "Cold Cryo Mask"],
  },
  {
    id: "grooming",
    title: "Men's Precision Cut & Beard Sculpt",
    category: "Men's Barber",
    client: "Vikram S.",
    timeTaken: "45 Mins",
    stylist: "Amit Varma (Master Barber)",
    description: "Tamed overgrown hair and patchy beard into a sharp modern fade, crisp razor line-up, and hot towel facial steam.",
    beforeImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    servicesUsed: ["Precision Taper Fade", "Hot Towel Shave", "Beard Sculpting"],
  },
  {
    id: "bridal",
    title: "Ultra-HD Bridal Artistry & Hair Updo",
    category: "Bridal Glamour",
    client: "Rhea K.",
    timeTaken: "2 Hours",
    stylist: "Komal Jadeja (Bridal Artist)",
    description: "Complete bridal makeover with long-wearing HD airbrush makeup, soft smokey eye, custom lashes, and couture floral hair updo.",
    beforeImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
    servicesUsed: ["Ultra HD Airbrush Base", "Custom Mink Lashes", "Bridal Floral Updo"],
  },
];

const TransformationsSection = () => {
  const [activeItem, setActiveItem] = useState(TRANSFORMATIONS[0]);
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 to 100)
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleSliderMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      handleSliderMove(e.clientX);
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    handleSliderMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <section id="transformations" className="py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Sparkles size={13} /> CLIENT PORTFOLIO & CASE STUDIES
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            CLIENT TRANSFORMATIONS
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-xl mx-auto">
            Drag the interactive slider below to reveal the real before and after transformations crafted by our specialists.
          </p>
        </div>

        {/* Transformation Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DCCE] shadow-soft-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Column (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C89B3C]">
                  {activeItem.category}
                </span>

                {/* Quick Presets / Split Toggle */}
                <div className="flex items-center gap-1.5 p-1 bg-[#FAF6EE] rounded-xl border border-[#E6DCCE]">
                  <button
                    onClick={() => setSliderPos(100)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      sliderPos >= 90
                        ? "bg-[#182A4A] text-white"
                        : "text-[#5C6D88] hover:text-[#182A4A]"
                    }`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => setSliderPos(50)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                      sliderPos > 20 && sliderPos < 80
                        ? "bg-[#C89B3C] text-white"
                        : "text-[#5C6D88] hover:text-[#182A4A]"
                    }`}
                  >
                    <Split size={12} />
                    <span>Split 50%</span>
                  </button>
                  <button
                    onClick={() => setSliderPos(0)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      sliderPos <= 10
                        ? "bg-[#182A4A] text-white"
                        : "text-[#5C6D88] hover:text-[#182A4A]"
                    }`}
                  >
                    After ✨
                  </button>
                </div>
              </div>

              {/* 🪞 Interactive Touch & Drag Before/After Split Container */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchMove}
                className="relative aspect-[4/3] sm:aspect-[16/10] md:h-[420px] w-full rounded-2xl overflow-hidden border-2 border-[#182A4A] shadow-md bg-[#182A4A] select-none cursor-ew-resize group"
              >
                {/* 1. Base Layer: AFTER Image (Full View) */}
                <img
                  src={activeItem.afterImg}
                  alt={`After: ${activeItem.title}`}
                  className="absolute inset-0 w-full h-full object-cover object-top sm:object-center pointer-events-none"
                />

                {/* 2. Top Layer: BEFORE Image (Clipped via clipPath) */}
                <div
                  style={{
                    clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`,
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-none"
                >
                  <img
                    src={activeItem.beforeImg}
                    alt={`Before: ${activeItem.title}`}
                    className="absolute inset-0 w-full h-full object-cover object-top sm:object-center"
                  />
                </div>

                {/* 3. Floating Divider Line & Gold Handle */}
                <div
                  style={{ left: `${sliderPos}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none transition-none -translate-x-1/2 flex items-center justify-center z-20"
                >
                  <div className="w-9 h-9 rounded-full bg-[#182A4A] border-2 border-[#C89B3C] text-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110">
                    <MoveHorizontal size={16} className="text-[#C89B3C]" />
                  </div>
                </div>

                {/* Badges Over Image */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#182A4A]/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md z-10">
                  Before Initial State
                </div>

                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#C89B3C]/95 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md z-10">
                  After Result ✨
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 text-[#182A4A] text-xs font-bold border border-[#E6DCCE] shadow-sm z-10">
                  ⏱ {activeItem.timeTaken}
                </div>

                {/* Touch hint overlay for mobile */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white/90 text-[10px] font-medium backdrop-blur-xs flex items-center gap-1 sm:hidden">
                  <span>‹ Drag slider ›</span>
                </div>
              </div>
            </div>

            {/* Details Column (Right 5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#C89B3C] uppercase tracking-wider">
                  Client Case Study
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-[#182A4A] leading-tight">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-[#5C6D88] pt-1 leading-relaxed">
                  "{activeItem.description}"
                </p>
              </div>

              {/* Stylist & Client Info */}
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E6DCCE] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9A8F7F] font-bold">Client:</span>
                  <span className="font-bold text-[#182A4A]">{activeItem.client} (Verified)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9A8F7F] font-bold">Stylist:</span>
                  <span className="font-bold text-[#C89B3C]">{activeItem.stylist}</span>
                </div>
              </div>

              {/* Treatments Used */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-[#9A8F7F] tracking-wider block">
                  Treatments Performed:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeItem.servicesUsed.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF6EE] text-[#182A4A] text-xs font-semibold border border-[#E6DCCE]"
                    >
                      ✓ {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Book CTA */}
              <div className="pt-2">
                <a
                  href="#book"
                  className="btn-navy-primary w-full py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-navy-glow"
                >
                  <Calendar size={14} />
                  <span>Book Similar Transformation</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {TRANSFORMATIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                setSliderPos(50);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                activeItem.id === item.id
                  ? "bg-white border-2 border-[#182A4A] shadow-soft-md scale-[1.02]"
                  : "bg-white/60 hover:bg-white border-[#E6DCCE]"
              }`}
            >
              <span className="text-[9px] font-extrabold uppercase text-[#C89B3C] block">
                {item.category}
              </span>
              <h5 className="font-heading font-bold text-xs text-[#182A4A] line-clamp-1 mt-0.5">
                {item.title}
              </h5>
              <span className="text-[10px] text-[#5C6D88] block mt-1">
                Client: {item.client}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransformationsSection;
