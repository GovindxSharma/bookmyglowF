import React from "react";
import { SALON_CONFIG } from "@/data/data";

const Credit = () => {
  return (
    <div className="py-6 bg-[#FAF2DE]/70 border-t border-[#E6DCCE] text-center text-xs text-[#5C6D88] space-y-1">
      <p className="font-medium text-[#182A4A]">
        &copy; {new Date().getFullYear()} {SALON_CONFIG.name} — Geometric Grace. All rights reserved.
      </p>

      <p className="text-[11px] text-[#7A6E5D]">
        Designed with Bauhaus Minimalist Aesthetics &bull; Crafted by{" "}
        <a
          href="https://govind-sharma.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#182A4A] hover:text-[#C89B3C] hover:underline transition"
        >
          Govind Sharma
        </a>
      </p>
    </div>
  );
};

export default Credit;

