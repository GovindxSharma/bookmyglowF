import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle className="text-[#3BA55D] w-6 h-6" />, // soft green
  error: <XCircle className="text-[#E03131] w-6 h-6" />, // red
  warning: <AlertTriangle className="text-[#E0A100] w-6 h-6" />, // amber
  info: <Info className="text-[#636CCB] w-6 h-6" />, // your app blue
};

const bgColors = {
  success: "bg-[#E6F6EC] border-[#A5E6B1]",
  error: "bg-[#FDECEC] border-[#F5B5B5]",
  warning: "bg-[#FFF8E6] border-[#F8E3A1]",
  info: "bg-[#EEF0FF] border-[#C7CBFF]",
};

const Alert = ({ type = "info", message, show, onClose, autoClose = 3000 }) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => onClose?.(), autoClose);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] 
          px-5 py-3 rounded-xl border shadow-md 
          w-[90%] sm:w-auto flex items-center gap-3 ${bgColors[type]}`}
        >
          {icons[type]}
          <p className="text-gray-800 text-sm sm:text-base font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
