import React, { useEffect, useState } from "react";
import axios from "axios";
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

const PAYMENTS_API =`${BASE_URL}/payments`;
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

        // ===== 1️⃣ Fetch all employees =====
        const empRes = await axios.get(EMPLOYEE_API);
        const employees = empRes.data.employees || [];
        setEmployeeCount(employees.length);

        // ===== 2️⃣ Fetch payments for today (total revenue & appointments) =====
        const todayPaymentsRes = await axios.get(`${PAYMENTS_API}/date/${today}`);
        const todayPayments = todayPaymentsRes.data || [];

        setTodayRevenue(
          todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
        );
        setTodayAppointments(todayPayments.length);

        // ===== 3️⃣ Staff performance =====
        const staffDataPromises = employees.map(async (emp) => {
          try {
            const res = await axios.get(
              `${PAYMENTS_API}/employee/${emp._id}/${today}`
            );
            const summary = res.data.summary || {};
            return {
              name: emp.name,
              revenue: summary.total_amount || 0,
              totalAppointments: summary.total_payments || 0,
            };
          } catch (err) {
            // Employee might have 0 payments
            return { name: emp.name, revenue: 0, totalAppointments: 0 };
          }
        });

        const staffData = await Promise.all(staffDataPromises);
        setStaffPerformance(staffData);

       // ===== 4️⃣ Monthly revenue (Ensure all 12 months) =====
const groupedRes = await axios.get(`${PAYMENTS_API}/grouped`);
const grouped = groupedRes.data || [];

// Create map from API result (monthIndex: total_amount)
const revenueMap = new Map();
grouped.forEach((g) => {
  const date = new Date(g._id);
  const monthIndex = date.getMonth(); // 0–11
  revenueMap.set(monthIndex, g.total_amount || 0);
});

// Generate data for all 12 months
const allMonths = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i).toLocaleString("default", { month: "short" }),
  revenue: revenueMap.get(i) || 0,
}));

setMonthlyRevenue(allMonths);


        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
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
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#FCD8CD] via-[#FEEBF6] to-[#EBD6FB] text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-[#687FE5] drop-shadow-sm">
        Admin Dashboard
      </h1>

      {/* ===== TOP CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="p-5 rounded-2xl shadow-md bg-gradient-to-r from-[#EBD6FB]/80 to-[#FEEBF6]/70 border border-white/40 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#687FE5]">Today's Revenue</h2>
            <DollarSign className="text-[#687FE5]" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₹{todayRevenue.toLocaleString()}
          </p>
        </div>

        <div className="p-5 rounded-2xl shadow-md bg-gradient-to-r from-[#FEEBF6]/80 to-[#FCD8CD]/70 border border-white/40 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#687FE5]">Today's Appointments</h2>
            <CalendarDays className="text-[#687FE5]" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{todayAppointments}</p>
        </div>

        <div className="p-5 rounded-2xl shadow-md bg-gradient-to-r from-[#FCD8CD]/70 to-[#EBD6FB]/70 border border-white/40 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#687FE5]">Total Employees</h2>
            <Users className="text-[#687FE5]" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{employeeCount}</p>
        </div>
      </div>

      {/* ===== STAFF PERFORMANCE ===== */}
      <div className="bg-white/60 rounded-2xl shadow-md border border-white/40 backdrop-blur-md p-6 mb-10">
        <h2 className="text-2xl font-semibold text-[#687FE5] mb-4">
          Staff Performance (Today)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#EBD6FB]/50 text-left text-[#687FE5] text-sm uppercase">
                <th className="px-4 py-3 border-b border-[#EBD6FB]">Staff Name</th>
                <th className="px-4 py-3 border-b border-[#EBD6FB]">Revenue (₹)</th>
                <th className="px-4 py-3 border-b border-[#EBD6FB]">Appointments</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No staff performance data for today.
                  </td>
                </tr>
              ) : (
                staffPerformance.map((staff, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b font-medium">{staff.name}</td>
                    <td className="px-4 py-3 border-b">{staff.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 border-b">{staff.totalAppointments}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MONTHLY REVENUE CHART ===== */}
      <div className="bg-white/60 rounded-2xl shadow-md border border-white/40 backdrop-blur-md p-6">
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
