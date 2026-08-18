import React, { useEffect, useState } from "react";
import { Info, X, Clipboard, Check, Sparkles, Share2, Receipt, Phone, User, Calendar, Clock } from "lucide-react";
import { SALON_CONFIG } from "@/data/data";

const SERVICE_STATUS_MAP = {
  in_queue: { label: "⏳ In Queue / Waiting", class: "bg-amber-50 text-amber-800 border-amber-200" },
  in_progress: { label: "💆 In Chair / In Progress", class: "bg-blue-50 text-blue-800 border-blue-200" },
  completed: { label: "✨ Completed", class: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  cancelled: { label: "❌ Cancelled / No-Show", class: "bg-rose-50 text-rose-800 border-rose-200" },
};

const BookingExploreModal = ({ booking, onClose }) => {
  const [showBillModal, setShowBillModal] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("explore-overlay")) onClose();
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  const servStatus = SERVICE_STATUS_MAP[booking.service_status || "in_queue"] || SERVICE_STATUS_MAP.in_queue;

  return (
    <div className="explore-overlay fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 px-3 text-[#242A26]">
      <div className="relative bg-white rounded-3xl shadow-soft-lg border border-[#EAE3D9] w-full max-w-md p-6 overflow-y-auto max-h-[85vh] transition-all space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-[#F8F5F0] text-[#7D8480] hover:text-[#1F2421] transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 border-b border-[#F2ECE4] pb-3">
          <div className="w-8 h-8 rounded-xl bg-[#EDF3EF] border border-[#D9E4DD] flex items-center justify-center text-[#4E6758]">
            <Receipt size={16} />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#1F2421]">
              Appointment Overview
            </h2>
            <p className="text-[11px] text-[#68706B]">Full visit details and receipt generator</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2.5 text-xs text-[#555E58]">
          <Detail label="Customer Name" value={booking.customer_id?.name || "Walk-in Guest"} isBold />
          <Detail label="Mobile Number" value={booking.customer_id?.phone || "N/A"} />
          <Detail label="Email Address" value={booking.customer_id?.email || "N/A"} />

          <div className="py-2 border-t border-[#F2ECE4] space-y-2">
            <Detail
              label="Booked Services"
              value={
                booking.services?.map((s) => s.service_id?.name).join(", ") ||
                "General Service"
              }
            />
            <Detail
              label="Assigned Stylist"
              value={
                booking.services?.map((s) => s.employee_id?.name).filter(Boolean).join(", ") ||
                "Assigned Front Desk"
              }
            />
            <Detail
              label="Date & Time"
              value={`${new Date(booking.date).toLocaleDateString()} at ${booking.appointment_time || "11:00 AM"}`}
            />
          </div>

          {/* Dual Status Block */}
          <div className="p-3 rounded-2xl bg-[#FDFBF9] border border-[#EAE3D9] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#1F2421]">Service Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${servStatus.class}`}>
                {servStatus.label}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#1F2421]">Payment Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  booking.payment_status === "completed"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {booking.payment_status === "completed" ? "💰 Paid (Completed)" : "⏳ Pending / Unpaid"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-[#EAE3D9]">
              <span className="font-bold text-[#1F2421]">Total Bill:</span>
              <span className="font-heading font-bold text-sm text-[#4E6758]">
                ₹{booking.amount?.toLocaleString() || "0"}{" "}
                <span className="text-[10px] text-[#7D8480] font-normal uppercase">
                  ({booking.payment_mode || "upi"})
                </span>
              </span>
            </div>
          </div>

          <Detail label="Booking Source" value={booking.source || "walk-in"} />
          {booking.note && <Detail label="Special Notes" value={booking.note} />}
        </div>

        {/* Footer Buttons */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={() => setShowBillModal(true)}
            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-soft-sm"
          >
            <Share2 size={13} /> Share WhatsApp Bill
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F8F5F0] hover:bg-[#EAE3D9] text-[#555E58] text-xs rounded-xl font-semibold transition"
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
const Detail = ({ label, value, isBold = false }) => (
  <div className="flex justify-between items-start">
    <span className="font-medium text-[#7D8480]">{label}</span>
    <p className={`text-right max-w-[60%] truncate ${isBold ? "font-bold text-[#1F2421]" : "text-[#242A26]"}`}>
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

  const discountLine =
    discount > 0
      ? `✂️ *Combo Discount Applied:* -₹${discount}\n`
      : "";

  const serviceNames = (booking.services || [])
    .map((s) => s.service_id?.name || "Service")
    .join(", ");

  const message =
    `✨ *${SALON_CONFIG.name} — Tax Invoice* ✨\n\n` +
    `Hello *${booking.customer_id?.name || "Valued Client"}*,\n` +
    `Thank you for visiting us! Here is your official service summary:\n\n` +
    `📅 *Date:* ${new Date(booking.date).toLocaleDateString()}\n` +
    `⏰ *Time:* ${booking.appointment_time || "11:00 AM"}\n` +
    `💇‍♀️ *Services:* ${serviceNames}\n` +
    `💈 *Service Status:* ${booking.service_status === "completed" ? "Completed" : "In Progress"}\n` +
    `💳 *Payment Status:* ${booking.payment_status === "completed" ? "PAID" : "PENDING"}\n` +
    discountLine +
    `💰 *Total Amount:* ₹${booking.amount}\n\n` +
    `📍 *Address:* ${SALON_CONFIG.address}\n` +
    `📞 *Helpline:* ${SALON_CONFIG.phone}\n\n` +
    `_We look forward to pampering you again soon!_ 🌿`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const shareViaWhatsApp = () => {
    const phone = booking.customer_id?.phone?.replace(/\D/g, "");
    if (!phone) return alert("Customer phone number not available.");
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91${phone}?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-60 p-4">
      <div className="relative bg-white rounded-3xl shadow-soft-lg border border-[#EAE3D9] w-full max-w-lg p-6 space-y-4 text-[#242A26]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#F8F5F0] text-[#7D8480] hover:text-[#1F2421] transition"
        >
          <X size={18} />
        </button>

        <div>
          <h2 className="font-heading text-lg font-bold text-[#1F2421] flex items-center gap-2">
            <Share2 size={18} className="text-emerald-600" /> Share WhatsApp Tax Invoice
          </h2>
          <p className="text-xs text-[#68706B] mt-0.5">
            Preview the invoice message before sending it to {booking.customer_id?.name || "the client"}
          </p>
        </div>

        {/* Message Preview Box */}
        <div className="bg-[#F8F5F0] border border-[#EAE3D9] rounded-2xl p-4 font-mono text-xs text-[#35473C] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
          {message}
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={() => copyToClipboard(message, "message")}
            className="flex-1 py-2.5 bg-[#EDF3EF] hover:bg-[#E0ECE5] text-[#35473C] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-[#D9E4DD]"
          >
            {copied.message ? <Check size={14} /> : <Clipboard size={14} />}
            {copied.message ? "Copied!" : "Copy Text"}
          </button>

          <button
            onClick={shareViaWhatsApp}
            className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20BE5A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-soft-sm"
          >
            <Share2 size={14} /> Open in WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingExploreModal;
