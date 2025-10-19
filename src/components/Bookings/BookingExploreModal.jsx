import React, { useEffect } from "react";
import { Info, X } from "lucide-react";

const BookingExploreModal = ({ booking, onClose }) => {
  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("explore-overlay")) {
        onClose();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  return (
    <div
      className="explore-overlay fixed inset-0 backdrop-blur-md bg-white/30 flex justify-center items-center z-50 overflow-hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-[#d1d9ff] w-full max-w-2xl p-10 relative transition-all duration-300 overflow-y-auto"
        style={{
          maxHeight: "90vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-6 text-[#687FE5] hover:text-[#4c5dd4] transition-all"
          onClick={onClose}
        >
          <X size={26} />
        </button>

        {/* Header */}
        <h2 className="text-3xl font-semibold mb-6 text-[#687FE5] flex items-center gap-3">
          <Info size={26} /> Appointment Details
        </h2>

        {/* Details Section */}
        <div className="space-y-4 text-[15px] leading-relaxed text-gray-800">
          <p>
            <strong>👤 Customer:</strong> {booking.customer_id?.name}
          </p>
          <p>
            <strong>📞 Phone:</strong> {booking.customer_id?.phone}
          </p>
          <p>
            <strong>✉️ Email:</strong> {booking.customer_id?.email || "N/A"}
          </p>
          <p>
            <strong>🚻 Gender:</strong> {booking.customer_id?.gender || "N/A"}
          </p>
          <p>
            <strong>🏠 Address:</strong> {booking.customer_id?.address || "N/A"}
          </p>
          <p>
            <strong>💆‍♀️ Services:</strong>{" "}
            {booking.services?.map((s) => s.service_id?.name).join(", ") ||
              "N/A"}
          </p>
          <p>
            <strong>💼 Employee:</strong> {booking.employee_id?.name || "N/A"}
          </p>
          <p>
            <strong>💰 Amount:</strong> ₹{booking.amount}
          </p>
          <p>
            <strong>💳 Payment Mode:</strong> {booking.payment_mode || "N/A"}
          </p>
          <p>
            <strong>📋 Status:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.payment_status === "completed"
                  ? "bg-green-100 text-green-700"
                  : booking.payment_status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {booking.payment_status}
            </span>
          </p>
          <p>
            <strong>📅 Date:</strong>{" "}
            {booking.date ? booking.date.split("T")[0] : "N/A"}
          </p>
          <p>
            <strong>🌐 Source:</strong> {booking.source || "N/A"}
          </p>
          <p>
            <strong>📝 Notes:</strong> {booking.customer_id?.note || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingExploreModal;
