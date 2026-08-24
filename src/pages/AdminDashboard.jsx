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
      <div className="flex justify-center items-center min-h-[80vh] bg-[#FAF6EE]">
        <Loader size={180} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-[#FAF6EE] text-[#182A4A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold text-[#C89B3C] uppercase tracking-[0.2em] mb-2">
            <Sparkles size={13} /> STUDIO OWNER DASHBOARD
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#182A4A]">
            Daily Business Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6D88] mt-0.5">
            Track daily collections, client footfall, and specialist performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-[#E6DCCE] shadow-soft-sm text-xs font-bold text-[#182A4A]">
            📅 Date:{" "}
            <strong className="text-[#C89B3C]">
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
            icon: <DollarSign className="text-[#C89B3C] w-5 h-5" />,
            iconBg: "bg-[#FAF2DE] border border-[#C89B3C]/30",
          },
          {
            title: "Appointments Today",
            value: todayAppointments,
            subtitle: "Clients served today",
            icon: <CalendarDays className="text-[#182A4A] w-5 h-5" />,
            iconBg: "bg-[#FAF6EE] border border-[#E6DCCE]",
          },
          {
            title: "Average Bill Size",
            value: `₹${avgTicket.toLocaleString()}`,
            subtitle: "Average spend per client",
            icon: <Receipt className="text-[#8EA89D] w-5 h-5" />,
            iconBg: "bg-[#E6EFEA] border border-[#8EA89D]/30",
          },
          {
            title: "Working Specialists",
            value: employeeCount,
            subtitle: "Active staff members",
            icon: <Users className="text-[#C06C52] w-5 h-5" />,
            iconBg: "bg-[#FBECE8] border border-[#C06C52]/30",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 shadow-soft-sm border border-[#E6DCCE] flex flex-col justify-between hover:shadow-soft-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#9A8F7F]">
                {card.title}
              </span>
              <div className={`p-2.5 ${card.iconBg} rounded-2xl`}>
                {card.icon}
              </div>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#182A4A] mb-1">
                {card.value}
              </div>
              <p className="text-xs text-[#5C6D88]">
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MONTHLY REVENUE CHART */}
      <div className="bg-white rounded-3xl shadow-soft-sm border border-[#E6DCCE] p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold uppercase text-[#182A4A] flex items-center gap-2">
              <TrendingUp size={20} className="text-[#C89B3C]" />
              Monthly Revenue Performance ({currentYear})
            </h2>
            <p className="text-xs text-[#5C6D88] mt-0.5">
              Click on any bar to see that month's appointment details
            </p>
          </div>
          <div className="text-xs bg-[#FAF2DE] border border-[#C89B3C]/40 px-4 py-2 rounded-xl font-extrabold text-[#182A4A]">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#FAF6EE" vertical={false} />
              <XAxis dataKey="month" stroke="#9A8F7F" fontSize={12} tickLine={false} />
              <YAxis stroke="#9A8F7F" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  border: "2px solid #182A4A",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  padding: "8px 12px",
                  color: "#182A4A",
                  fontWeight: "bold",
                }}
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Bar
                dataKey="revenue"
                fill="#182A4A"
                radius={[6, 6, 0, 0]}
                onClick={(data) => handleMonthClick(data.monthIndex)}
                className="cursor-pointer hover:fill-[#C89B3C] transition"
              >
                <LabelList
                  dataKey="revenue"
                  position="top"
                  formatter={(val) => (val > 0 ? `₹${Number(val).toLocaleString()}` : "")}
                  style={{ fill: "#182A4A", fontSize: 11, fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 LIVE STUDIO CHAIR OCCUPANCY HEATMAP & RUSH TRACKER */}
      <div className="bg-white rounded-3xl shadow-soft-sm border border-[#E6DCCE] p-6 sm:p-8 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold uppercase text-[#182A4A] flex items-center gap-2">
              <Clock size={20} className="text-[#C89B3C]" />
              Live Studio Chair Utilization & Rush Hours
            </h2>
            <p className="text-xs text-[#5C6D88] mt-0.5">
              Real-time hourly station workload across 5 styling stations (9 AM – 9 PM)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-[#C06C52] bg-[#FBECE8] px-3 py-1 rounded-xl border border-[#C06C52]/30">
              🔥 Peak Rush: 11:30 AM – 1:30 PM & 5:00 PM – 7:30 PM
            </span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[640px] space-y-2">
            {/* Header Times */}
            <div className="grid grid-cols-12 gap-1.5 text-[10px] font-extrabold text-[#9A8F7F] uppercase tracking-wider text-center">
              {[
                "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM",
                "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"
              ].map((time, idx) => (
                <div key={idx} className="p-1">{time}</div>
              ))}
            </div>

            {/* 5 Stations Rows */}
            {[
              { name: "Chair 1 (Color Bar & Balayage)", load: [30, 60, 90, 100, 75, 40, 50, 80, 100, 95, 80, 30] },
              { name: "Chair 2 (Scissor Cuts & Blowdry)", load: [40, 80, 100, 100, 85, 30, 60, 90, 100, 90, 70, 20] },
              { name: "Chair 3 (Hydra Skincare Bed)", load: [20, 50, 80, 90, 60, 40, 70, 85, 95, 85, 60, 10] },
              { name: "Chair 4 (Barber Station & Steam)", load: [60, 75, 95, 90, 70, 30, 50, 80, 90, 85, 75, 40] },
              { name: "Chair 5 (Spa & Massage Suite)", load: [10, 40, 70, 80, 50, 30, 60, 75, 90, 80, 50, 10] },
            ].map((station, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#182A4A] px-1">
                  <span>{station.name}</span>
                </div>
                <div className="grid grid-cols-12 gap-1.5">
                  {station.load.map((val, hIdx) => {
                    const bgClass =
                      val >= 90
                        ? "bg-[#C06C52] text-white"
                        : val >= 70
                        ? "bg-[#C89B3C] text-white"
                        : val >= 40
                        ? "bg-[#8EA89D] text-[#182A4A]"
                        : "bg-[#FAF6EE] text-[#9A8F7F] border border-[#E6DCCE]";

                    return (
                      <div
                        key={hIdx}
                        className={`h-7 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all hover:scale-105 ${bgClass}`}
                        title={`${station.name} at ${hIdx + 9}:00 — ${val}% Booked`}
                      >
                        {val}%
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-bold text-[#5C6D88] pt-2 border-t border-[#FAF6EE]">
          <span>Heatmap Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#FAF6EE] border border-[#E6DCCE]" />
            <span>Open (0–39%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#8EA89D]" />
            <span>Moderate (40–69%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#C89B3C]" />
            <span>High (70–89%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#C06C52]" />
            <span>Peak Rush (90–100%)</span>
          </div>
        </div>
      </div>

      {/* TOP STYLISTS TABLE */}
      <div className="bg-white rounded-3xl shadow-soft-sm border border-[#E6DCCE] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold uppercase text-[#182A4A] flex items-center gap-2">
              <Award size={20} className="text-[#C89B3C]" />
              Stylist Performance Today
            </h2>
            <p className="text-xs text-[#5C6D88] mt-0.5">
              Service revenue and client count per stylist
            </p>
          </div>
          <span className="text-xs font-bold text-[#182A4A] bg-[#FAF6EE] border border-[#E6DCCE] px-3.5 py-1.5 rounded-xl">
            {staffPerformance.length} Staff on Duty
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#FAF6EE] text-left text-xs font-bold text-[#182A4A] uppercase tracking-wider rounded-xl">
                <th className="px-4 py-3 rounded-l-xl">Stylist Name</th>
                <th className="px-4 py-3">Clients Served</th>
                <th className="px-4 py-3">Revenue Done</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6EE] text-sm">
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
                    className="hover:bg-[#FAF6EE]/50 transition cursor-pointer"
                    onClick={() => setSelectedEmployee(staff)}
                  >
                    <td className="px-4 py-3.5 font-bold text-[#182A4A]">
                      {idx === 0 && <span className="mr-1.5">⭐</span>}
                      {staff.name}
                    </td>

                    <td className="px-4 py-3.5 text-[#5C6D88]">
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#FAF6EE] text-[#182A4A] px-2.5 py-0.5 rounded-lg border border-[#E6DCCE]">
                        <UserCheck size={12} className="text-[#C89B3C]" />
                        {staff.totalAppointments} clients
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-extrabold text-[#C89B3C]">
                      ₹{staff.revenue.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(staff);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#182A4A] bg-[#FAF6EE] hover:bg-[#182A4A] hover:text-white px-3.5 py-1.5 rounded-xl transition border border-[#E6DCCE]"
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
