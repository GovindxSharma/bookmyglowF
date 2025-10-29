import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, PartyPopper } from "lucide-react";

const CustomerAlert = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
        colors: ["#16A34A", "#86EFAC", "#BBF7D0", "#FACC15"],
      };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl shadow-2xl p-8 max-w-sm w-[90%] text-center border border-green-200"
          >
            {/* Subtle glowing accent */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-100/20 via-transparent to-emerald-100/20 pointer-events-none" />

            {/* Icon */}
            <motion.div
              initial={{ rotate: -30, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative mx-auto mb-4 flex items-center justify-center"
            >
              <div className="relative bg-green-100 rounded-full p-4 shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <PartyPopper className="absolute -top-3 -right-3 w-6 h-6 text-yellow-500" />
              </div>
            </motion.div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Appointment Confirmed! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully scheduled. <br />
              We’re excited to see you soon!
            </p>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#16A34A" }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-2.5 bg-green-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Awesome!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomerAlert;
