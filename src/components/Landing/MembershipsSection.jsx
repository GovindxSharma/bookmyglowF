import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Check,
  Sparkles,
  MessageCircle,
  QrCode,
  RotateCw,
  Gift,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SALON_CONFIG } from "@/data/data";
import { GeometricEmblem } from "@/components/Common/GeometricLogo";

const MEMBERSHIP_PLANS = [
  {
    id: "silver",
    name: "SILVER GLOW PASS",
    price: "₹3,000",
    creditValue: "₹3,500 Studio Wallet",
    savingsText: "Save ₹500 Bonus",
    tagline: "Ideal for regular monthly haircuts, styling, and basic grooming.",
    isPopular: false,
    cardBg: "from-[#182A4A] to-[#253D66]",
    borderColor: "border-[#8EA89D]",
    accentBadge: "bg-[#8EA89D] text-[#182A4A]",
    qrCodeMock: "UO-SILVER-2024",
    perks: [
      "₹3,500 service wallet balance (Instant ₹500 bonus)",
      "1 Complimentary Signature Scissor Cut voucher",
      "5% off on all luxury take-home retail products",
      "Valid for 6 full months with rollover",
    ],
  },
  {
    id: "gold",
    name: "GOLD RADIANCE PASS",
    price: "₹6,000",
    creditValue: "₹7,500 Studio Wallet",
    savingsText: "Save ₹1,500 Bonus",
    tagline: "Our most coveted pass for complete hair, skin & spa rejuvenation.",
    isPopular: true,
    cardBg: "from-[#182A4A] via-[#1F365E] to-[#182A4A]",
    borderColor: "border-[#C89B3C]",
    accentBadge: "bg-[#C89B3C] text-white",
    qrCodeMock: "UO-GOLD-2024",
    perks: [
      "₹7,500 service wallet balance (Instant ₹1,500 bonus)",
      "1 Free Deep Cleansing Hydra Facial voucher",
      "1 Free Deluxe Rose Spa Pedicure",
      "10% off on all retail products",
      "Priority weekend slot reservations",
      "Share with 1 family member",
    ],
  },
  {
    id: "platinum",
    name: "PLATINUM VIP SANCTUARY",
    price: "₹12,000",
    creditValue: "₹15,000 Studio Wallet",
    savingsText: "Save ₹3,000 Bonus",
    tagline: "Unrestricted luxury access for individuals and families.",
    isPopular: false,
    cardBg: "from-[#101E35] to-[#182A4A]",
    borderColor: "border-[#FAF2DE]",
    accentBadge: "bg-[#FAF2DE] text-[#182A4A]",
    qrCodeMock: "UO-PLATINUM-2024",
    perks: [
      "₹15,000 service wallet balance (Instant ₹3,000 bonus)",
      "2 Free Botanical Hair Spa vouchers",
      "1 Free Full Body Aromatherapy Massage",
      "15% off on all salon retail products",
      "Dedicated Master Stylist priority",
      "Full family sharing (up to 4 members)",
    ],
  },
];

const MembershipsSection = () => {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInquire = (planName) => {
    const text = encodeURIComponent(
      `✨ *${SALON_CONFIG.name} — Geometric Grace VIP* ✨\nHello Concierge! I would like to join the *${planName}* pass.`
    );
    window.open(`https://wa.me/${SALON_CONFIG.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  return (
    <section id="memberships" className="py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Crown size={13} /> 3D VIP STUDIO WALLET PASSES
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            STUDIO VIP MEMBERSHIPS
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-xl mx-auto">
            Enjoy guaranteed bonus wallet balance, complimentary wellness treatments, and priority concierge access. Click or tap any pass to flip for QR & vouchers.
          </p>
        </div>

        {/* 3D Flip Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isFlipped = !!flippedCards[plan.id];

            return (
              <div key={plan.id} className="relative min-h-[460px] flex flex-col group">
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full bg-[#C89B3C] text-white text-[10px] font-extrabold tracking-[0.18em] uppercase shadow-lg flex items-center gap-1.5 border border-white/20">
                    <Sparkles size={12} /> MOST POPULAR
                  </div>
                )}

                <motion.div
                  className={`w-full h-full rounded-[32px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-500 shadow-xl border-2 ${
                    plan.borderColor
                  } bg-gradient-to-br ${plan.cardBg} text-white relative overflow-hidden`}
                  whileHover={{ y: -6 }}
                >
                  {/* Subtle Background Geometric Ring */}
                  <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full border-[18px] border-white/5 pointer-events-none" />

                  {!isFlipped ? (
                    // 🌟 CARD FRONT
                    <div className="flex flex-col justify-between h-full space-y-6">
                      <div>
                        {/* Top Foil Banner */}
                        <div className="flex items-center justify-between border-b border-white/15 pb-4">
                          <div className="flex items-center gap-2">
                            <GeometricEmblem size={24} />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C89B3C]">
                              URBAN OASIS VIP
                            </span>
                          </div>
                          <Crown size={20} className={plan.isPopular ? "text-[#C89B3C]" : "text-white/80"} />
                        </div>

                        <div className="mt-4">
                          <h3 className="font-display text-xl font-extrabold tracking-wider uppercase text-white">
                            {plan.name}
                          </h3>
                          <p className="text-xs text-white/70 mt-1">{plan.tagline}</p>
                        </div>

                        {/* Price & Wallet Boost */}
                        <div className="py-4 mt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                              {plan.price}
                            </span>
                            <span className="text-xs font-bold text-white/60">/ one-time</span>
                          </div>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-[#C89B3C] text-white shadow-xs">
                            <Sparkles size={13} />
                            <span>{plan.creditValue}</span>
                          </div>
                          <span className="block text-[11px] text-[#8EA89D] font-bold mt-1">
                            ✨ {plan.savingsText}
                          </span>
                        </div>
                      </div>

                      {/* Flip Trigger CTA */}
                      <div className="space-y-3 pt-2 border-t border-white/15">
                        <button
                          type="button"
                          onClick={() => toggleFlip(plan.id)}
                          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-white/20 transition uppercase tracking-wider"
                        >
                          <RotateCw size={14} className="text-[#C89B3C]" />
                          <span>Tap to Flip (VIP Perks & QR)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 🎫 CARD BACK (QR Code & Perks)
                    <div className="flex flex-col justify-between h-full space-y-4">
                      <div>
                        {/* Top Back Header */}
                        <div className="flex items-center justify-between border-b border-white/15 pb-3">
                          <div className="flex items-center gap-1.5">
                            <QrCode size={16} className="text-[#C89B3C]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-white">
                              VIP Concierge Pass
                            </span>
                          </div>
                          <button
                            onClick={() => toggleFlip(plan.id)}
                            className="text-xs text-white/70 hover:text-white flex items-center gap-1 underline font-semibold"
                          >
                            <RotateCw size={12} /> Flip Front
                          </button>
                        </div>

                        {/* QR Code Shimmer Box */}
                        <div className="my-3 p-3 rounded-2xl bg-white text-[#182A4A] flex items-center justify-between shadow-inner">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-[#FAF6EE] border border-[#E6DCCE]">
                              <QrCode size={36} className="text-[#182A4A]" />
                            </div>
                            <div>
                              <span className="text-[9px] font-extrabold uppercase text-[#C89B3C] tracking-wider block">
                                Digital VIP Code
                              </span>
                              <strong className="text-xs font-mono tracking-wider block">
                                {plan.qrCodeMock}
                              </strong>
                              <span className="text-[9px] text-[#6C8E82] font-semibold">● Active Member</span>
                            </div>
                          </div>
                        </div>

                        {/* Perks List */}
                        <div className="space-y-1.5 text-xs text-white/90">
                          {plan.perks.map((perk, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check size={13} className="text-[#C89B3C] flex-shrink-0 mt-0.5" />
                              <span className="leading-tight text-[11px]">{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Join Concierge CTA */}
                      <button
                        onClick={() => handleInquire(plan.name)}
                        className="btn-gold-primary w-full py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-gold-glow uppercase tracking-wider"
                      >
                        <MessageCircle size={15} />
                        <span>Join Pass via WhatsApp</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MembershipsSection;
