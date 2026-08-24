import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Share2, Heart, Check, Copy, Crown, ArrowRight, MessageCircle } from "lucide-react";
import { SALON_CONFIG } from "@/data/data";
import { GeometricEmblem } from "@/components/Common/GeometricLogo";

const OCCASIONS = [
  { id: "birthday", label: "🎂 Birthday Glam", theme: "gold", tag: "Happy Birthday" },
  { id: "wedding", label: "💍 Wedding Glow", theme: "navy", tag: "Congratulations" },
  { id: "selfcare", label: "🌿 Pure Self-Care", theme: "teal", tag: "Relax & Unwind" },
  { id: "anniversary", label: "🥂 Anniversary Love", theme: "terracotta", tag: "With Love" },
];

const PRESET_AMOUNTS = [1500, 3000, 5000, 10000];

const GiftVoucherSection = () => {
  const [recipient, setRecipient] = useState("Pooja");
  const [sender, setSender] = useState("Govind");
  const [amount, setAmount] = useState(3000);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [customNote, setCustomNote] = useState("Enjoy a blissful day of luxury hair & spa pampering at Urban Oasis!");
  const [voucherCode] = useState(() => `UO-GIFT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copied, setCopied] = useState(false);

  const handleShareVoucher = () => {
    const text = encodeURIComponent(
      `🎁 *${SALON_CONFIG.name} — Luxury Gift Voucher* 🎁\n\n` +
      `Dearest *${recipient}*,\n` +
      `${sender} has gifted you a *₹${amount.toLocaleString()}* luxury spa & salon experience!\n\n` +
      `✨ *Occasion:* ${occasion.label}\n` +
      `💌 *Personal Note:* "${customNote}"\n\n` +
      `🎟️ *Voucher Code:* ${voucherCode}\n` +
      `📍 *Redeemable at:* ${SALON_CONFIG.address}\n` +
      `📞 *Book via Concierge:* ${SALON_CONFIG.phone}\n\n` +
      `_Valid for 12 full months across all hair, facial & spa rituals._ 🌿`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="gift-cards" className="py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Gift size={13} /> DIGITAL LUXURY VOUCHERS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            GIFT AN URBAN OASIS EXPERIENCE
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-xl mx-auto">
            Design a custom gold-embossed digital gift card for birthdays, anniversaries, or self-care treats. Sent instantly via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Interactive Voucher Customizer (6 Cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCCE] shadow-soft-md space-y-5">
            {/* Occasion Selector */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#182A4A] block mb-2">
                1. Select Occasion:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occ)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition flex items-center justify-between ${
                      occasion.id === occ.id
                        ? "bg-[#182A4A] text-white border-[#182A4A] shadow-xs"
                        : "bg-[#FAF6EE] text-[#182A4A] border-[#E6DCCE] hover:bg-white"
                    }`}
                  >
                    <span>{occ.label}</span>
                    {occasion.id === occ.id && <Check size={14} className="text-[#C89B3C]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selector */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#182A4A] block mb-2">
                2. Choose Gift Card Value:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition ${
                      amount === amt
                        ? "bg-[#C89B3C] text-white border-[#C89B3C] shadow-xs scale-105"
                        : "bg-[#FAF6EE] text-[#182A4A] border-[#E6DCCE] hover:bg-white"
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient & Sender Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#182A4A] block mb-1">
                  Recipient Name:
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#E6DCCE] text-xs font-bold text-[#182A4A] outline-none focus:border-[#182A4A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#182A4A] block mb-1">
                  Your Name (Sender):
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#E6DCCE] text-xs font-bold text-[#182A4A] outline-none focus:border-[#182A4A]"
                />
              </div>
            </div>

            {/* Custom Note */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#182A4A] block mb-1">
                Personalized Message:
              </label>
              <textarea
                rows={2}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#E6DCCE] text-xs font-medium text-[#182A4A] outline-none focus:border-[#182A4A]"
              />
            </div>

            {/* Action */}
            <button
              onClick={handleShareVoucher}
              className="btn-navy-primary w-full py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-navy-glow uppercase tracking-wider"
            >
              <MessageCircle size={15} />
              <span>Send Digital Voucher via WhatsApp</span>
            </button>
          </div>

          {/* Right Column: Live Metallic Foil Preview Card (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <motion.div
              layout
              className="w-full max-w-md aspect-[16/10] rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#182A4A] via-[#20375E] to-[#182A4A] text-white border-2 border-[#C89B3C] shadow-2xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Backing Ambient Shapes */}
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#C89B3C] opacity-25 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#8EA89D] opacity-20 blur-xl pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <GeometricEmblem size={24} />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C89B3C] block leading-tight">
                      URBAN OASIS STUDIO
                    </span>
                    <span className="text-[8px] tracking-widest uppercase text-white/70">
                      GIFT SANCTUARY PASS
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#C89B3C] text-[10px] font-bold uppercase tracking-wider border border-white/20">
                  {occasion.tag}
                </span>
              </div>

              {/* Card Center: Recipient & Value */}
              <div className="relative z-10 my-auto py-2">
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
                  Exclusively For:
                </span>
                <h3 className="font-display text-2xl font-extrabold text-white tracking-wide">
                  {recipient || "Honored Guest"}
                </h3>
                <p className="text-[11px] text-white/80 italic mt-1 line-clamp-2">
                  "{customNote}"
                </p>
              </div>

              {/* Card Footer: Amount & Voucher Code */}
              <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/15">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                    Voucher Value
                  </span>
                  <strong className="font-display text-2xl font-extrabold text-[#C89B3C]">
                    ₹{amount.toLocaleString()}
                  </strong>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                    Voucher Code
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="font-mono text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1 transition"
                  >
                    <span>{voucherCode}</span>
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftVoucherSection;
