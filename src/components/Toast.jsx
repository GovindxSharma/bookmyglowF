// components/Toast.jsx
import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "success", onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeConfig = {
    success: {
      bg: "bg-white text-[#1F2421] border-emerald-200 shadow-soft-md",
      icon: <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />,
    },
    info: {
      bg: "bg-white text-[#1F2421] border-[#D9E4DD] shadow-soft-md",
      icon: <Info size={16} className="text-[#4E6758] flex-shrink-0" />,
    },
    warning: {
      bg: "bg-white text-[#1F2421] border-amber-200 shadow-soft-md",
      icon: <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />,
    },
    error: {
      bg: "bg-white text-[#1F2421] border-rose-200 shadow-soft-md",
      icon: <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />,
    },
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border bg-white shadow-soft-lg"
    >
      <div className="flex items-center gap-2.5">
        {current.icon}
        <span className="text-xs sm:text-sm font-semibold text-[#1F2421] leading-snug">
          {message}
        </span>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition flex-shrink-0"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export default Toast;
