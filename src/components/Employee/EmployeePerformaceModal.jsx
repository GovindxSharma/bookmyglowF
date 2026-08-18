import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import Loader from "../Layout/Loader.jsx";
import { X, Sparkles, TrendingUp, Calendar, Scissors, Award } from "lucide-react";

const EmployeePerformanceModal = ({ employee, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState({
    totalAppointments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const fetchPerformance = async (monthIndex) => {
    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const start = new Date(year, monthIndex, 1).toISOString().split("T")[0];
      const end = new Date(year, monthIndex + 1, 0).toISOString().split("T")[0];

      const res = await axios.get(
        `/payments/employee/${employee._id}?start=${start}&end=${end}`
      );

      const data = res.data || {};
      setAppointments(data.appointments || []);
      setSummary(data.summary || { totalAppointments: 0, totalRevenue: 0 });
    } catch (err) {
      console.error("Error fetching employee performance:", err);
      setAppointments([]);
      setSummary({ totalAppointments: 0, totalRevenue: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance(selectedMonth);
  }, [selectedMonth]);

  const commission = Math.round(summary.totalRevenue * 0.2); // 20% commission model

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative border border-[#EAE3D9] shadow-soft-lg space-y-5 text-[#242A26]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F2ECE4] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-[11px] font-semibold uppercase tracking-wider mb-1">
              <Award size={13} className="text-[#4E6758]" /> Stylist Performance
            </div>
            <h2 className="font-heading text-xl font-bold text-[#1F2421]">
              {employee.name}
            </h2>
            <p className="text-xs text-[#68706B]">{employee.phone} &bull; Stylist Profile</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F8F5F0] text-[#7D8480] hover:text-[#1F2421] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Month Dropdown */}
        <div className="flex items-center justify-between bg-[#FDFBF9] p-3 rounded-2xl border border-[#EAE3D9]">
          <span className="text-xs font-semibold text-[#4A524D] flex items-center gap-1.5">
            <Calendar size={14} className="text-[#4E6758]" /> Select Month:
          </span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#D9D0C5] text-xs font-bold text-[#1F2421] outline-none"
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx}>
                {m} {new Date().getFullYear()}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#F8F5F0] rounded-2xl p-4 border border-[#EAE3D9] text-center space-y-1">
            <p className="text-xs text-[#7D8480] font-medium">Services Delivered</p>
            <p className="font-heading text-2xl font-bold text-[#1F2421]">
              {summary.totalAppointments}
            </p>
          </div>

          <div className="bg-[#EDF3EF] rounded-2xl p-4 border border-[#D9E4DD] text-center space-y-1">
            <p className="text-xs text-[#35473C] font-medium">Gross Revenue Generated</p>
            <p className="font-heading text-2xl font-bold text-[#4E6758]">
              ₹{summary.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center space-y-1">
            <p className="text-xs text-amber-700 font-medium">Est. 20% Commission</p>
            <p className="font-heading text-2xl font-bold text-amber-800">
              ₹{commission.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#EAE3D9] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12 bg-[#FDFBF9]">
              <Loader size={150} />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-center text-xs text-[#7D8480] py-10 bg-[#FDFBF9]">
              No service logs recorded for this month.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F8F5F0] text-left text-[11px] font-bold text-[#4A524D] uppercase tracking-wider">
                    <th className="px-3.5 py-2.5">Date</th>
                    <th className="px-3.5 py-2.5">Client</th>
                    <th className="px-3.5 py-2.5">Service</th>
                    <th className="px-3.5 py-2.5 text-right">Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE4]">
                  {appointments.map((a, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2] transition">
                      <td className="px-3.5 py-2 text-[#68706B]">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                      <td className="px-3.5 py-2 font-medium text-[#1F2421]">
                        {a.customerName || "Walk-in Guest"}
                      </td>
                      <td className="px-3.5 py-2 text-[#4E6758]">
                        {a.serviceName || "Salon Service"}
                      </td>
                      <td className="px-3.5 py-2 font-bold text-[#1F2421] text-right">
                        ₹{(a.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformanceModal;
