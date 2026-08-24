import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { X, Calendar, DollarSign, Sparkles } from "lucide-react";
import { BASE_URL } from "../../data/data";
import Loader from "../Layout/Loader.jsx";

const MonthAppointmentsModal = ({ onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const localStart = new Date(start.getTime() - start.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const localEnd = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    setStartDate(localStart);
    setEndDate(localEnd);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/appointments/?date_start=${startDate}&date_end=${endDate}&for_notification=false`
        );

        const data = res.data.appointments || [];
        setAppointments(data);

        const revenue = data.reduce((sum, a) => sum + (a.amount || 0), 0);
        setTotalRevenue(revenue);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setAppointments([]);
        setTotalRevenue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [startDate, endDate]);

  if (loading) return <Loader size={200} />;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-center items-start pt-14 p-4 text-[#242A26]">
      <div className="bg-white rounded-3xl border border-[#EAE3D9] shadow-soft-lg w-full max-w-4xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto space-y-5">
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-[#F8F5F0] text-[#7D8480] hover:text-[#1F2421] transition"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <h2 className="font-heading text-xl font-bold text-[#1F2421] flex items-center gap-2">
            <Calendar size={20} className="text-[#4E6758]" /> Monthly Appointments Register
          </h2>
          <p className="text-xs text-[#68706B] mt-0.5">
            Overview from <strong>{startDate}</strong> to <strong>{endDate}</strong>
          </p>
        </div>

        {/* Totals Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#F8F5F0] p-4 rounded-2xl border border-[#EAE3D9] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#555E58]">Total Appointments</span>
            <span className="font-heading text-xl font-bold text-[#1F2421]">{appointments.length}</span>
          </div>

          <div className="bg-[#EDF3EF] p-4 rounded-2xl border border-[#D9E4DD] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#35473C]">Total Monthly Revenue</span>
            <span className="font-heading text-xl font-bold text-[#4E6758]">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Appointment Table */}
        <div className="border border-[#EAE3D9] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full table-auto text-xs">
              <thead>
                <tr className="bg-[#F8F5F0] text-left text-[11px] font-bold text-[#4A524D] uppercase tracking-wider">
                  <th className="px-3.5 py-2.5">Date</th>
                  <th className="px-3.5 py-2.5">Customer Name</th>
                  <th className="px-3.5 py-2.5">Service</th>
                  <th className="px-3.5 py-2.5">Stylist</th>
                  <th className="px-3.5 py-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4]">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-[#7D8480]">
                      No appointments recorded for this period.
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-[#FAF7F2] transition">
                      <td className="px-3.5 py-2.5 text-[#68706B]">
                        {new Date(app.date || app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3.5 py-2.5 font-semibold text-[#1F2421]">
                        {app.customer_id?.name || "Walk-in Guest"}
                      </td>
                      <td className="px-3.5 py-2.5 text-[#4E6758]">
                        {(app.services || []).map((s) => s.service_id?.name || "Service").join(", ")}
                      </td>
                      <td className="px-3.5 py-2.5 text-[#555E58]">
                        {(app.services || []).map((s) => s.employee_id?.name).filter(Boolean).join(", ") || "General Staff"}
                      </td>
                      <td className="px-3.5 py-2.5 font-bold text-[#1F2421] text-right">
                        ₹{(app.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthAppointmentsModal;
