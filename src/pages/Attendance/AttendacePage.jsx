import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { ChevronLeft, ChevronRight, X, UserCheck, Calendar, Clock, Check, Sparkles } from "lucide-react";
import { BASE_URL } from "../../data/data";
import Loader from "../../components/Layout/Loader.jsx";
import Alert from "../../components/Layout/Alert.jsx";

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editRecord, setEditRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const [alertData, setAlertData] = useState({
    show: false,
    type: "info",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlertData({ show: true, type, message });
    setTimeout(() => setAlertData((prev) => ({ ...prev, show: false })), 3000);
  };

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/employee`);
      const empList = res.data.employees || [];
      setEmployees(empList);
      const map = {};
      empList.forEach((emp) => (map[emp._id] = true)); // Default all present
      setAttendanceMap(map);

      if (empList.length > 0) {
        setSelectedEmployee(empList[0]);
        fetchEmployeeAttendance(empList[0]._id);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      showAlert("error", "Failed to load staff roster.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance for selected employee
  const fetchEmployeeAttendance = async (empId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/attendance/employee/${empId}`);
      setAttendanceRecords(res.data || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      showAlert("error", "Failed to load employee calendar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCheckboxChange = (id) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAttendance = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    try {
      for (const empId in attendanceMap) {
        await axios.post(`${BASE_URL}/attendance`, {
          employee_id: empId,
          date: today,
          leave: !attendanceMap[empId],
        });
      }
      showAlert("success", "Today's attendance saved successfully! ✨");
      if (selectedEmployee) fetchEmployeeAttendance(selectedEmployee._id);
    } catch (err) {
      console.error("Error marking attendance:", err);
      showAlert("error", "Failed to save attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeClick = (emp) => {
    setSelectedEmployee(emp);
    fetchEmployeeAttendance(emp._id);
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const getDayStatus = (date) => {
    const record = attendanceRecords.find(
      (r) => new Date(r.date).toDateString() === date.toDateString()
    );
    if (!record) return null;
    return record.leave ? "leave" : "present";
  };

  const handleDateClick = (date) => {
    const record = attendanceRecords.find(
      (r) => new Date(r.date).toDateString() === date.toDateString()
    );
    if (record) {
      setEditRecord({ id: record._id, leave: record.leave, date });
    }
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/attendance/${editRecord.id}`, {
        leave: editRecord.leave,
      });
      setEditRecord(null);
      if (selectedEmployee) fetchEmployeeAttendance(selectedEmployee._id);
      showAlert("success", "Attendance status updated!");
    } catch (err) {
      console.error("Error editing attendance:", err);
      showAlert("error", "Failed to update record.");
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const presentDaysCount = attendanceRecords.filter((r) => !r.leave).length;
  const leaveDaysCount = attendanceRecords.filter((r) => r.leave).length;

  if (loading && employees.length === 0) {
    return <Loader fullscreen={true} size={220} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#242A26] p-4 sm:p-6 md:p-10 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-soft-sm">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#1F2421] flex items-center gap-2">
              <Clock size={22} className="text-[#4E6758]" /> Staff Attendance & Roster
            </h1>
            <p className="text-xs text-[#68706B] mt-0.5">
              Mark daily attendance, manage stylist leaves, and view monthly logs
            </p>
          </div>

          <button
            onClick={markAttendance}
            className="px-5 py-2.5 rounded-2xl bg-[#4E6758] hover:bg-[#405448] text-white font-semibold text-xs transition duration-200 flex items-center justify-center gap-2 shadow-soft-sm"
          >
            <Check size={15} />
            <span>Save Today's Attendance</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Employee Roster Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D9] shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3">
              <h2 className="font-heading text-base font-bold text-[#1F2421]">
                Stylist Team ({employees.length})
              </h2>
              <span className="text-[11px] text-[#7D8480]">Check = Present</span>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {employees.map((emp) => {
                const isSelected = selectedEmployee?._id === emp._id;
                const isPresent = attendanceMap[emp._id];

                return (
                  <div
                    key={emp._id}
                    onClick={() => handleEmployeeClick(emp)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#EDF3EF] border-[#4E6758] shadow-xs"
                        : "bg-[#FDFBF9] hover:bg-[#F8F5F0] border-[#EAE3D9]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isPresent}
                        onChange={() => handleCheckboxChange(emp._id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded text-[#4E6758] accent-[#4E6758] cursor-pointer"
                      />
                      <div>
                        <span className="font-semibold text-xs text-[#1F2421] block">
                          {emp.name}
                        </span>
                        <span className="text-[11px] text-[#7D8480]">
                          {emp.phone || "Stylist"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPresent
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {isPresent ? "Present" : "On Leave"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Calendar View */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] shadow-soft-sm space-y-6">
            {selectedEmployee ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE4] pb-4">
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1F2421]">
                      {selectedEmployee.name}'s Attendance Log
                    </h2>
                    <p className="text-xs text-[#68706B]">
                      Click on any highlighted day to edit present/leave status
                    </p>
                  </div>

                  {/* Summary Badges */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Present: {presentDaysCount} days
                    </span>
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                      Leaves: {leaveDaysCount} days
                    </span>
                  </div>
                </div>

                {/* Month Navigator */}
                <div className="flex items-center justify-between bg-[#F8F5F0] p-2.5 rounded-2xl border border-[#EAE3D9]">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-1.5 rounded-xl hover:bg-white text-[#4E6758] transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="font-bold text-sm text-[#1F2421]">
                    {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                    {currentMonth.getFullYear()}
                  </span>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-1.5 rounded-xl hover:bg-white text-[#4E6758] transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Calendar Days Grid */}
                <div>
                  <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div
                        key={day}
                        className="font-bold text-xs text-[#7D8480] uppercase tracking-wider"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center">
                    {generateCalendarDays().map((day) => {
                      const status = getDayStatus(day);
                      let styleClasses = "bg-[#FDFBF9] text-[#555E58] border border-[#EAE3D9]";

                      if (status === "present") {
                        styleClasses = "bg-[#EDF3EF] text-[#35473C] border border-[#4E6758] font-bold shadow-xs";
                      } else if (status === "leave") {
                        styleClasses = "bg-rose-50 text-rose-700 border border-rose-300 font-bold";
                      }

                      return (
                        <div
                          key={day.toISOString()}
                          onClick={() => handleDateClick(day)}
                          className={`h-11 sm:h-12 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 ${styleClasses}`}
                        >
                          <span className="text-xs sm:text-sm">{day.getDate()}</span>
                          {status && (
                            <span className="text-[9px] uppercase font-bold">
                              {status === "present" ? "P" : "L"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-[#7D8480]">
                <Calendar size={32} className="mx-auto mb-2 text-[#4E6758] opacity-50" />
                <p className="font-semibold text-sm">Select a stylist on the left to view their calendar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Record Modal */}
      {editRecord && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl shadow-soft-lg p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#F2ECE4] pb-3">
              <h3 className="font-heading text-base font-bold text-[#1F2421]">
                Edit Attendance
              </h3>
              <button
                onClick={() => setEditRecord(null)}
                className="text-[#7D8480] hover:text-[#1F2421]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#68706B]">
              Date: <strong className="text-[#1F2421]">{editRecord.date.toDateString()}</strong>
            </p>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#FDFBF9] border border-[#EAE3D9] cursor-pointer">
              <input
                type="checkbox"
                checked={editRecord.leave}
                onChange={(e) =>
                  setEditRecord((prev) => ({
                    ...prev,
                    leave: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded accent-[#4E6758]"
              />
              <span className="text-xs font-semibold text-[#1F2421]">Mark as On Leave</span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditRecord(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#F2ECE4] text-[#4A524D] text-xs font-semibold hover:bg-[#EAE3D9] transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2.5 rounded-xl bg-[#4E6758] text-white text-xs font-semibold hover:bg-[#405448] transition shadow-soft-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Alert
        type={alertData.type}
        message={alertData.message}
        show={alertData.show}
        onClose={() => setAlertData((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default AttendancePage;
