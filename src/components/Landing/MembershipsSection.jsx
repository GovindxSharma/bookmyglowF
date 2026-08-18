import React from "react";
import { motion } from "framer-motion";
import { Crown, Check, Sparkles, MessageCircle, Heart, Star } from "lucide-react";
import { SALON_CONFIG } from "@/data/data";

const MEMBERSHIP_PLANS = [
  {
    id: "silver",
    name: "Silver Glow Pass",
    price: "₹3,000",
    creditValue: "₹3,500 Wallet Balance",
    tagline: "Ideal for regular monthly haircuts and basic self-care.",
    isPopular: false,
    perks: [
      "₹3,500 service wallet (Save ₹500 instantly)",
      "1 Free Haircut & Blowdry voucher",
      "5% off on all retail hair products",
      "Valid for 6 full months",
    ],
  },
  {
    id: "gold",
    name: "Gold Radiance Pass",
    price: "₹6,000",
    creditValue: "₹7,500 Wallet Balance",
    tagline: "Our most popular membership for complete hair, skin & spa care.",
    isPopular: true,
    perks: [
      "₹7,500 service wallet (Save ₹1,500 instantly)",
      "1 Free Deep Cleansing Facial voucher",
      "1 Free Deluxe Spa Pedicure",
      "10% off on all retail products",
      "Priority weekend slot reservations",
      "Valid for 12 months (Share with 1 family member)",
    ],
  },
  {
    id: "platinum",
    name: "Platinum VIP Sanctuary",
    price: "₹12,000",
    creditValue: "₹15,000 Wallet Balance",
    tagline: "Unrestricted luxury access for individuals and families.",
    isPopular: false,
    perks: [
      "₹15,000 service wallet (Save ₹3,000 instantly)",
      "2 Free L'Oréal Deep Hair Spa vouchers",
      "1 Free Full Body Aromatherapy Massage",
      "15% off on all salon retail products",
      "Dedicated Senior Stylist assigned",
      "Full family sharing (up to 4 members)",
      "Valid for 12 months with no expiry carry-forward",
    ],
  },
];

const MembershipsSection = () => {
  const handleInquire = (planName) => {
    const text = encodeURIComponent(
      `✨ *${SALON_CONFIG.name}* ✨\nHello! I would like to inquire about joining the *${planName}* membership.`
    );
    window.open(`https://wa.me/91${SALON_CONFIG.phone.replace(/\D/g, "")}?text=${text}`, "_blank");
  };

  return (
    <section id="memberships" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#F8F5F0] text-[#242A26] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Crown size={14} className="text-[#4E6758]" /> VIP Membership Passes
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F2421]">
            Prepaid Passes & Extra Savings
          </h2>
          <p className="text-[#68706B] text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Get extra wallet credits, complimentary service vouchers, and priority booking on every visit.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? "bg-white border-2 border-[#4E6758] shadow-soft-md ring-4 ring-[#4E6758]/10"
                  : "bg-white border border-[#EAE3D9] shadow-soft-sm hover:shadow-soft-md"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#4E6758] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Star size={12} className="fill-white" /> Most Popular
                </div>
              )}

              <div>
                <div className="border-b border-[#F2ECE4] pb-4 mb-4">
                  <h3 className="font-heading text-xl font-bold text-[#1F2421]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#68706B] mt-1">
                    {plan.tagline}
                  </p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-heading text-3xl sm:text-4xl font-bold text-[#1F2421]">
                      {plan.price}
                    </span>
                    <span className="text-xs font-bold text-[#4E6758] bg-[#EDF3EF] px-2 py-0.5 rounded-md">
                      {plan.creditValue}
                    </span>
                  </div>
                </div>

                {/* Perks List */}
                <div className="space-y-2.5 mb-6">
                  <span className="text-[11px] font-bold uppercase text-[#7D8480] tracking-wider block">
                    Included Benefits:
                  </span>
                  {plan.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#4A524D]">
                      <Check size={14} className="text-[#4E6758] flex-shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleInquire(plan.name)}
                className={`w-full py-3 rounded-2xl font-semibold text-xs transition duration-200 flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? "bg-[#4E6758] hover:bg-[#405448] text-white shadow-soft-sm"
                    : "bg-[#EDF3EF] hover:bg-[#E0ECE5] text-[#35473C]"
                }`}
              >
                <MessageCircle size={14} />
                <span>Get Membership on WhatsApp</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipsSection;
