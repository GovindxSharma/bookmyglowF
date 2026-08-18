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
import {
  Users,
  DollarSign,
  CalendarDays,
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight,
  Receipt,
  UserCheck,
} from "lucide-react";
import { BASE_URL, SALON_CONFIG } from "../data/data";
import Loader from "../components/Layout/Loader.jsx";
import EmployeePerformanceModal from "../components/Employee/EmployeePerformaceModal.jsx";
import MonthAppointmentsModal from "../components/Bookings/MonthAppointmentsModal.jsx";

const AdminDashboard = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [annualRevenue, setAnnualRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonthRange, setSelectedMonthRange] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch employees
        const empRes = await axios.get("/employee");
        const employees = empRes.data.employees || [];
        setEmployeeCount(employees.length);

        // Fetch today's payments
        const todayPaymentsRes = await axios.get(`/payments/date/${today}`);
        const todayPayments = todayPaymentsRes.data || [];
        const todayRev = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        setTodayRevenue(todayRev);
        setTodayAppointments(todayPayments.length);

        // Fetch staff performance
        const staffData = await Promise.all(
          employees.map(async (emp) => {
            try {
              const res = await axios.get(`/payments/employee/${emp._id}/${today}`);
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

        staffData.sort((a, b) => b.revenue - a.revenue);
        setStaffPerformance(staffData);

        // Fetch monthly revenue
        const groupedRes = await axios.get("/payments/grouped");
        const grouped = groupedRes.data || [];
        const revenueMap = new Map();
        let totalYear = 0;

        grouped.forEach((g) => {
          if (g._id) {
            const parts = g._id.split("-");
            const mIdx = parseInt(parts[1], 10) - 1;
            revenueMap.set(mIdx, g.total_amount || 0);
            totalYear += g.total_amount || 0;
          }
        });

        setAnnualRevenue(totalYear);

        const allMonths = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(currentYear, i).toLocaleString("default", {
            month: "short",
          }),
          monthIndex: i,
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
    const start = new Date(currentYear, monthIndex, 1).toISOString().split("T")[0];
    const end = new Date(currentYear, monthIndex + 1, 0).toISOString().split("T")[0];
    setSelectedMonthRange({ start, end });
  };

  const avgTicket =
    todayAppointments > 0 ? Math.round(todayRevenue / todayAppointments) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-[#FDFBF9]">
        <Loader size={180} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-[#FDFBF9] text-[#242A26]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3EF] border border-[#D9E4DD] text-xs font-semibold text-[#35473C] uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-[#4E6758]" /> Owner Dashboard
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2421]">
            Daily Business Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#68706B] mt-0.5">
            Track daily collections, client footfall, and stylist performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-2xl border border-[#EAE3D9] shadow-soft-sm text-xs font-medium text-[#4A524D]">
            📅 Date:{" "}
            <strong className="text-[#1F2421]">
              {new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}
            </strong>
          </div>
        </div>
      </div>

      {/* 4 TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            title: "Today's Revenue",
            value: `₹${todayRevenue.toLocaleString()}`,
            subtitle: "Cash, Card & UPI collected",
            icon: <DollarSign className="text-emerald-700 w-5 h-5" />,
            iconBg: "bg-emerald-50 border border-emerald-100",
          },
          {
            title: "Appointments Today",
            value: todayAppointments,
            subtitle: "Clients served today",
            icon: <CalendarDays className="text-[#4E6758] w-5 h-5" />,
            iconBg: "bg-[#EDF3EF] border border-[#D9E4DD]",
          },
          {
            title: "Average Bill Size",
            value: `₹${avgTicket.toLocaleString()}`,
            subtitle: "Average spend per client",
            icon: <Receipt className="text-[#9C7D64] w-5 h-5" />,
            iconBg: "bg-[#F6EFE9] border border-[#EDE2D8]",
          },
          {
            title: "Working Stylists",
            value: employeeCount,
            subtitle: "Active staff members",
            icon: <Users className="text-indigo-700 w-5 h-5" />,
            iconBg: "bg-indigo-50 border border-indigo-100",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 shadow-soft-sm border border-[#EAE3D9] flex flex-col justify-between hover:shadow-soft-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#68706B]">
                {card.title}
              </span>
              <div className={`p-2.5 ${card.iconBg} rounded-2xl`}>
                {card.icon}
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2421] mb-1">
                {card.value}
              </div>
              <p className="text-xs text-[#7D8480]">
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MONTHLY REVENUE CHART */}
      <div className="bg-white rounded-3xl shadow-soft-sm border border-[#EAE3D9] p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1F2421] flex items-center gap-2">
              <TrendingUp size={20} className="text-[#4E6758]" />
              Monthly Revenue Performance ({currentYear})
            </h2>
            <p className="text-xs text-[#68706B] mt-0.5">
              Click on any bar to see that month's appointment details
            </p>
          </div>
          <div className="text-xs bg-[#EDF3EF] border border-[#D9E4DD] px-3.5 py-1.5 rounded-full font-bold text-[#35473C]">
            Total Collected: ₹{annualRevenue.toLocaleString()}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyRevenue}
              margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F2ECE4" vertical={false} />
              <XAxis dataKey="month" stroke="#7D8480" fontSize={12} tickLine={false} />
              <YAxis stroke="#7D8480" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px solid #EAE3D9",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  padding: "8px 12px",
                  color: "#1F2421",
                }}
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Bar
                dataKey="revenue"
                fill="#4E6758"
                radius={[6, 6, 0, 0]}
                onClick={(data) => handleMonthClick(data.monthIndex)}
                className="cursor-pointer hover:opacity-85 transition"
              >
                <LabelList
                  dataKey="revenue"
                  position="top"
                  formatter={(val) => (val > 0 ? `₹${Number(val).toLocaleString()}` : "")}
                  style={{ fill: "#4E6758", fontSize: 11, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP STYLISTS TABLE */}
      <div className="bg-white rounded-3xl shadow-soft-sm border border-[#EAE3D9] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1F2421] flex items-center gap-2">
              <Award size={20} className="text-[#4E6758]" />
              Stylist Performance Today
            </h2>
            <p className="text-xs text-[#68706B] mt-0.5">
              Service revenue and client count per stylist
            </p>
          </div>
          <span className="text-xs font-semibold text-[#35473C] bg-[#EDF3EF] border border-[#D9E4DD] px-3 py-1 rounded-full">
            {staffPerformance.length} Staff on Duty
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F8F5F0] text-left text-xs font-bold text-[#4A524D] uppercase tracking-wider rounded-xl">
                <th className="px-4 py-3 rounded-l-xl">Stylist Name</th>
                <th className="px-4 py-3">Clients Served</th>
                <th className="px-4 py-3">Revenue Done</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-sm">
              {staffPerformance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400 text-sm">
                    No stylist records for today yet.
                  </td>
                </tr>
              ) : (
                staffPerformance.map((staff, idx) => (
                  <tr
                    key={staff._id}
                    className="hover:bg-[#FAF7F2] transition cursor-pointer"
                    onClick={() => setSelectedEmployee(staff)}
                  >
                    <td className="px-4 py-3.5 font-semibold text-[#1F2421]">
                      {idx === 0 && <span className="mr-1.5">⭐</span>}
                      {staff.name}
                    </td>

                    <td className="px-4 py-3.5 text-[#555E58]">
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#EDF3EF] text-[#35473C] px-2.5 py-0.5 rounded-full">
                        <UserCheck size={12} />
                        {staff.totalAppointments} clients
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-[#4E6758]">
                      ₹{staff.revenue.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(staff);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#35473C] bg-[#EDF3EF] hover:bg-[#E0ECE5] px-3.5 py-1.5 rounded-full transition"
                      >
                        View Breakdown <ArrowUpRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
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
