import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calculator, Check, ArrowRight, Tag, Heart, Calendar } from "lucide-react";

const ESTIMATOR_SERVICES = [
  { id: "cut", category: "Hair", name: "Precision Haircut & Styling", price: 450 },
  { id: "spa", category: "Hair", name: "Deep Botanical Hair Spa", price: 950 },
  { id: "color", category: "Hair", name: "French Balayage & Olaplex Glaze", price: 2500 },
  { id: "keratin", category: "Hair", name: "Organic Keratin Smoothing", price: 3500 },
  
  { id: "hydra", category: "Skin", name: "Hydra Glow Ultrasonic Facial", price: 1800 },
  { id: "diamond", category: "Skin", name: "Diamond Radiance Brightening", price: 1400 },
  { id: "detan", category: "Skin", name: "O3+ Anti-Tan Clarifying Cleanup", price: 850 },
  
  { id: "pedi", category: "Hands & Feet", name: "Deluxe Rose Spa Pedicure", price: 650 },
  { id: "mani", category: "Hands & Feet", name: "Nourishing Manicure & Massage", price: 450 },
  { id: "nails", category: "Hands & Feet", name: "Gel Polish & Custom Nail Art", price: 750 },
  
  { id: "massage", category: "Wellness", name: "Full Body Aromatherapy Massage", price: 2200 },
  { id: "beard", category: "Grooming", name: "Royal Beard Sculpt & Hot Towel Shave", price: 350 },
];

const PackageEstimator = () => {
  const [selectedItems, setSelectedItems] = useState(["cut", "hydra"]);

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedObjects = ESTIMATOR_SERVICES.filter((s) =>
    selectedItems.includes(s.id)
  );

  const rawTotal = selectedObjects.reduce((sum, s) => sum + s.price, 0);

  // Bundle Discount: 15% off if 2 or more services selected
  const hasBundleDiscount = selectedObjects.length >= 2;
  const discountAmount = hasBundleDiscount ? Math.round(rawTotal * 0.15) : 0;
  const finalPrice = rawTotal - discountAmount;

  return (
    <section id="packages" className="py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Calculator size={13} /> CUSTOM COMBO BUILDER
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            BUILD YOUR SELF-CARE BUNDLE
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-xl mx-auto">
            Select 2 or more studio services to instantly unlock our guaranteed <strong>15% Combo Savings</strong>.
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Services Grid (Left 7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ESTIMATOR_SERVICES.map((s) => {
              const isChecked = selectedItems.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => toggleItem(s.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-center justify-between border ${
                    isChecked
                      ? "bg-white border-2 border-[#182A4A] shadow-soft-md scale-[1.02]"
                      : "bg-white/70 hover:bg-white border-[#E6DCCE]"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#C89B3C]">
                      {s.category}
                    </span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-[#182A4A] leading-snug">
                      {s.name}
                    </h4>
                    <span className="text-xs font-extrabold text-[#182A4A]">
                      ₹{s.price}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isChecked
                        ? "bg-[#182A4A] text-white"
                        : "bg-[#FAF6EE] text-gray-300 border border-[#E6DCCE]"
                    }`}
                  >
                    <Check size={14} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Savings Summary (Right 5 Cols - Sticky Card) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-[#182A4A] shadow-2xl space-y-6">
              <div className="border-b border-[#FAF6EE] pb-4 flex items-center justify-between">
                <h3 className="font-display text-base sm:text-lg font-extrabold uppercase tracking-wider text-[#182A4A]">
                  PACKAGE SUMMARY
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-[#FAF6EE] text-[11px] font-extrabold text-[#C89B3C] border border-[#E6DCCE]">
                  {selectedObjects.length} Services Selected
                </span>
              </div>

              {/* Selected List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedObjects.length === 0 ? (
                  <p className="text-xs text-[#5C6D88] py-4 text-center">
                    Select treatments from the list to preview bundle pricing.
                  </p>
                ) : (
                  selectedObjects.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#FAF6EE]"
                    >
                      <span className="text-[#182A4A] font-semibold">{item.name}</span>
                      <span className="font-bold text-[#182A4A]">₹{item.price}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Calculations */}
              <div className="space-y-2.5 pt-4 border-t border-[#FAF6EE]">
                <div className="flex items-center justify-between text-xs text-[#5C6D88]">
                  <span>Subtotal:</span>
                  <span>₹{rawTotal}</span>
                </div>

                {hasBundleDiscount && (
                  <div className="flex items-center justify-between text-xs font-bold text-[#6C8E82]">
                    <span className="flex items-center gap-1">
                      <Tag size={13} /> 15% Combo Discount:
                    </span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex items-baseline justify-between pt-3 border-t border-[#182A4A]/10">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9A8F7F] block">
                      Estimated Total:
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#182A4A]">
                      ₹{finalPrice}
                    </span>
                  </div>
                  {hasBundleDiscount && (
                    <span className="text-xs font-extrabold text-[#C89B3C] bg-[#FAF2DE] px-2.5 py-1 rounded-md">
                      You Save ₹{discountAmount}!
                    </span>
                  )}
                </div>
              </div>

              {/* Action CTA */}
              <div>
                <a
                  href="#book"
                  className="btn-navy-primary w-full py-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-navy-glow bg-[#182A4A] text-white"
                >
                  <Calendar size={14} />
                  <span>BOOK THIS CUSTOM PACKAGE</span>
                </a>
                <span className="text-[10px] text-[#5C6D88] text-center block mt-2 font-medium">
                  Includes personalized stylist consultation upon arrival
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageEstimator;
