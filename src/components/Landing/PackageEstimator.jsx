import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calculator, Check, ArrowRight, Tag, Heart } from "lucide-react";

const ESTIMATOR_SERVICES = [
  { id: "cut", category: "Hair", name: "Haircut & Blowdry", price: 450 },
  { id: "spa", category: "Hair", name: "Deep Nourishing Hair Spa", price: 950 },
  { id: "color", category: "Hair", name: "Global Hair Color / Highlights", price: 2500 },
  { id: "keratin", category: "Hair", name: "Keratin Smooth Treatment", price: 3500 },
  
  { id: "hydra", category: "Skin", name: "Deep Cleansing Hydra Glow Facial", price: 1800 },
  { id: "diamond", category: "Skin", name: "Diamond Radiance Brightening Facial", price: 1400 },
  { id: "detan", category: "Skin", name: "O3+ Anti-Tan Clarifying Cleanup", price: 850 },
  
  { id: "pedi", category: "Hands & Feet", name: "Deluxe Rose Spa Pedicure", price: 650 },
  { id: "mani", category: "Hands & Feet", name: "Nourishing Manicure with Massage", price: 450 },
  { id: "nails", category: "Hands & Feet", name: "Gel Polish & Nail Art", price: 750 },
  
  { id: "massage", category: "Wellness", name: "Full Body Aromatherapy Massage", price: 2200 },
  { id: "beard", category: "Grooming", name: "Royal Beard Trim & Hot Towel Shave", price: 350 },
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
    <section id="packages" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#FDFBF9] text-[#242A26] relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Calculator size={14} className="text-[#4E6758]" /> Custom Bundle Builder
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F2421]">
            Build Your Self-Care Package
          </h2>
          <p className="text-[#68706B] text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Select 2 or more services to unlock our automatic <strong>15% Combo Savings</strong>.
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Services Selector Column */}
          <div className="lg:col-span-8 space-y-5">
            {["Hair", "Skin", "Hands & Feet", "Wellness", "Grooming"].map((cat) => {
              const catServices = ESTIMATOR_SERVICES.filter((s) => s.category === cat);
              if (catServices.length === 0) return null;

              return (
                <div key={cat} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE3D9] shadow-soft-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#35473C] mb-3">
                    {cat} Care
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {catServices.map((srv) => {
                      const isSelected = selectedItems.includes(srv.id);
                      return (
                        <div
                          key={srv.id}
                          onClick={() => toggleItem(srv.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                            isSelected
                              ? "bg-[#EDF3EF] border-[#4E6758] shadow-xs"
                              : "bg-[#FDFBF9] border-[#EAE3D9] hover:bg-[#F8F5F0]"
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-xs text-[#1F2421] block">
                              {srv.name}
                            </span>
                            <span className="text-[11px] font-bold text-[#4E6758]">
                              ₹{srv.price}
                            </span>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-[#4E6758] border-[#4E6758] text-white"
                                : "border-[#C5BCB0]"
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Estimate Card */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-soft-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3">
                <h3 className="font-heading text-lg font-bold text-[#1F2421]">
                  Package Summary
                </h3>
                <span className="text-xs font-semibold text-[#4E6758] bg-[#EDF3EF] px-2.5 py-1 rounded-full">
                  {selectedObjects.length} Selected
                </span>
              </div>

              {selectedObjects.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                  Click on any service on the left to start building your customized salon bundle.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedObjects.map((s) => (
                    <div key={s.id} className="flex justify-between text-xs text-[#555E58]">
                      <span>{s.name}</span>
                      <span className="font-semibold text-[#1F2421]">₹{s.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Calculation */}
              <div className="pt-3 border-t border-[#F2ECE4] space-y-2">
                <div className="flex justify-between text-xs text-[#68706B]">
                  <span>Regular Total:</span>
                  <span>₹{rawTotal.toLocaleString()}</span>
                </div>

                {hasBundleDiscount && (
                  <div className="flex justify-between text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <Tag size={13} /> 15% Combo Savings:
                    </span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-[#EAE3D9]">
                  <span className="text-xs font-bold uppercase text-[#35473C]">Bundle Price:</span>
                  <span className="font-heading text-2xl font-bold text-[#1F2421]">
                    ₹{finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <a
                href="#book"
                className="w-full py-3.5 rounded-2xl bg-[#4E6758] hover:bg-[#405448] text-white font-semibold text-xs transition duration-200 flex items-center justify-center gap-2 shadow-soft-sm text-center"
              >
                <span>Book This Package (₹{finalPrice.toLocaleString()})</span>
                <ArrowRight size={14} />
              </a>

              <p className="text-[11px] text-[#7D8480] text-center">
                ✨ Free consultation & complimentary beverage included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageEstimator;
