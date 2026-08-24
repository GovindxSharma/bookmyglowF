import React from "react";

/**
 * Geometric Abstract Mosaic Banner (from Reference Artboard)
 */
export const GeometricBanner = ({ className = "h-16 w-full", opacity = 0.95 }) => {
  return (
    <div className={`overflow-hidden relative flex items-center select-none ${className}`}>
      <svg
        className="w-full h-full min-w-[900px] object-cover"
        viewBox="0 0 1200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ opacity }}
      >
        {/* Repeating Bauhaus Abstract Tiles */}
        <g transform="translate(0, 0)">
          {/* Tile 1: Navy & Cream Triangle */}
          <rect x="0" y="0" width="120" height="120" fill="#182A4A" />
          <polygon points="0,0 120,0 0,120" fill="#F7F2E7" />
          <circle cx="60" cy="60" r="24" fill="#C89B3C" />

          {/* Tile 2: Gold & Teal Diagonal Striping */}
          <rect x="120" y="0" width="120" height="120" fill="#8EA89D" />
          <path d="M120 0 L240 120 L200 120 L120 40 Z" fill="#C89B3C" />
          <path d="M160 0 L240 80 L240 40 L200 0 Z" fill="#182A4A" />
          <circle cx="150" cy="90" r="16" fill="#F7F2E7" />

          {/* Tile 3: Terracotta Quarter Arches */}
          <rect x="240" y="0" width="120" height="120" fill="#FAF6EE" />
          <path d="M240 0 A 120 120 0 0 1 360 120 L240 120 Z" fill="#C06C52" />
          <path d="M240 40 A 80 80 0 0 1 320 120 L240 120 Z" fill="#182A4A" />
          <circle cx="330" cy="30" r="14" fill="#C89B3C" />

          {/* Tile 4: Midnight Navy & Gold Geometry */}
          <rect x="360" y="0" width="120" height="120" fill="#182A4A" />
          <polygon points="360,60 420,0 480,60 420,120" fill="#C89B3C" />
          <rect x="400" y="40" width="40" height="40" fill="#F7F2E7" />
          <circle cx="420" cy="60" r="10" fill="#8EA89D" />

          {/* Tile 5: Soft Teal & Terracotta Split */}
          <rect x="480" y="0" width="120" height="120" fill="#8EA89D" />
          <polygon points="480,120 600,0 600,120" fill="#C06C52" />
          <line x1="480" y1="20" x2="600" y2="20" stroke="#182A4A" strokeWidth="4" />
          <line x1="480" y1="40" x2="600" y2="40" stroke="#182A4A" strokeWidth="4" />
          <circle cx="540" cy="80" r="18" fill="#FAF6EE" />

          {/* Tile 6: Fine Lines & Gold Quadrants */}
          <rect x="600" y="0" width="120" height="120" fill="#FAF6EE" />
          <path d="M600 120 A 120 120 0 0 1 720 0 L720 120 Z" fill="#182A4A" />
          <path d="M640 120 A 80 80 0 0 1 720 40 L720 120 Z" fill="#C89B3C" />
          <line x1="610" y1="10" x2="650" y2="50" stroke="#C06C52" strokeWidth="3" />

          {/* Tile 7: Terracotta & Navy Bauhaus Diagonal */}
          <rect x="720" y="0" width="120" height="120" fill="#C06C52" />
          <polygon points="720,0 840,120 720,120" fill="#182A4A" />
          <circle cx="780" cy="60" r="28" fill="#F7F2E7" />
          <circle cx="780" cy="60" r="14" fill="#8EA89D" />

          {/* Tile 8: Gold Modernist Arch */}
          <rect x="840" y="0" width="120" height="120" fill="#C89B3C" />
          <path d="M840 0 A 120 120 0 0 1 960 120 L840 120 Z" fill="#F7F2E7" />
          <line x1="860" y1="120" x2="860" y2="40" stroke="#182A4A" strokeWidth="4" />
          <line x1="880" y1="120" x2="880" y2="30" stroke="#182A4A" strokeWidth="4" />
          <line x1="900" y1="120" x2="900" y2="40" stroke="#182A4A" strokeWidth="4" />
          <circle cx="930" cy="30" r="12" fill="#C06C52" />

          {/* Tile 9: Navy Minimalist Stripe */}
          <rect x="960" y="0" width="120" height="120" fill="#182A4A" />
          <polygon points="960,60 1020,0 1080,60 1020,120" fill="#8EA89D" />
          <circle cx="1020" cy="60" r="16" fill="#C89B3C" />

          {/* Tile 10: Final Repeat */}
          <rect x="1080" y="0" width="120" height="120" fill="#FAF6EE" />
          <polygon points="1080,0 1200,0 1080,120" fill="#C06C52" />
          <circle cx="1140" cy="60" r="22" fill="#182A4A" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Geometric Hero Background Shapes (From Reference Left Hero Card)
 */
export const GeometricHeroBackdrop = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Top-Right Navy Modernist Arch */}
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#182A4A]/5 border-[16px] border-[#182A4A]/10 blur-[1px]" />

      {/* Gold Radiant Orb */}
      <div className="absolute top-20 right-1/4 w-44 h-44 rounded-full bg-[#C89B3C]/15 blur-2xl" />

      {/* Soft Teal Organic Crescent */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#8EA89D]/20 blur-3xl" />

      {/* Terracotta Angular Shape */}
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#C06C52]/10 rounded-3xl rotate-12 blur-2xl" />

      {/* Modern Hairline Geometric Coordinate Lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E6DCCE] to-transparent" />
      <div className="absolute inset-y-0 left-12 w-px bg-[#E6DCCE]/40 hidden lg:block" />
      <div className="absolute inset-y-0 right-12 w-px bg-[#E6DCCE]/40 hidden lg:block" />
    </div>
  );
};

/**
 * Geometric Icon Badges (From Reference Services Section)
 */
export const GeometricServiceIcon = ({ type = "hair", color = "navy" }) => {
  const colorSchemes = {
    navy: {
      bg: "bg-[#182A4A]",
      shapeBg: "bg-[#EAE4D8]",
      text: "text-white",
      border: "border-[#182A4A]",
    },
    gold: {
      bg: "bg-[#C89B3C]",
      shapeBg: "bg-[#FAF2DE]",
      text: "text-white",
      border: "border-[#C89B3C]",
    },
    teal: {
      bg: "bg-[#8EA89D]",
      shapeBg: "bg-[#E6EFEA]",
      text: "text-[#182A4A]",
      border: "border-[#8EA89D]",
    },
    terracotta: {
      bg: "bg-[#C06C52]",
      shapeBg: "bg-[#F7ECE8]",
      text: "text-white",
      border: "border-[#C06C52]",
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.navy;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Background Geometric Backdrop (Circle + Offset Square) */}
      <div
        className={`absolute inset-0 rounded-2xl ${scheme.shapeBg} transform rotate-6 border border-[#E6DCCE]`}
      />
      <div
        className={`relative z-10 w-12 h-12 rounded-xl ${scheme.bg} ${scheme.text} flex items-center justify-center shadow-xs border border-black/10`}
      >
        {type === "hair" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
        )}
        {type === "skin" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        )}
        {type === "spa" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10c0 4-2 7-6 9l-4-3-4 3c-4-2-6-5-6-9a10 10 0 0 1 10-10z" />
            <path d="M12 7v10" />
            <path d="M8 11c2 2 6 2 8 0" />
          </svg>
        )}
        {type === "nails" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="7" y="2" width="10" height="20" rx="4" />
            <line x1="7" y1="9" x2="17" y2="9" />
            <line x1="7" y1="15" x2="17" y2="15" />
          </svg>
        )}
        {type === "bridal" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )}
        {type === "grooming" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        )}
      </div>
    </div>
  );
};
