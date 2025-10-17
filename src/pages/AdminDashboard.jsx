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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* ====== TOP CARDS ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-xl border-l-4 border-green-500 p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Today's Revenue</h2>
            <DollarSign className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₹{todayRevenue.toLocaleString()}
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-xl border-l-4 border-blue-500 p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Today's Appointments</h2>
            <CalendarDays className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {todayAppointments}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-xl border-l-4 border-purple-500 p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Staff Count</h2>
            <Users className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {staffPerformance.length}
          </p>
        </div>
      </div>

      {/* ====== STAFF PERFORMANCE ====== */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Staff Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
                <th className="px-4 py-3 border-b">Staff Name</th>
                <th className="px-4 py-3 border-b">Revenue Generated (₹)</th>
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
      <div className="bg-white shadow-md rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
