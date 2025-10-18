import React, { useEffect } from "react";

const Notification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // auto-close after 4 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 border-l-4 p-4 rounded-xl shadow-lg w-80 transition-all animate-fade-in-up ${colors[type]}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{message}</span>
        <button
          className="ml-3 text-sm text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Notification;
