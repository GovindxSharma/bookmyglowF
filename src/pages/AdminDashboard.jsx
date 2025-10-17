import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
          <p className="text-2xl font-bold text-gray-800">₹{todayRevenue.toLocaleString()}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-xl border-l-4 border-blue-500 p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Today's Appointments</h2>
            <CalendarDays className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{todayAppointments}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-xl border-l-4 border-purple-500 p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Staff Count</h2>
            <Users className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{staffPerformance.length}</p>
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
              {staffPerformance.map((staff, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b font-medium">{staff.name}</td>
                  <td className="px-4 py-3 border-b">{staff.revenue.toLocaleString()}</td>
                </tr>
              ))}
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
