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
      <div className="flex justify-center items-center py-20 bg-[#FDFBF9]">
        <Loader size={160} />
      </div>
    );
  }

  return (
    <div className="space-y-5 text-[#242A26]">
      {alert.show && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold text-center ${
            alert.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D9] shadow-soft-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1F2421] flex items-center gap-2">
              <Sparkles size={18} className="text-[#4E6758]" />
              Website Booking Inquiries
            </h2>
            <p className="text-xs text-[#68706B] mt-0.5">
              Online customer requests waiting for front desk confirmation
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-xs font-bold">
            {appointments.length} Pending Requests
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-14 text-[#7D8480] space-y-1.5">
            <Sparkles size={28} className="mx-auto text-[#4E6758] opacity-50" />
            <p className="text-sm font-semibold text-[#1F2421]">All online requests are confirmed!</p>
            <p className="text-xs">New website bookings will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((item) => (
              <div
                key={item._id}
                className="p-4 rounded-2xl bg-[#FDFBF9] border border-[#EAE3D9] hover:border-[#4E6758] transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1F2421] flex items-center gap-1.5">
                        <User size={14} className="text-[#4E6758]" />
                        {item.customer_id?.name || "Online Guest"}
                      </h4>
                      <span className="text-xs text-[#68706B] flex items-center gap-1 mt-0.5 font-mono">
                        <Phone size={12} /> {item.customer_id?.phone || "N/A"}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                      Needs Confirmation
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#EAE3D9] space-y-1 text-xs text-[#555E58]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#7D8480]">Date & Slot:</span>
                      <span className="font-semibold text-[#1F2421]">
                        {new Date(item.date).toLocaleDateString()} at {item.appointment_time || "11:00 AM"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#7D8480]">Service:</span>
                      <span className="font-semibold text-[#1F2421]">
                        {(item.services || []).map((s) => s.service_id?.name).join(", ") || "Salon Service"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[#7D8480]">Est. Amount:</span>
                      <span className="font-bold text-[#4E6758] text-sm">
                        ₹{(item.amount || 450).toLocaleString()}
                      </span>
                    </div>

                    {item.note && (
                      <p className="mt-1.5 text-[11px] text-[#68706B] italic bg-white p-2 rounded-xl border border-[#EAE3D9]">
                        "{item.note}"
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleApprove(item._id)}
                  className="w-full py-2.5 rounded-xl bg-[#4E6758] hover:bg-[#405448] text-white font-semibold text-xs transition shadow-soft-sm flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> Confirm & Reserve Slot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineBooking;
