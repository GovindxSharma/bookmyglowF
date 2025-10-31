import React, { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Pencil,
  Info,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
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

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [dateFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let date_start, date_end;

      if (dateFilter === "Today") {
        date_start = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        date_end = new Date(now.setHours(23, 59, 59, 999)).toISOString();
      } else if (dateFilter === "This Week") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        date_start = new Date(start.setHours(0, 0, 0, 0)).toISOString();

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        date_end = new Date(end.setHours(23, 59, 59, 999)).toISOString();
      } else if (dateFilter === "This Month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        date_start = start.toISOString();
        date_end = new Date(end.setHours(23, 59, 59, 999)).toISOString();
      }

      const res = await axios.get(
        `${BASE_URL}/appointments/?for_notification=false&date_start=${date_start}&date_end=${date_end}`
      );
      setBookings(res.data.appointments || []);
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const serviceNames = b.services?.map((s) => s.service_id?.name).join(", ") || "";
    const matchesSearch =
      b.customer_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_id?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.payment_status || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || b.payment_status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredBookings.length / recordsPerPage);

  const handlePageChange = (dir) => {
    if (dir === "prev" && currentPage > 1) setCurrentPage((p) => p - 1);
    if (dir === "next" && currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const getStatusBadge = (status) => {
    const base =
      "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 justify-center";
    switch (status) {
      case "completed":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            <CheckCircle size={14} /> Completed
          </span>
        );
      case "pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            <AlertCircle size={14} /> Pending
          </span>
        );
      case "refunded":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            <XCircle size={14} /> Refunded
          </span>
        );
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>Unknown</span>;
    }
  };

  const Dropdown = ({ options, value, onChange }) => (
    <div className="relative group">
      <button className="flex items-center justify-between gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-gray-700 text-sm transition w-40">
        <Filter size={14} className="text-indigo-500" />
        <span className="truncate">{value}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>
      <div className="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg mt-1 w-40 shadow-lg z-20">
        {options.map((opt) => (
          <div
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
              value === opt ? "bg-indigo-100 text-indigo-700 font-medium" : ""
            }`}
          >
            {opt}
          </div>
        ))}
      </div>
    </div>
  );

  const exportExcel = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const data = filteredBookings.map((b) => ({
        Customer: b.customer_id?.name,
        Phone: b.customer_id?.phone,
        "Service(s)": b.services?.map((s) => s.service_id?.name).join(", ") || "N/A",
        Employee: b.employee_id?.name || "N/A",
        Amount: b.amount,
        "Appointment Date": b.date ? new Date(b.date).toLocaleString() : "N/A",
        Payment: b.payment_status,
        Confirmation: b.confirmation_status ? "Confirmed" : "Pending",
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "bookings.xlsx");
    } catch (err) {
      console.error("Excel export failed", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 flex flex-col">
      {loading && <Loader fullscreen={true} size={250} />}

      <div className="max-w-7xl mx-auto w-full flex-1">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search by name, phone, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none placeholder-gray-400"
          />

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Dropdown
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={["All", "Pending", "Completed", "Refunded"]}
            />
            <Dropdown
              value={dateFilter}
              onChange={(val) => setDateFilter(val)}
              options={["Today", "This Week", "This Month"]}
            />
            <Dropdown
              value={`${recordsPerPage} / page`}
              onChange={(val) => setRecordsPerPage(Number(val.split(" ")[0]))}
              options={["10 / page", "20 / page", "50 / page"]}
            />
            <button
              onClick={exportExcel}
              disabled={exporting}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                exporting
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
              }`}
            >
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>

        {/* ✅ Table on Desktop / Cards on Mobile */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border-collapse">
              <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wide">
                <tr>
                  {[
                    "Customer",
                    "Phone",
                    "Service(s)",
                    "Employee",
                    "Amount",
                    "Appointment Date",
                    "Payment",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="py-3.5 px-4 text-left border-b border-indigo-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentBookings.length > 0 ? (
                  currentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-indigo-50 border-b last:border-0">
                      <td className="py-3 px-4">{b.customer_id?.name}</td>
                      <td className="py-3 px-4">{b.customer_id?.phone}</td>
                      <td className="py-3 px-4">
                        {b.services?.map((s) => s.service_id?.name).join(", ") || "N/A"}
                      </td>
                      <td className="py-3 px-4">{b.employee_id?.name || "N/A"}</td>
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
                        {getStatusBadge(b.payment_status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {b.confirmation_status ? (
                          <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex justify-center items-center gap-1">
                            <CheckCircle size={14} /> Confirmed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex justify-center items-center gap-1">
                            <AlertCircle size={14} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 flex items-center gap-1"
                        >
                          <Info size={14} /> View
                        </button>
                        <button
                          onClick={() => setEditBooking(b)}
                          className="px-2.5 py-1.5 bg-indigo-100 text-indigo-600 text-xs rounded-lg hover:bg-indigo-200 flex items-center gap-1"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="py-8 text-center text-gray-500 text-sm font-medium"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden p-4 space-y-4">
            {currentBookings.length > 0 ? (
              currentBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl border border-gray-200 shadow-sm bg-gradient-to-tr from-indigo-50 to-white"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-gray-800">
                      {b.customer_id?.name || "Unknown"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {b.customer_id?.phone || "N/A"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Services:</span>{" "}
                    {b.services?.map((s) => s.service_id?.name).join(", ") || "N/A"}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Employee:</span>{" "}
                    {b.employee_id?.name || "N/A"}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-indigo-700 font-semibold">
                      ₹{b.amount || 0}
                    </span>
                    <span className="text-xs text-gray-600">
                      {b.date
                        ? new Date(b.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {getStatusBadge(b.payment_status)}
                    {b.confirmation_status ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Confirmed
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                        <AlertCircle size={12} /> Pending
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="flex-1 py-2 text-xs bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-1 hover:bg-indigo-700"
                    >
                      <Info size={14} /> View
                    </button>
                    <button
                      onClick={() => setEditBooking(b)}
                      className="flex-1 py-2 text-xs bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center gap-1 hover:bg-indigo-200"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm font-medium py-6">
                No bookings found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 mb-6 gap-4 text-sm">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="text-indigo-600 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modals */}
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
