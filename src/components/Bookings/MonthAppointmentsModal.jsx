import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { X } from "lucide-react";
import { BASE_URL } from "../../data/data";
import Loader from "../Layout/Loader.jsx";

const MonthAppointmentsModal = ({ startDate, endDate, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/appointments/?date_start=${startDate}&date_end=${endDate}&for_notification=false`
        );

        // Assuming API returns { appointments: [...] }
        const data = res.data.appointments || [];

        setAppointments(data);

        // Calculate total revenue
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

  if (loading) return <Loader size={150} />;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-20">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-5xl p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-[#5058B5] mb-4">
          Appointments from {startDate} to {endDate}
        </h2>

        {/* Totals */}
        <div className="flex justify-between mb-4">
          <p className="font-medium">
            Total Appointments: {appointments.length}
          </p>
          <p className="font-medium">
            Total Revenue: ₹{totalRevenue.toLocaleString()}
          </p>
        </div>

        {/* Appointment Table */}
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#f0f4ff] text-left text-[#5058B5] text-sm uppercase">
                <th className="px-4 py-2 border-b">S.No</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Customer Name</th>
                <th className="px-4 py-2 border-b">Service</th>
                <th className="px-4 py-2 border-b">Employee</th>
                <th className="px-4 py-2 border-b">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((app, idx) => (
                  <tr
                    key={app._id}
                    className="hover:bg-[#f5f8ff] transition-all border-b last:border-b-0"
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{app.customer?.name || "-"}</td>
                    <td className="px-4 py-2">
                      {app.services
                        ?.map((s) => s.service_id?.name || "")
                        .join(", ")}
                    </td>
                    <td className="px-4 py-2">
                      {app.services?.[0]?.employee_id?.name || "-"}
                    </td>
                    <td className="px-4 py-2">{app.amount || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthAppointmentsModal;
