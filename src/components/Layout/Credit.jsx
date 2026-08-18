import React from "react";
import { SALON_CONFIG } from "@/data/data";

const Credit = () => {
  return (
    <div className="py-6 bg-[#EFE9E2] border-t border-[#E2DAD0] text-center text-xs text-[#68706B] space-y-1">
      <p>
        &copy; {new Date().getFullYear()} {SALON_CONFIG.name}. All rights reserved.
      </p>

      <p className="text-[11px] text-[#7D8480]">
        Engineered & Crafted with care by{" "}
        <a
          href="https://govind-sharma.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#35473C] hover:text-[#4E6758] hover:underline transition"
        >
          Govind Sharma
        </a>
      </p>
    </div>
  );
};

export default Credit;
