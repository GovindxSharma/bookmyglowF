import React, { useEffect, useState } from "react";
import { Info, X, Clipboard, Check } from "lucide-react";

const BookingExploreModal = ({ booking, onClose }) => {
  const [showBillModal, setShowBillModal] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("explore-overlay")) onClose();
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  const getStatusBadge = (status) => {
    const base = "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case "completed":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            Completed
          </span>
        );
      case "pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            Pending
          </span>
        );
      case "refunded":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>Refunded</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>Unknown</span>
        );
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
          <Detail
            label="Employee"
            value={booking.services?.[0]?.employee_id?.name}
          />
          <Detail
            label="Services"
            value={
              booking.services?.map((s) => s.service_id?.name).join(", ") ||
              "N/A"
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

        {/* Footer Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={() => setShowBillModal(true)}
            className="px-4 py-1.5 bg-[#FFA93A] text-white text-sm rounded-md hover:bg-[#e38c25] transition font-medium"
          >
            Send Bill
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#687FE5] text-white text-sm rounded-md hover:bg-[#586fdd] transition font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {showBillModal && (
        <SendBillModal
          booking={booking}
          onClose={() => setShowBillModal(false)}
        />
      )}
    </div>
  );
};

// Reusable detail component
const Detail = ({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="font-medium text-gray-800">{label}</span>
    <p className="text-gray-600 text-right max-w-[55%] truncate">
      {value || "N/A"}
    </p>
  </div>
);

// Send Bill Modal

const SendBillModal = ({ booking, onClose }) => {
  const [copied, setCopied] = useState({ message: false });

  const totalExpected = booking.services?.reduce(
    (sum, s) => sum + (s.price || 0),
    0
  );
  const totalActual = booking.amount || 0;
  const discount = Math.max(totalExpected - totalActual, 0);

  // ----- CONDITIONAL DISCOUNT LINE -----
  const discountLine = discount > 0 ? `Discount - ₹${discount}\n` : "";

  // ----- MESSAGE -----
  const message = `Dear ${booking.customer_id?.name}, 🌸

Thank you for choosing Bunty’s Unisex Saloon today — it was a pleasure having you with us. We hope you enjoyed your pampering experience 💆‍♀💖

Here’s a summary of your services:
${booking.services
  ?.map((s) => `${s.service_id?.name} – ₹${s.price}`)
  .join("\n")}
${discountLine}Total Amount: ₹${totalActual}

We look forward to welcoming you again soon for another luxurious experience ✨

Warm regards,
Bunty’s Unisex Saloon Team
📞 9904334450 | 🌐 https://buntysaloon.onrender.com`;

  const customerPhone = booking.customer_id?.phone || "";
  const encodedMsg = encodeURIComponent(message);
  const whatsappURL = `https://api.whatsapp.com/send?phone=91${customerPhone}&text=${encodedMsg}`;

  const copyToClipboard = async (type, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1500);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60] px-4">
      <div className="relative bg-white rounded-xl shadow-2xl border border-[#E1E6FF] w-full max-w-3xl p-8 h-auto">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-[#687FE5] hover:text-[#4c5dd4] transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold text-[#3A3A3A] mb-5 border-b pb-3">
          Send Bill
        </h2>

        {/* Customer Number */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-800 text-sm">
              Customer Number
            </span>

            {/* WhatsApp Button */}
            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-md flex items-center gap-2 hover:bg-green-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.52 3.48A11.84 11.84 0 0012 0a11.81 11.81 0 00-8.33 3.46A11.81 11.81 0 000 11.81a11.62 11.62 0 001.6 5.93L0 24l6.44-1.69a11.93 11.93 0 005.53 1.4h.01a11.81 11.81 0 008.32-3.47A11.73 11.73 0 0024 11.82a11.79 11.79 0 00-3.48-8.34zM12 21.55h-.01a9.73 9.73 0 01-4.93-1.35l-.35-.21-3.82 1 1.02-3.72-.22-.38A9.77 9.77 0 012.23 11.8 9.72 9.72 0 0112 2.05a9.66 9.66 0 016.87 2.85 9.62 9.62 0 012.84 6.87 9.7 9.7 0 01-9.71 9.78zm5.32-7.25c-.29-.15-1.72-.85-1.99-.95s-.46-.15-.66.15-.76.95-.94 1.15-.35.22-.64.07a7.92 7.92 0 01-2.33-1.44 8.69 8.69 0 01-1.61-2c-.17-.3 0-.46.13-.61.14-.15.3-.36.45-.54s.19-.31.29-.51a.55.55 0 000-.54c-.07-.15-.66-1.6-.9-2.19s-.48-.48-.66-.49h-.57a1.1 1.1 0 00-.79.37 3.31 3.31 0 00-1 2.46 5.79 5.79 0 001.22 3.08A13.19 13.19 0 009.65 17c.47.26.82.41 1.1.52a2.65 2.65 0 001.1.21 2.31 2.31 0 00.76-.13 5.43 5.43 0 001.77-1.12 2.24 2.24 0 00.49-1.27c0-.17-.02-.31-.07-.36s-.24-.15-.53-.3z" />
              </svg>
              WhatsApp
            </a>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-700">
            {customerPhone || "N/A"}
          </div>
        </div>

        {/* Bill message */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-800 text-sm">
              Bill Message
            </span>

            <button
              onClick={() => copyToClipboard("message", message)}
              className="text-[#687FE5] hover:text-[#4c5dd4]"
            >
              {copied.message ? <Check size={18} /> : <Clipboard size={18} />}
            </button>
          </div>

          <textarea
            value={message}
            readOnly
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-700 h-[350px] resize-none"
          />
        </div>

        {/* CLOSE BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#687FE5] text-white text-sm rounded-md hover:bg-[#586fdd] transition font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default SendBillModal;



export default BookingExploreModal;
