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
    <div className="fixed inset-0 bg-[#182A4A]/60 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative border-2 border-[#182A4A] shadow-2xl space-y-5 text-[#182A4A]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#FAF6EE] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF2DE] text-[#C89B3C] border border-[#C89B3C]/30 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
              <Award size={13} /> SPECIALIST ANALYTICS
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-[#182A4A]">
              {employee.name}
            </h2>
            <p className="text-xs text-[#5C6D88]">{employee.phone} &bull; Master Stylist Profile</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF6EE] text-[#5C6D88] hover:text-[#182A4A] hover:bg-[#FAF2DE] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Month Dropdown */}
        <div className="flex items-center justify-between bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#E6DCCE]">
          <span className="text-xs font-bold text-[#182A4A] flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar size={14} className="text-[#C89B3C]" /> Select Period:
          </span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E6DCCE] text-xs font-bold text-[#182A4A] outline-none"
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx}>
                {m} {new Date().getFullYear()}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#E6DCCE] text-center space-y-1">
            <p className="text-[11px] text-[#9A8F7F] font-bold uppercase tracking-wider">Services Delivered</p>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#182A4A]">
              {summary.totalAppointments}
            </p>
          </div>

          <div className="bg-[#FAF2DE] rounded-2xl p-4 border border-[#C89B3C]/30 text-center space-y-1">
            <p className="text-[11px] text-[#C89B3C] font-extrabold uppercase tracking-wider">Gross Revenue</p>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#182A4A]">
              ₹{summary.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-[#E6EFEA] rounded-2xl p-4 border border-[#8EA89D]/30 text-center space-y-1">
            <p className="text-[11px] text-[#6C8E82] font-extrabold uppercase tracking-wider">Est. 20% Commission</p>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#182A4A]">
              ₹{commission.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#E6DCCE] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12 bg-[#FAF6EE]">
              <Loader size={150} />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-center text-xs text-[#5C6D88] py-10 bg-[#FAF6EE]">
              No service logs recorded for this month.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF6EE] text-left text-[10px] font-extrabold text-[#182A4A] uppercase tracking-wider border-b border-[#E6DCCE]">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3 text-right">Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF6EE]">
                  {appointments.map((a, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF6EE]/60 transition">
                      <td className="px-4 py-2.5 text-[#5C6D88]">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-[#182A4A]">
                        {a.customerName || "Walk-in Guest"}
                      </td>
                      <td className="px-4 py-2.5 text-[#C89B3C] font-semibold">
                        {a.serviceName || "Salon Service"}
                      </td>
                      <td className="px-4 py-2.5 font-extrabold text-[#182A4A] text-right">
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
