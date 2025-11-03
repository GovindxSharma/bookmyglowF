import React, { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Pencil,
  Info,
  Loader2,
  Trash2,
} from "lucide-react";
import BookingEditModal from "./BookingEditModal";
import BookingExploreModal from "./BookingExploreModal";
import { BASE_URL } from "../../data/data";
import Loader from "../Layout/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dateFilter, setDateFilter] = useState("Today");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [dateFilter]);

  const formatLocalDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let date_start, date_end;

      if (dateFilter === "Today") {
        const today = formatLocalDate(now);
        date_start = today;
        date_end = today;
      } else if (dateFilter === "This Week") {
        const currentDay = now.getDay();
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const start = new Date(now);
        start.setDate(now.getDate() - diffToMonday);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        date_start = formatLocalDate(start);
        date_end = formatLocalDate(end);
      } else if (dateFilter === "This Month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        date_start = formatLocalDate(start);
        date_end = formatLocalDate(end);
      }

      const res = await axios.get(
        `${BASE_URL}/appointments?for_notification=false&date_start=${date_start}&date_end=${date_end}`
      );

      setBookings(res.data.appointments || []);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      showAlert("error", "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [empRes, servRes] = await Promise.all([
        axios.get(`${BASE_URL}/employee`),
        axios.get(`${BASE_URL}/services`),
      ]);
      setEmployees(empRes.data.employees || []);
      setServices(servRes.data || []);
    } catch (err) {
      console.error("❌ Dropdown fetch failed:", err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const serviceNames =
      b.services?.map((s) => s.service_id?.name).join(", ") || "";
    const employeeNames =
      b.services
        ?.map((s) => s.employee_name || s.employee_id?.name)
        .join(", ") || "";

    const matchesSearch =
      b.customer_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_id?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeeNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.payment_status || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      (b.payment_status || "").toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const exportExcel = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const data = filteredBookings.map((b) => ({
        Customer: b.customer_id?.name || "N/A",
        Phone: b.customer_id?.phone || "N/A",
        "Service(s)":
          b.services?.map((s) => s.service_id?.name).join(", ") || "N/A",
        "Employee(s)":
          b.services
            ?.map((s) => s.employee_name || s.employee_id?.name)
            .join(", ") || "N/A",
        Amount: b.amount,
        "Appointment Date": b.date
          ? new Date(b.date).toLocaleDateString("en-IN")
          : "N/A",
        Payment: b.payment_status || "N/A",
        Confirmation: b.confirmation_status ? "Confirmed" : "Pending",
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "bookings.xlsx");
    } catch (err) {
      console.error("❌ Excel export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 flex flex-col">
      {loading && <Loader fullscreen size={250} />}

      {alert.show && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50 ${
            alert.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full flex-1">
        {/* Top Bar: Search left, filters+export right */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-xl text-base shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
            />
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <select
              className="px-4 py-3 border rounded-xl text-base shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">Payment Status: All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Refunded">Refunded</option>
            </select>

            <select
              className="px-4 py-3 border rounded-xl text-base shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Today">Date: Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>

            <select
              className="px-4 py-3 border rounded-xl text-base shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>Records: 10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <button
              onClick={exportExcel}
              disabled={exporting}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 flex items-center gap-2 transition-all"
            >
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-base text-gray-700 border-collapse">
              <thead className="bg-indigo-600 text-white text-sm uppercase tracking-wide">
                <tr>
                  {[
                    "Customer",
                    "Phone",
                    "Services",
                    "Employees",
                    "Amount",
                    "Appointment Date",
                    "Payment",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="py-4 px-4 text-left border-b border-indigo-200"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentBookings.length ? (
                  currentBookings.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-indigo-50 border-b last:border-0"
                    >
                      <td className="py-3 px-4">{b.customer_id?.name}</td>
                      <td className="py-3 px-4">{b.customer_id?.phone}</td>
                      <td className="py-3 px-4">
                        {b.services?.map((s) => s.service_id?.name).join(", ")}
                      </td>
                      <td className="py-3 px-4">
                        {b.services
                          ?.map((s) => s.employee_name || s.employee_id?.name)
                          .join(", ")}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800 text-center">
                        ₹{b.amount}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {b.date
                          ? new Date(b.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {b.payment_status === "completed" ? (
                          <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex justify-center items-center mx-auto">
                            <CheckCircle size={20} />
                          </span>
                        ) : b.payment_status === "pending" ? (
                          <span className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex justify-center items-center mx-auto">
                            <AlertCircle size={20} />
                          </span>
                        ) : (
                          <span className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex justify-center items-center mx-auto">
                            <XCircle size={20} />
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center transition"
                        >
                          <Info size={18} />
                        </button>
                        <button
                          onClick={() => setEditBooking(b)}
                          className="p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 flex items-center transition"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(b._id)}
                          className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 flex items-center transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-10 text-center text-gray-500 text-base font-medium"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] sm:w-[400px] text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Delete Booking?
            </h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete this booking?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  setOperationLoading(true);
                  try {
                    await axios.delete(
                      `${BASE_URL}/appointments/${confirmDelete}`
                    );
                    setBookings((prev) =>
                      prev.filter((b) => b._id !== confirmDelete)
                    );
                    showAlert("success", "Booking deleted successfully!");
                  } catch {
                    showAlert("error", "Failed to delete booking.");
                  } finally {
                    setOperationLoading(false);
                    setConfirmDelete(null);
                  }
                }}
                disabled={operationLoading}
                className="px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {operationLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {operationLoading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBooking && (
        <BookingExploreModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {editBooking && (
        <BookingEditModal
          editBooking={editBooking}
          employees={employees}
          services={services}
          onClose={() => setEditBooking(null)}
          onUpdate={fetchBookings}
        />
      )}
    </div>
  );
};

export default BookingList;
