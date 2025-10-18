// components/Toast.jsx
import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Map theme colors to toast types
  const toastColors = {
    success: "bg-[#FCD8CD] text-gray-800", // soft peach
    info: "bg-[#EBD6FB] text-gray-800",    // light purple
    warning: "bg-[#FEEBF6] text-gray-800", // soft pink
    error: "bg-[#687FE5] text-white",      // blue
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-lg ${toastColors[type]} animate-slide-in`}
    >
      {message}
    </div>
  );
};

export default Toast;
