import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, DollarSign, CalendarDays } from "lucide-react";

const API_BASE = "http://localhost:3000/payments"; // ✅ Payment API base URL

const AdminDashboard = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility to get today's date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get all payments (for today’s revenue + appointments)
        const paymentsRes = await axios.get(`${API_BASE}`);
        const payments = paymentsRes.data || [];

        // Filter today’s payments
        const todayPayments = payments.filter((p) => {
          const d = new Date(p.date).toISOString().split("T")[0];
          return d === today;
        });

        // Calculate today’s revenue & appointments
        const totalRevenue = todayPayments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );
        setTodayRevenue(totalRevenue);
        setTodayAppointments(todayPayments.length);

        // 2️⃣ Calculate staff performance (revenue per employee)
        const staffMap = {};
        todayPayments.forEach((p) => {
          const employee =
            p.appointment_id?.employee_id?.name || "Unknown Staff";
          if (!staffMap[employee]) staffMap[employee] = 0;
          staffMap[employee] += p.amount || 0;
        });

        const staffArray = Object.entries(staffMap).map(([name, revenue]) => ({
          name,
          revenue,
        }));
        setStaffPerformance(staffArray);

        // 3️⃣ Fetch monthly revenue (grouped payments)
        const groupedRes = await axios.get(`${API_BASE}/grouped`);
        const grouped = groupedRes.data || [];

        // Convert grouped data for chart
        const monthly = grouped.map((g) => ({
          month: new Date(g._id).toLocaleString("default", { month: "short" }),
          revenue: g.total_amount,
        }));
        setMonthlyRevenue(monthly);

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );

  return (
    <div
      className="p-8 min-h-screen bg-gradient-to-br 
      from-[#FCD8CD] via-[#FEEBF6] to-[#EBD6FB] 
      text-gray-800"
    >
      <h1 className="text-4xl font-bold mb-8 text-[#687FE5] drop-shadow-sm">
        Admin Dashboard
      </h1>

      {/* ====== TOP CARDS ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Card 1 */}
        <div
          className="p-5 rounded-2xl shadow-md 
          bg-gradient-to-r from-[#EBD6FB]/80 to-[#FEEBF6]/70 
          border border-white/40 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#687FE5]">
              Today's Revenue
            </h2>
            <DollarSign className="text-[#687FE5]" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₹{todayRevenue.toLocaleString()}
          </p>
        </div>

        {/* Card 2 */}
        <div
          className="p-5 rounded-2xl shadow-md 
          bg-gradient-to-r from-[#FEEBF6]/80 to-[#FCD8CD]/70 
          border border-white/40 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#687FE5]">
              Today's Appointments
            </h2>
            <CalendarDays className="text-[#687FE5]" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {todayAppointments}
          </p>
        </div>

        {/* Card 3 */}
        <div
          className="p-5 rounded-2xl shadow-md 
          bg-gradient-to-r from-[#FCD8CD]/70 to-[#EBD6FB]/70 
          border border-white/40 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#687FE5]">
              Staff Count
            </h2>
            <Users className="text-[#687FE5]" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {staffPerformance.length}
          </p>
        </div>
      </div>

      {/* ====== STAFF PERFORMANCE ====== */}
      <div
        className="bg-white/60 rounded-2xl shadow-md border border-white/40 
        backdrop-blur-md p-6 mb-10"
      >
        <h2 className="text-2xl font-semibold text-[#687FE5] mb-4">
          Staff Performance (Today)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#EBD6FB]/50 text-left text-[#687FE5] text-sm uppercase">
                <th className="px-4 py-3 border-b border-[#EBD6FB]">
                  Staff Name
                </th>
                <th className="px-4 py-3 border-b border-[#EBD6FB]">
                  Revenue (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    No staff performance data for today.
                  </td>
                </tr>
              ) : (
                staffPerformance.map((staff, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b font-medium">
                      {staff.name}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {staff.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== MONTHLY REVENUE CHART ====== */}
      <div
        className="bg-white/60 rounded-2xl shadow-md border border-white/40 
        backdrop-blur-md p-6"
      >
        <h2 className="text-2xl font-semibold text-[#687FE5] mb-4">
          Monthly Revenue Overview
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBD6FB" />
              <XAxis dataKey="month" stroke="#687FE5" />
              <YAxis stroke="#687FE5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FEEBF6",
                  borderRadius: "10px",
                  border: "1px solid #EBD6FB",
                }}
              />
              <Bar dataKey="revenue" fill="#687FE5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
