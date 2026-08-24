import React from "react";

export const GeometricEmblem = ({ size = 48, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Decorative Gold Arc / Sun */}
      <circle
        cx="72"
        cy="28"
        r="14"
        stroke="#C89B3C"
        strokeWidth="3.5"
        fill="#FAF6EE"
      />

      {/* Terracotta Decorative Small Square */}
      <rect
        x="68"
        cy="58"
        width="10"
        height="10"
        fill="#C06C52"
        opacity="0.9"
      />

      {/* Architectural Pillars / Buildings (Midnight Navy Line Art) */}
      {/* Tallest Center-Left Pillar */}
      <rect
        x="36"
        y="18"
        width="16"
        height="70"
        stroke="#182A4A"
        strokeWidth="3.5"
        fill="#FFFFFF"
        rx="2"
      />
      <line x1="36" y1="42" x2="52" y2="42" stroke="#182A4A" strokeWidth="2.5" />
      <line x1="36" y1="64" x2="52" y2="64" stroke="#182A4A" strokeWidth="2.5" />

      {/* Shorter Left Pillar */}
      <rect
        x="22"
        y="42"
        width="14"
        height="46"
        stroke="#182A4A"
        strokeWidth="3.5"
        fill="#FAF6EE"
        rx="2"
      />
      <line x1="22" y1="62" x2="36" y2="62" stroke="#182A4A" strokeWidth="2.5" />

      {/* Botanical Leaf (Organic Capsule in Soft Teal / Sage) */}
      <g transform="translate(54, 32)">
        {/* Leaf Outline */}
        <path
          d="M16 2 C28 14, 28 36, 16 52 C4 36, 4 14, 16 2 Z"
          fill="#8EA89D"
          stroke="#182A4A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Leaf Veins */}
        <line x1="16" y1="6" x2="16" y2="48" stroke="#182A4A" strokeWidth="2.5" />
        <line x1="16" y1="18" x2="23" y2="12" stroke="#182A4A" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="26" x2="9" y2="20" stroke="#182A4A" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="34" x2="23" y2="28" stroke="#182A4A" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="40" x2="10" y2="35" stroke="#182A4A" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Ground Horizon Line */}
      <line x1="12" y1="88" x2="88" y2="88" stroke="#182A4A" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
};

const GeometricLogo = ({
  variant = "horizontal",
  size = "md",
  theme = "light",
  showSubtitle = true,
  className = "",
}) => {
  const isLight = theme === "light";
  const emblemSizes = {
    sm: 32,
    md: 42,
    lg: 64,
    hero: 120,
  };

  const emblemSize = emblemSizes[size] || 42;

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <GeometricEmblem size={emblemSize} />
        <div className="mt-3">
          <span
            className={`font-display text-xl sm:text-2xl font-extrabold tracking-[0.18em] uppercase leading-none block ${
              isLight ? "text-[#182A4A]" : "text-white"
            }`}
          >
            Urban Oasis
          </span>
          <span
            className={`font-heading text-xs sm:text-sm font-bold tracking-[0.35em] uppercase leading-relaxed block mt-1 ${
              isLight ? "text-[#C89B3C]" : "text-[#E0BA66]"
            }`}
          >
            STUDIO
          </span>
          {showSubtitle && (
            <span
              className={`text-[10px] tracking-[0.2em] uppercase block mt-1 font-medium ${
                isLight ? "text-[#8EA89D]" : "text-[#A7BFB5]"
              }`}
            >
              Geometric Grace
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default horizontal variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0">
        <GeometricEmblem size={emblemSize} />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-display text-sm sm:text-base font-extrabold tracking-[0.15em] uppercase leading-tight ${
            isLight ? "text-[#182A4A]" : "text-white"
          }`}
        >
          Urban Oasis
        </span>
        <div className="flex items-center gap-1.5 leading-none mt-0.5">
          <span
            className={`font-heading text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase ${
              isLight ? "text-[#C89B3C]" : "text-[#E0BA66]"
            }`}
          >
            STUDIO
          </span>
          {showSubtitle && (
            <>
              <span className="text-gray-300 text-[10px]">•</span>
              <span
                className={`text-[9px] tracking-wider uppercase font-semibold hidden sm:inline ${
                  isLight ? "text-[#8EA89D]" : "text-[#A7BFB5]"
                }`}
              >
                Salon & Spa
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeometricLogo;
