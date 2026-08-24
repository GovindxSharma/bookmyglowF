import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Award,
  Clock,
  Zap,
  Scissors,
  Smile,
  Crown,
  ChevronLeft,
} from "lucide-react";
import { GeometricEmblem } from "@/components/Common/GeometricLogo";

const QUIZ_STEPS = [
  {
    id: "focus",
    title: "1. What is your primary care or style focus today?",
    subtitle: "Select the area you would like to transform or rejuvenate.",
    options: [
      {
        id: "hair_revival",
        label: "Hair Transformation & Color",
        desc: "Balayage, Keratin smooth care, hair spa & precision scissor shaping.",
        icon: <Scissors size={20} className="text-[#C89B3C]" />,
        recommendedServices: ["Signature Haircut & Blowdry", "French Balayage & Olaplex Glaze"],
        specialist: "Rahul Sharma (Master Colorist)",
        estimatedTime: "90–120 min",
        estimatedPrice: "₹2,950",
        savings: "Save ₹450 (15% Combo)",
      },
      {
        id: "skin_glow",
        label: "Skin Radiance & Facial Therapy",
        desc: "Ultrasonic deep pore extraction, Hydra glow & anti-tan brightening.",
        icon: <Sparkles size={20} className="text-[#8EA89D]" />,
        recommendedServices: ["Deep Cleansing Hydra Glow Facial", "Deluxe Rose Petal Spa Pedicure"],
        specialist: "Pooja Patel (Skin Specialist)",
        estimatedTime: "75–90 min",
        estimatedPrice: "₹2,450",
        savings: "Save ₹350 (15% Combo)",
      },
      {
        id: "bridal_event",
        label: "Bridal & Occasion Artistry",
        desc: "High-definition makeup, couture hair updo & saree styling.",
        icon: <Crown size={20} className="text-[#C89B3C]" />,
        recommendedServices: ["Complete Ultra-HD Bridal Makeover", "Party Glamour & Floral Hair Updo"],
        specialist: "Komal Jadeja (Master Bridal Artist)",
        estimatedTime: "2–3 Hours",
        estimatedPrice: "₹8,500",
        savings: "Save ₹1,200 (VIP Bundle)",
      },
      {
        id: "men_grooming",
        label: "Men's Barber & Scalp Detox",
        desc: "Precision taper fade, hot towel razor shave & beard sculpt.",
        icon: <Award size={20} className="text-[#C06C52]" />,
        recommendedServices: ["Royal Hot Towel Shave", "Beard Sculpting", "Deep Nourishing Hair Spa"],
        specialist: "Amit Varma (Master Barber)",
        estimatedTime: "60 min",
        estimatedPrice: "₹1,400",
        savings: "Save ₹250 (Combo)",
      },
    ],
  },
  {
    id: "time",
    title: "2. How much time would you like to dedicate?",
    subtitle: "We tailor treatment intensity to your schedule.",
    options: [
      { id: "express", label: "Express Refresh (30–45 min)", desc: "Quick revitalizing grooming & cleanup." },
      { id: "signature", label: "Signature Studio Ritual (60–90 min)", desc: "Complete restorative treatments with massage." },
      { id: "deluxe", label: "Full Luxury Immersion (2+ Hours)", desc: "Comprehensive head-to-toe makeover." },
    ],
  },
];

const StyleAdvisorModal = ({ isOpen, onClose, onApplyPrescription }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFocus, setSelectedFocus] = useState(null);
  const [selectedTime, setSelectedTime] = useState("signature");
  const [isResultReady, setIsResultReady] = useState(false);

  if (!isOpen) return null;

  const handleSelectFocus = (option) => {
    setSelectedFocus(option);
    setCurrentStep(1);
  };

  const handleFinishQuiz = (timeOptionId) => {
    setSelectedTime(timeOptionId);
    setIsResultReady(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedFocus(null);
    setIsResultReady(false);
  };

  const handleBookPrescription = () => {
    onClose();
    if (onApplyPrescription && selectedFocus) {
      onApplyPrescription(selectedFocus);
    } else {
      const bookEl = document.getElementById("book");
      if (bookEl) bookEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#182A4A]/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white border-2 border-[#182A4A] rounded-[32px] sm:rounded-[36px] shadow-2xl w-full max-w-xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FAF6EE] border-b border-[#E6DCCE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white border border-[#E6DCCE] shadow-soft-sm">
              <GeometricEmblem size={28} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C89B3C]">
                VIRTUAL BEAUTY ADVISOR
              </span>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-[#182A4A] leading-tight">
                Discover Your Geometric Match
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#182A4A] hover:bg-white border border-[#E6DCCE] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {!isResultReady ? (
              // Step 1 or Step 2 Quiz Screen
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Step Breadcrumb / Progress Bar */}
                <div className="flex items-center justify-between text-xs font-bold text-[#8EA89D]">
                  <span>Step {currentStep + 1} of 2</span>
                  <div className="flex gap-1">
                    <div
                      className={`w-8 h-1.5 rounded-full ${
                        currentStep >= 0 ? "bg-[#C89B3C]" : "bg-[#E6DCCE]"
                      }`}
                    />
                    <div
                      className={`w-8 h-1.5 rounded-full ${
                        currentStep >= 1 ? "bg-[#C89B3C]" : "bg-[#E6DCCE]"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-extrabold text-base sm:text-lg text-[#182A4A]">
                    {QUIZ_STEPS[currentStep].title}
                  </h4>
                  <p className="text-xs text-[#5C6D88] mt-1">
                    {QUIZ_STEPS[currentStep].subtitle}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentStep === 0 &&
                    QUIZ_STEPS[0].options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectFocus(opt)}
                        className="w-full p-4 rounded-2xl border border-[#E6DCCE] hover:border-[#182A4A] hover:bg-[#FAF6EE] text-left transition flex items-start gap-3.5 group"
                      >
                        <div className="p-2.5 rounded-xl bg-[#FAF6EE] group-hover:bg-white border border-[#E6DCCE] flex-shrink-0">
                          {opt.icon}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-heading font-bold text-sm text-[#182A4A] group-hover:text-[#C89B3C] transition">
                            {opt.label}
                          </h5>
                          <p className="text-xs text-[#5C6D88] mt-0.5">{opt.desc}</p>
                        </div>
                        <ArrowRight size={16} className="text-[#C89B3C] mt-2 group-hover:translate-x-1 transition" />
                      </button>
                    ))}

                  {currentStep === 1 &&
                    QUIZ_STEPS[1].options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleFinishQuiz(opt.id)}
                        className="w-full p-4 rounded-2xl border border-[#E6DCCE] hover:border-[#182A4A] hover:bg-[#FAF6EE] text-left transition flex items-center justify-between group"
                      >
                        <div>
                          <h5 className="font-heading font-bold text-sm text-[#182A4A] group-hover:text-[#C89B3C] transition">
                            {opt.label}
                          </h5>
                          <p className="text-xs text-[#5C6D88] mt-0.5">{opt.desc}</p>
                        </div>
                        <ArrowRight size={16} className="text-[#C89B3C] group-hover:translate-x-1 transition" />
                      </button>
                    ))}
                </div>

                {currentStep === 1 && (
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#5C6D88] hover:text-[#182A4A] pt-2"
                  >
                    <ChevronLeft size={14} /> Back to focus selection
                  </button>
                )}
              </motion.div>
            ) : (
              // 🏆 Bespoke Prescription Result Card
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                <div className="p-5 rounded-3xl bg-[#FAF6EE] border-2 border-[#C89B3C]/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E6DCCE] pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#C89B3C]" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#182A4A]">
                        YOUR BESPOKE STUDIO PRESCRIPTION
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6EFEA] text-[#6C8E82] font-bold text-[10px] uppercase">
                      {selectedFocus?.savings}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-lg sm:text-xl font-extrabold text-[#182A4A]">
                      {selectedFocus?.label}
                    </h4>
                    <p className="text-xs text-[#5C6D88] mt-1">{selectedFocus?.desc}</p>
                  </div>

                  {/* Bundled Recommendations */}
                  <div className="space-y-2 pt-2 border-t border-[#E6DCCE]">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A8F7F] block">
                      Recommended Treatments:
                    </span>
                    <div className="space-y-1.5">
                      {selectedFocus?.recommendedServices.map((srv, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#182A4A]">
                          <CheckCircle2 size={14} className="text-[#6C8E82]" />
                          <span>{srv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matched Specialist & Duration */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E6DCCE] text-xs">
                    <div>
                      <span className="text-[10px] text-[#9A8F7F] font-bold block uppercase">
                        Matched Specialist:
                      </span>
                      <strong className="text-[#182A4A] block mt-0.5">{selectedFocus?.specialist}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9A8F7F] font-bold block uppercase">
                        Est. Duration:
                      </span>
                      <strong className="text-[#182A4A] block mt-0.5">⏱ {selectedFocus?.estimatedTime}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleBookPrescription}
                    className="btn-navy-primary w-full py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-navy-glow uppercase tracking-wider"
                  >
                    <Calendar size={15} />
                    <span>Confirm & Pre-Fill Booking Form</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-[#5C6D88] hover:text-[#182A4A] transition"
                  >
                    ↺ Retake Style Match Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default StyleAdvisorModal;
