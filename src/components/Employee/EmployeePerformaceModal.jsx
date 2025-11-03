import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import Loader from "../Layout/Loader.jsx";

const EmployeePerformanceModal = ({ employee, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-indexed
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

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-11/12 md:w-3/4 max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          {employee.name} - Performance
        </h2>

        {/* Month Dropdown */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="flex gap-6 mb-6">
          <div className="bg-[#f0f4ff] rounded-xl p-4 flex-1 text-center">
            <p className="text-gray-700 font-medium">Total Appointments</p>
            <p className="text-[#636CCB] font-bold text-2xl">
              {summary.totalAppointments}
            </p>
          </div>
          <div className="bg-[#f0f4ff] rounded-xl p-4 flex-1 text-center">
            <p className="text-gray-700 font-medium">Total Revenue</p>
            <p className="text-[#636CCB] font-bold text-2xl">
              ₹{summary.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader size={250} />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No appointments for this month.
            </p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#f0f4ff] text-left text-gray-700 uppercase text-sm">
                  <th className="px-4 py-2 border-b border-gray-200">Date</th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    Customer
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    Service
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">Amount</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2">
                      {new Date(a.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{a.customerName}</td>
                    <td className="px-4 py-2">{a.serviceName}</td>
                    <td className="px-4 py-2 font-semibold">
                      ₹{a.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformanceModal;
