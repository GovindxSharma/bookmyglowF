import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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

  // ✅ alert state
  const [alertData, setAlertData] = useState({
    show: false,
    type: "info",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlertData({ show: true, type, message });
  };

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/employee`);
      setEmployees(res.data.employees || []);
      const map = {};
      (res.data.employees || []).forEach((emp) => (map[emp._id] = false));
      setAttendanceMap(map);
    } catch (err) {
      console.error("Error fetching employees:", err);
      showAlert("error", "Failed to load employees.");
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
      showAlert("error", "Failed to load attendance.");
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
      showAlert("success", "Attendance marked successfully!");
      if (selectedEmployee) fetchEmployeeAttendance(selectedEmployee._id);
    } catch (err) {
      console.error("Error marking attendance:", err);
      showAlert("error", "Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeClick = (emp) => {
    if (selectedEmployee?._id === emp._id) {
      setSelectedEmployee(null);
      setAttendanceRecords([]);
    } else {
      setSelectedEmployee(emp);
      fetchEmployeeAttendance(emp._id);
    }
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
      showAlert("success", "Attendance updated successfully!");
    } catch (err) {
      console.error("Error editing attendance:", err);
      showAlert("error", "Failed to update attendance.");
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

  if (loading) return <Loader fullscreen={true} size={250} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EDFF] via-[#F5F6FF] to-[#FFFFFF] p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Employee List */}
        <div className="w-full md:w-1/3 bg-white shadow-xl border border-[#E0E7FF] rounded-3xl p-6 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-[#3A3A3A] mb-4">
            Employee List
          </h2>

          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-2">
            {employees.map((emp) => (
              <div
                key={emp._id}
                onClick={() => handleEmployeeClick(emp)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedEmployee?._id === emp._id
                    ? "bg-[#E7ECFF] border-[#687FE5]"
                    : "bg-white hover:bg-[#F5F6FF] border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={attendanceMap[emp._id]}
                    onChange={() => handleCheckboxChange(emp._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 accent-[#687FE5]"
                  />
                  <span className="font-medium text-gray-800">{emp.name}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={markAttendance}
            className="mt-6 w-full py-3 bg-[#687FE5] text-white rounded-xl font-medium shadow-md hover:bg-[#5A6FD8] transition-all"
          >
            Mark Attendance
          </button>
        </div>

        {/* Attendance Calendar */}
        {selectedEmployee && (
          <div className="w-full md:w-2/3 bg-white shadow-xl border border-[#E0E7FF] rounded-3xl p-6 relative">
            <h2 className="text-xl font-semibold text-[#3A3A3A] mb-3">
              {selectedEmployee.name}'s Attendance
            </h2>

            <div className="flex items-center gap-6 mb-5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-400 rounded-full"></span>{" "}
                Present
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-400 rounded-full"></span> Leave
              </div>
            </div>

            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-lg hover:bg-[#F5F6FF] text-[#687FE5]"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium text-gray-700">
                {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                {currentMonth.getFullYear()}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 rounded-lg hover:bg-[#F5F6FF] text-[#687FE5]"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="font-semibold text-sm text-gray-500 uppercase"
                >
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((day) => {
                const status = getDayStatus(day);
                const classes =
                  status === "present"
                    ? "bg-green-400 text-white"
                    : status === "leave"
                    ? "bg-red-400 text-white"
                    : "bg-gray-100 text-gray-600";
                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${classes} hover:ring-2 hover:ring-[#687FE5]/40 transition-transform hover:scale-105`}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>

            {editRecord && (
              <>
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 border border-[#E0E7FF] rounded-3xl shadow-2xl p-6 z-50 w-80">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">
                      Edit Attendance
                    </h3>
                    <button
                      onClick={() => setEditRecord(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Date: {editRecord.date.toDateString()}
                  </p>
                  <label className="flex items-center gap-2 mb-5 text-gray-700">
                    <input
                      type="checkbox"
                      checked={editRecord.leave}
                      onChange={(e) =>
                        setEditRecord((prev) => ({
                          ...prev,
                          leave: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 accent-[#687FE5]"
                    />
                    Mark as Leave
                  </label>
                  <button
                    onClick={saveEdit}
                    className="w-full py-2.5 bg-[#687FE5] text-white rounded-xl hover:bg-[#5A6FD8] transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ✅ Global Alert */}
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
