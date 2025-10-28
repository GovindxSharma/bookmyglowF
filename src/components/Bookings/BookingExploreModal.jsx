import React, { useEffect } from "react";
import { Info, X } from "lucide-react";

const BookingExploreModal = ({ booking, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("explore-overlay")) {
        onClose();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  const getStatusBadge = (status) => {
    const base =
      "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case "completed":
        return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case "refunded":
        return <span className={`${base} bg-red-100 text-red-700`}>Refunded</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>Unknown</span>;
    }
  };

  return (
    <div className="explore-overlay fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3">
      <div className="relative bg-white rounded-xl shadow-lg border border-[#E1E6FF] w-full max-w-md p-5 overflow-y-auto max-h-[80vh] transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-4 text-[#687FE5] hover:text-[#4c5dd4] transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
          <Info size={20} className="text-[#687FE5]" />
          <h2 className="text-lg font-semibold text-[#3A3A3A]">
            Appointment Details
          </h2>
        </div>

        {/* Details */}
        <div className="space-y-2.5 text-sm text-gray-700">
          <Detail label="Customer" value={booking.customer_id?.name} />
          <Detail label="Phone" value={booking.customer_id?.phone} />
          <Detail label="Email" value={booking.customer_id?.email} />
          <Detail label="Employee" value={booking.employee_id?.name} />
          <Detail
            label="Services"
            value={
              booking.services?.map((s) => s.service_id?.name).join(", ") || "N/A"
            }
          />
          <Detail label="Amount" value={`₹${booking.amount || "0"}`} />
          <Detail label="Payment Mode" value={booking.payment_mode} />
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800">Payment Status</span>
            {getStatusBadge(booking.payment_status)}
          </div>
          <Detail
            label="Date"
            value={booking.date ? booking.date.split("T")[0] : "N/A"}
          />
          <Detail label="Source" value={booking.source} />
          <Detail label="Notes" value={booking.customer_id?.note} />
        </div>

        {/* Close Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#687FE5] text-white text-sm rounded-md hover:bg-[#586fdd] transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Small reusable subcomponent for cleaner code
const Detail = ({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="font-medium text-gray-800">{label}</span>
    <p className="text-gray-600 text-right max-w-[55%] truncate">
      {value || "N/A"}
    </p>
  </div>
);

export default BookingExploreModal;
