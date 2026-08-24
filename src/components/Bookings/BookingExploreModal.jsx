import React, { useEffect, useState } from "react";
import { Info, X, Clipboard, Check, Sparkles, Share2, Receipt, Phone, User, Calendar, Clock, QrCode, CreditCard } from "lucide-react";
import { SALON_CONFIG } from "@/data/data";

const SERVICE_STATUS_MAP = {
  in_queue: { label: "⏳ In Queue / Waiting", class: "bg-amber-50 text-amber-900 border-amber-200" },
  in_progress: { label: "💆 In Chair / In Progress", class: "bg-blue-50 text-blue-900 border-blue-200" },
  completed: { label: "✨ Completed", class: "bg-emerald-50 text-emerald-900 border-emerald-200" },
  cancelled: { label: "❌ Cancelled / No-Show", class: "bg-rose-50 text-rose-900 border-rose-200" },
};

const BookingExploreModal = ({ booking, onClose }) => {
  const [showBillModal, setShowBillModal] = useState(false);
  const [showUpiQr, setShowUpiQr] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("explore-overlay")) onClose();
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  const servStatus = SERVICE_STATUS_MAP[booking.service_status || "in_queue"] || SERVICE_STATUS_MAP.in_queue;
  const upiUrl = `upi://pay?pa=urban.oasis@icici&pn=UrbanOasisStudio&am=${booking.amount || 0}&cu=INR&tn=Bill-${booking._id?.slice(-6)}`;
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="explore-overlay fixed inset-0 bg-[#182A4A]/60 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4 text-[#182A4A]">
      <div className="relative bg-white rounded-[32px] shadow-2xl border-2 border-[#182A4A] w-full max-w-md p-6 sm:p-7 overflow-y-auto max-h-[90vh] transition-all space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FAF6EE] text-[#5C6D88] hover:text-[#182A4A] hover:bg-[#FAF2DE] transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#FAF6EE] pb-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF2DE] border border-[#C89B3C]/40 flex items-center justify-center text-[#C89B3C]">
            <Receipt size={18} />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold uppercase text-[#182A4A]">
              Appointment Overview
            </h2>
            <p className="text-[11px] text-[#5C6D88]">Full studio visit details and receipt generator</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2.5 text-xs text-[#5C6D88]">
          <Detail label="Customer Name" value={booking.customer_id?.name || "Walk-in Guest"} isBold />
          <Detail label="Mobile Number" value={booking.customer_id?.phone || "N/A"} />
          <Detail label="Email Address" value={booking.customer_id?.email || "N/A"} />

          <div className="py-2.5 border-t border-[#FAF6EE] space-y-2">
            <Detail
              label="Booked Treatments"
              value={
                booking.services?.map((s) => s.service_id?.name).join(", ") ||
                "General Studio Service"
              }
            />
            <Detail
              label="Assigned Specialist"
              value={
                booking.services?.map((s) => s.employee_id?.name).filter(Boolean).join(", ") ||
                "Assigned Front Desk"
              }
            />
            <Detail
              label="Date & Time Slot"
              value={`${new Date(booking.date).toLocaleDateString()} at ${booking.appointment_time || "11:00 AM"}`}
            />
          </div>

          {/* Dual Status Block */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E6DCCE] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#182A4A]">Service Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${servStatus.class}`}>
                {servStatus.label}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-[#182A4A]">Payment Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  booking.payment_status === "completed"
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                    : "bg-amber-50 text-amber-900 border-amber-200"
                }`}
              >
                {booking.payment_status === "completed" ? "💰 Paid (Completed)" : "⏳ Pending / Unpaid"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#E6DCCE]">
              <span className="font-extrabold text-[#182A4A]">Total Bill:</span>
              <span className="font-display font-extrabold text-base text-[#182A4A]">
                ₹{booking.amount?.toLocaleString() || "0"}{" "}
                <span className="text-[10px] text-[#C89B3C] font-bold uppercase">
                  ({booking.payment_mode || "upi"})
                </span>
              </span>
            </div>
          </div>

          {/* Contactless UPI QR Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowUpiQr(!showUpiQr)}
              className="w-full p-3 rounded-2xl bg-[#FAF2DE] hover:bg-[#F3E5C2] border border-[#C89B3C]/50 flex items-center justify-between text-xs font-bold text-[#182A4A] transition"
            >
              <div className="flex items-center gap-2">
                <QrCode size={16} className="text-[#C89B3C]" />
                <span>Contactless UPI QR Payment (GPay / PhonePe / Paytm)</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase text-[#C89B3C]">
                {showUpiQr ? "Hide" : "Show QR"}
              </span>
            </button>

            {showUpiQr && (
              <div className="mt-2 p-4 rounded-2xl bg-white border-2 border-[#182A4A] text-center space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A8F7F] block">
                  Scan to Pay ₹{booking.amount || 0}
                </span>
                <div className="flex justify-center my-1">
                  <img
                    src={qrImgSrc}
                    alt="UPI QR Code"
                    className="w-36 h-36 border border-[#E6DCCE] rounded-xl p-1 shadow-sm"
                  />
                </div>
                <span className="text-[10px] font-mono text-[#5C6D88] block">
                  VPA: urban.oasis@icici
                </span>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#6C8E82]">
                  <span>● GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM UPI</span>
                </div>
              </div>
            )}
          </div>

          <Detail label="Booking Source" value={booking.source || "walk-in"} />
          {booking.note && <Detail label="Special Notes" value={booking.note} />}
        </div>

        {/* Footer Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowBillModal(true)}
            className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BE5A] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-soft-sm uppercase tracking-wider"
          >
            <Share2 size={14} /> Share WhatsApp Bill
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-[#FAF6EE] hover:bg-[#182A4A] hover:text-white text-[#182A4A] text-xs rounded-xl font-bold transition border border-[#E6DCCE] uppercase tracking-wider"
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
  <div className="flex justify-between items-start gap-2">
    <span className="font-semibold text-[#9A8F7F]">{label}:</span>
    <p className={`text-right max-w-[65%] truncate ${isBold ? "font-extrabold text-[#182A4A]" : "text-[#182A4A] font-medium"}`}>
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
    <div className="fixed inset-0 bg-[#182A4A]/60 backdrop-blur-sm flex justify-center items-center z-60 p-3 sm:p-4">
      <div className="relative bg-white rounded-[32px] shadow-2xl border-2 border-[#182A4A] w-full max-w-lg p-6 sm:p-7 space-y-4 text-[#182A4A]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FAF6EE] text-[#5C6D88] hover:text-[#182A4A] transition"
        >
          <X size={18} />
        </button>

        <div>
          <h2 className="font-display text-lg font-extrabold uppercase text-[#182A4A] flex items-center gap-2">
            <Share2 size={18} className="text-emerald-600" /> Share WhatsApp Tax Invoice
          </h2>
          <p className="text-xs text-[#5C6D88] mt-0.5">
            Preview the invoice message before sending it to {booking.customer_id?.name || "the client"}
          </p>
        </div>

        {/* Message Preview Box */}
        <div className="bg-[#FAF6EE] border border-[#E6DCCE] rounded-2xl p-4 font-mono text-xs text-[#182A4A] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
          {message}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            onClick={() => copyToClipboard(message, "message")}
            className="flex-1 py-3 bg-[#FAF6EE] hover:bg-[#182A4A] hover:text-white text-[#182A4A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-[#E6DCCE] uppercase tracking-wider"
          >
            {copied.message ? <Check size={14} /> : <Clipboard size={14} />}
            {copied.message ? "Copied!" : "Copy Text"}
          </button>

          <button
            onClick={shareViaWhatsApp}
            className="flex-1 py-3 bg-[#25D366] hover:bg-[#20BE5A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-soft-sm uppercase tracking-wider"
          >
            <Share2 size={14} /> Open in WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingExploreModal;
