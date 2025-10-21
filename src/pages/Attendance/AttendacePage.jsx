// src/pages/Attendance/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BASE_URL } from "../../data/data";

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editRecord, setEditRecord] = useState(null); // {id, leave, date}

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/employees`);
      setEmployees(res.data.employees);
      const initialMap = {};
      res.data.employees.forEach((emp) => (initialMap[emp._id] = false));
      setAttendanceMap(initialMap);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleCheckboxChange = (id) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      for (const empId in attendanceMap) {
        await axios.post(`${BASE_URL}/attendance`, {
          employee_id: empId,
          date: today,
          leave: !attendanceMap[empId],
        });
      }
      alert("Attendance marked successfully!");
      if (selectedEmployee) fetchEmployeeAttendance(selectedEmployee._id);
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance.");
    }
  };

  const fetchEmployeeAttendance = async (empId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/attendance/employee/${empId}`
      );
      setAttendanceRecords(res.data);
    } catch (err) {
      console.error("Error fetching employee attendance:", err);
    }
  };

  const handleEmployeeClick = (emp) => {
    if (selectedEmployee && selectedEmployee._id === emp._id) {
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
    if (!record) return; // no record to edit
    setEditRecord({ id: record._id, leave: record.leave, date });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${BASE_URL}/attendance/${editRecord.id}`, {
        leave: editRecord.leave,
      });
      setEditRecord(null);
      if (selectedEmployee) fetchEmployeeAttendance(selectedEmployee._id);
    } catch (err) {
      console.error("Error editing attendance:", err);
      alert("Failed to update attendance.");
    }
  };

  const generateCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dayDate = new Date(year, month, d);
      days.push(dayDate);
    }
    return days;
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCD8CD] via-[#FEEBF6] to-[#EBD6FB] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Employee Attendance
        </h1>

        <div className="flex gap-6">
          {/* Employee List */}
          <div className="w-1/3 bg-white shadow-lg rounded-2xl p-6 space-y-3">
            {employees.map((emp) => (
              <div
                key={emp._id}
                className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-[#FEEBF6] transition-all cursor-pointer"
                onClick={() => handleEmployeeClick(emp)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={attendanceMap[emp._id]}
                    onChange={() => handleCheckboxChange(emp._id)}
                    className="w-5 h-5 accent-[#687FE5]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="font-medium text-gray-800">{emp.name}</span>
                </div>
              </div>
            ))}

            <button
              onClick={markAttendance}
              className="mt-4 w-full py-2 bg-[#687FE5] text-white rounded-xl hover:bg-indigo-600 transition-all"
            >
              Mark Attendance
            </button>
          </div>

          {/* Calendar */}
          {selectedEmployee && (
            <div className="w-2/3 bg-white shadow-lg rounded-2xl p-6 relative">
              <h2 className="text-xl font-semibold mb-4">
                {selectedEmployee.name}'s Attendance
              </h2>

              {/* Color Guide */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-green-400 block"></span>{" "}
                  Present
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-400 block"></span>{" "}
                  Leave
                </div>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => changeMonth(-1)}>
                  <ChevronLeft size={20} />
                </button>
                <span className="font-medium">
                  {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                  {currentMonth.getFullYear()}
                </span>
                <button onClick={() => changeMonth(1)}>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="text-center font-medium">
                      {day}
                    </div>
                  )
                )}
                {generateCalendarDays().map((day) => {
                  const status = getDayStatus(day);
                  const color =
                    status === "present"
                      ? "bg-green-400"
                      : status === "leave"
                      ? "bg-red-400"
                      : "bg-gray-200";
                  return (
                    <div
                      key={day}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${color} cursor-pointer`}
                      onClick={() => handleDateClick(day)}
                    >
                      {day.getDate()}
                    </div>
                  );
                })}
              </div>

              {/* Edit Modal */}
              {editRecord && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl p-6 z-50 w-80">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Edit Attendance</h3>
                    <button onClick={() => setEditRecord(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <p className="mb-3">Date: {editRecord.date.toDateString()}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editRecord.leave}
                        onChange={(e) =>
                          setEditRecord((prev) => ({
                            ...prev,
                            leave: e.target.checked,
                          }))
                        }
                        className="w-5 h-5 accent-red-400"
                      />
                      Mark as Leave
                    </label>
                  </div>
                  <button
                    onClick={saveEdit}
                    className="w-full py-2 bg-[#687FE5] text-white rounded-xl hover:bg-indigo-600 transition-all"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
