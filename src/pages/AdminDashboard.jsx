import React from "react";
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

const AdminDashboard = () => {
  const todayRevenue = 12000;
  const todayAppointments = 32;

  const staffPerformance = [
    { name: "Dr. Sharma", revenue: 5000 },
    { name: "Dr. Patel", revenue: 3000 },
    { name: "Dr. Mehta", revenue: 2000 },
    { name: "Dr. Khan", revenue: 2000 },
  ];

  const monthlyRevenue = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 57000 },
    { month: "Jun", revenue: 63000 },
    { month: "Jul", revenue: 70000 },
    { month: "Aug", revenue: 75000 },
    { month: "Sep", revenue: 72000 },
    { month: "Oct", revenue: 68000 },
  ];

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
          <p className="text-3xl font-bold text-gray-800">
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
          <p className="text-3xl font-bold text-gray-800">
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
          <p className="text-3xl font-bold text-gray-800">
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
              {staffPerformance.map((staff, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#FEEBF6]/60 transition-all duration-200"
                >
                  <td className="px-4 py-3 border-b border-[#EBD6FB] font-medium">
                    {staff.name}
                  </td>
                  <td className="px-4 py-3 border-b border-[#EBD6FB]">
                    {staff.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
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
