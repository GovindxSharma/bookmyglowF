import React, { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import { Check, Clock, User, Phone, Calendar, Sparkles } from "lucide-react";
import { BASE_URL } from "../../data/data";
import Loader from "../Layout/Loader";

const OnlineBooking = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  const fetchOnlineAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/appointments/?for_notification=true");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to fetch online bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineAppointments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/appointments/${id}`, {
        confirmation_status: true,
        payment_status: "completed",
        payment_mode: "upi",
      });
      setAppointments((prev) => prev.filter((item) => item._id !== id));
      showAlert("success", "Appointment confirmed & added to register! ✨");
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to confirm booking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-[#FAF6EE]">
        <Loader size={160} />
      </div>
    );
  }

  return (
    <div className="space-y-5 text-[#182A4A]">
      {alert.show && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold text-center ${
            alert.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6DCCE] shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold uppercase text-[#182A4A] flex items-center gap-2">
              <Sparkles size={18} className="text-[#C89B3C]" />
              Website Booking Inquiries
            </h2>
            <p className="text-xs text-[#5C6D88] mt-0.5">
              Online customer requests waiting for front desk confirmation
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-[#FAF2DE] text-[#182A4A] border border-[#C89B3C]/40 text-xs font-bold self-start sm:self-center uppercase tracking-wider">
            {appointments.length} Pending Inquiries
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-16 text-[#5C6D88] space-y-2 bg-[#FAF6EE]/50 rounded-2xl border border-dashed border-[#E6DCCE]">
            <Sparkles size={32} className="mx-auto text-[#C89B3C]" />
            <p className="text-sm font-extrabold text-[#182A4A] uppercase tracking-wider">All online inquiries are confirmed!</p>
            <p className="text-xs">New website bookings will appear here in real-time automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#E6DCCE] hover:border-[#182A4A] transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-[#182A4A] flex items-center gap-1.5">
                        <User size={15} className="text-[#C89B3C]" />
                        {item.customer_id?.name || "Online Guest"}
                      </h4>
                      <span className="text-xs text-[#5C6D88] flex items-center gap-1 mt-0.5 font-mono">
                        <Phone size={12} /> {item.customer_id?.phone || "N/A"}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                      Needs Confirmation
                    </span>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-[#E6DCCE] space-y-1.5 text-xs text-[#5C6D88]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9A8F7F] font-semibold">Date & Slot:</span>
                      <span className="font-bold text-[#182A4A]">
                        {new Date(item.date).toLocaleDateString()} at {item.appointment_time || "11:00 AM"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#9A8F7F] font-semibold">Treatment:</span>
                      <span className="font-bold text-[#182A4A] max-w-[65%] truncate text-right">
                        {(item.services || []).map((s) => s.service_id?.name).join(", ") || "Salon Service"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[#9A8F7F] font-semibold">Est. Total:</span>
                      <span className="font-display font-extrabold text-[#C89B3C] text-sm sm:text-base">
                        ₹{(item.amount || 450).toLocaleString()}
                      </span>
                    </div>

                    {item.note && (
                      <p className="mt-2 text-[11px] text-[#5C6D88] italic bg-white p-2.5 rounded-xl border border-[#E6DCCE]">
                        "{item.note}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleApprove(item._id)}
                    className="btn-navy-primary w-full py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-navy-glow"
                  >
                    <Check size={14} />
                    <span>CONFIRM & BOOK</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineBooking;
