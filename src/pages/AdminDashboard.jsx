import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, DollarSign, CalendarDays } from "lucide-react";
import { BASE_URL } from "../data/data";
import Loader from "../components/Layout/Loader.jsx"; // Loader import

const PAYMENTS_API = `${BASE_URL}/payments`;
const EMPLOYEE_API = `${BASE_URL}/auth/employees`;

const AdminDashboard = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch employees
        const empRes = await axios.get(EMPLOYEE_API);
        const employees = empRes.data.employees || [];
        setEmployeeCount(employees.length);

        // Fetch today's payments
        const todayPaymentsRes = await axios.get(`${PAYMENTS_API}/date/${today}`);
        const todayPayments = todayPaymentsRes.data || [];
        setTodayRevenue(todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0));
        setTodayAppointments(todayPayments.length);

        // Staff performance
        const staffData = await Promise.all(
          employees.map(async (emp) => {
            try {
              const res = await axios.get(`${PAYMENTS_API}/employee/${emp._id}/${today}`);
              const summary = res.data.summary || {};
              return {
                name: emp.name,
                revenue: summary.total_amount || 0,
                totalAppointments: summary.total_payments || 0,
              };
            } catch {
              return { name: emp.name, revenue: 0, totalAppointments: 0 };
            }
          })
        );
        setStaffPerformance(staffData);

        // Monthly revenue
        const groupedRes = await axios.get(`${PAYMENTS_API}/grouped`);
        const grouped = groupedRes.data || [];
        const revenueMap = new Map();
        grouped.forEach((g) => {
          const monthIndex = new Date(g._id).getMonth();
          revenueMap.set(monthIndex, g.total_amount || 0);
        });
        const allMonths = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2025, i).toLocaleString("default", { month: "short" }),
          revenue: revenueMap.get(i) || 0,
        }));
        setMonthlyRevenue(allMonths);

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ===== Loader while fetching =====
  if (loading) return <Loader />;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#E7E9FB] via-[#F4F5FF] to-[#E7E9FB] text-[#3A3A3A] font-poppins">

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
          {
            title: "Today's Revenue",
            icon: <DollarSign className="text-[#5058B5]" />,
            value: `₹${todayRevenue.toLocaleString()}`,
            gradient: "from-[#E7E9FB]/90 to-[#F4F5FF]/90",
          },
          {
            title: "Today's Appointments",
            icon: <CalendarDays className="text-[#5058B5]" />,
            value: todayAppointments,
            gradient: "from-[#F4F5FF]/90 to-[#E7E9FB]/90",
          },
          {
            title: "Total Employees",
            icon: <Users className="text-[#5058B5]" />,
            value: employeeCount,
            gradient: "from-[#E7E9FB]/90 to-[#F4F5FF]/90",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-lg bg-gradient-to-r ${card.gradient} border border-white/60 backdrop-blur-md hover:shadow-xl transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#5058B5]">
                {card.title}
              </h2>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-[#3A3A3A]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* STAFF PERFORMANCE */}
      <div className="bg-white/70 rounded-2xl shadow-md border border-white/60 backdrop-blur-md p-6 mb-12">
        <h2 className="text-2xl font-semibold text-[#5058B5] mb-5">
          Staff Performance (Today)
        </h2>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#E7E9FB] text-left text-[#5058B5] text-sm uppercase">
                <th className="px-5 py-3 border-b border-[#E7E9FB]">Staff Name</th>
                <th className="px-5 py-3 border-b border-[#E7E9FB]">Revenue (₹)</th>
                <th className="px-5 py-3 border-b border-[#E7E9FB]">Appointments</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-gray-500 font-medium">
                    No performance data available for today.
                  </td>
                </tr>
              ) : (
                staffPerformance.map((staff, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#F4F5FF] transition-all border-b last:border-b-0"
                  >
                    <td className="px-5 py-3 font-medium">{staff.name}</td>
                    <td className="px-5 py-3">₹{staff.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3">{staff.totalAppointments}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MONTHLY REVENUE CHART */}
      <div className="bg-white/70 rounded-2xl shadow-md border border-white/60 backdrop-blur-md p-6">
        <h2 className="text-2xl font-semibold text-[#5058B5] mb-6">
          Monthly Revenue Overview
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E9FB" />
              <XAxis dataKey="month" stroke="#5058B5" />
              <YAxis stroke="#5058B5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F4F5FF",
                  borderRadius: "10px",
                  border: "1px solid #E7E9FB",
                  color: "#3A3A3A",
                }}
              />
              <Bar dataKey="revenue" fill="#636CCB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
