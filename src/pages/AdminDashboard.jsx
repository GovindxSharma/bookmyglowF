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
  LabelList,
} from "recharts";
import { Users, DollarSign, CalendarDays } from "lucide-react";
import { BASE_URL } from "../data/data";
import Loader from "../components/Layout/Loader.jsx";
import EmployeePerformanceModal from "../components/Employee/EmployeePerformaceModal.jsx";
import MonthAppointmentsModal from "../components/Bookings/MonthAppointmentsModal.jsx";

const PAYMENTS_API = `${BASE_URL}/payments`;
const EMPLOYEE_API = `${BASE_URL}/employee`;

const AdminDashboard = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonthRange, setSelectedMonthRange] = useState(null);

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
        const todayPaymentsRes = await axios.get(
          `${PAYMENTS_API}/date/${today}`
        );
        const todayPayments = todayPaymentsRes.data || [];
        setTodayRevenue(
          todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
        );
        setTodayAppointments(todayPayments.length);

        // Fetch staff performance
        const staffData = await Promise.all(
          employees.map(async (emp) => {
            try {
              const res = await axios.get(
                `${PAYMENTS_API}/employee/${emp._id}/${today}`
              );
              return {
                _id: emp._id,
                name: emp.name,
                revenue: res.data.total_employee_amount || 0,
                totalAppointments: res.data.total_appointments || 0,
              };
            } catch {
              return {
                _id: emp._id,
                name: emp.name,
                revenue: 0,
                totalAppointments: 0,
              };
            }
          })
        );
        setStaffPerformance(staffData);

        // Fetch monthly revenue
        const groupedRes = await axios.get(`${PAYMENTS_API}/grouped`);
        const grouped = groupedRes.data || [];
        const revenueMap = new Map();
        grouped.forEach((g) => {
          const monthIndex = new Date(g._id).getMonth();
          revenueMap.set(monthIndex, g.total_amount || 0);
        });
        const allMonths = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2025, i).toLocaleString("default", {
            month: "short",
          }),
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

  const handleMonthClick = (monthIndex) => {
    const year = new Date().getFullYear();
    const start = new Date(year, monthIndex, 1).toISOString().split("T")[0];
    const end = new Date(year, monthIndex + 1, 0).toISOString().split("T")[0];
    setSelectedMonthRange({ start, end });
  };

  if (loading) return <Loader size={250} />;

  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-gradient-to-b from-[#f0f4ff] to-[#ffffff] font-poppins text-[#3A3A3A]">
      {/* ===== TOP METRIC CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Today's Revenue",
            icon: <DollarSign className="text-white w-6 h-6" />,
            value: `₹${todayRevenue.toLocaleString()}`,
            bg: "bg-gradient-to-r from-[#636CCB] to-[#5058B5]",
          },
          {
            title: "Today's Appointments",
            icon: <CalendarDays className="text-white w-6 h-6" />,
            value: todayAppointments,
            bg: "bg-gradient-to-r from-[#FF7E5F] to-[#FD3A69]",
          },
          {
            title: "Total Employees",
            icon: <Users className="text-white w-6 h-6" />,
            value: employeeCount,
            bg: "bg-gradient-to-r from-[#00C6FF] to-[#0072FF]",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`${card.bg} rounded-2xl shadow-xl p-6 flex items-center justify-between transition transform hover:-translate-y-1 hover:shadow-2xl`}
          >
            <div>
              <h3 className="text-white font-medium text-sm sm:text-base">
                {card.title}
              </h3>
              <p className="text-white font-bold text-xl sm:text-2xl mt-1">
                {card.value}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* ===== STAFF PERFORMANCE ===== */}
      <div className="mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold text-[#5058B5] mb-4">
          Staff Performance (Today)
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md p-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#f0f4ff] text-left text-[#5058B5] text-sm uppercase">
                <th className="px-4 py-3 border-b border-[#e0e0e0]">
                  Staff Name
                </th>
                <th className="px-4 py-3 border-b border-[#e0e0e0]">
                  Revenue (₹)
                </th>
                <th className="px-4 py-3 border-b border-[#e0e0e0]">
                  Appointments
                </th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No performance data available.
                  </td>
                </tr>
              ) : (
                staffPerformance.map((staff, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#f5f8ff] transition-all border-b last:border-b-0 cursor-pointer"
                    onClick={() => setSelectedEmployee(staff)}
                  >
                    <td className="px-4 py-3 font-medium">{staff.name}</td>
                    <td className="px-4 py-3 font-semibold text-[#636CCB]">
                      ₹{staff.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{staff.totalAppointments}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {staffPerformance.length === 0 ? (
            <div className="text-center text-gray-500 font-medium py-6 rounded-xl bg-white shadow-md">
              No performance data available.
            </div>
          ) : (
            staffPerformance.map((staff, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white shadow-md border-l-4 border-[#636CCB] cursor-pointer"
                onClick={() => setSelectedEmployee(staff)}
              >
                <h3 className="font-semibold text-[#5058B5]">{staff.name}</h3>
                <p className="text-gray-700 mt-1 text-sm">
                  Revenue: ₹{staff.revenue.toLocaleString()}
                </p>
                <p className="text-gray-700 text-sm">
                  Appointments: {staff.totalAppointments}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== MONTHLY REVENUE ===== */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold text-[#5058B5] mb-4">
          Monthly Revenue Overview
        </h2>

        {/* Desktop Chart */}
        <div className="hidden md:block h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyRevenue}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#5058B5" />
              <YAxis stroke="#5058B5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f0f4ff",
                  borderRadius: "10px",
                  border: "1px solid #e0e0e0",
                  color: "#3A3A3A",
                }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Bar
                dataKey="revenue"
                fill="#636CCB"
                radius={[6, 6, 0, 0]}
                onClick={(data, index) => handleMonthClick(index)}
              >
                <LabelList
                  dataKey="revenue"
                  position="top"
                  formatter={(val) => `₹${val.toLocaleString()}`}
                  style={{ fill: "#5058B5", fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mobile: Monthly Cards */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {monthlyRevenue.map((m, idx) => {
            const maxRevenue =
              Math.max(...monthlyRevenue.map((r) => r.revenue)) || 1;
            const widthPercent = (m.revenue / maxRevenue) * 100;
            return (
              <div
                key={idx}
                className="bg-[#f0f4ff] rounded-xl p-3 shadow-sm flex flex-col cursor-pointer"
                onClick={() => handleMonthClick(idx)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#5058B5] font-semibold">
                    {m.month}
                  </span>
                  <span className="text-[#636CCB] font-bold">
                    ₹{m.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-[#d0d4eb] h-3 rounded-full">
                  <div
                    className="bg-[#636CCB] h-3 rounded-full"
                    style={{ width: `${widthPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {selectedEmployee && (
        <EmployeePerformanceModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {selectedMonthRange && (
        <MonthAppointmentsModal
          startDate={selectedMonthRange.start}
          endDate={selectedMonthRange.end}
          onClose={() => setSelectedMonthRange(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
