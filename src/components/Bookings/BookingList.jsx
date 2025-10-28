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
} from "lucide-react";
import BookingEditModal from "./BookingEditModal";
import BookingExploreModal from "./BookingExploreModal";
import { BASE_URL } from "../../data/data";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  useEffect(() => {
    fetchBookings();
    fetchDropdowns();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointments/?for_notification=false`);
      setBookings(res.data.appointments || []);
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const serviceNames = b.services?.map((s) => s.service_id?.name).join(", ") || "";
    const matchesSearch =
      b.customer_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_id?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.payment_status || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || b.payment_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // pagination logic
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
      "px-2.5 py-1 text-xs font-medium rounded-full flex items-center justify-center gap-1";
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
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>Unknown</span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f6ff] via-[#eef1ff] to-white py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name, phone, service, or payment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#687FE5]/50 focus:border-[#687FE5] outline-none transition"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#687FE5]/50 focus:border-[#687FE5] outline-none transition bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-100">
          <table className="min-w-full text-sm text-gray-700 border-collapse">
            <thead className="bg-[#687FE5] text-white text-xs uppercase tracking-wide">
              <tr>
                {[
                  "Customer",
                  "Phone",
                  "Service(s)",
                  "Employee",
                  "Amount",
                  "Payment",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="py-3.5 px-4 text-left border-b border-[#e4e7ff]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-[#f1f4ff] transition-all border-b last:border-0"
                  >
                    <td className="py-3 px-4">{b.customer_id?.name}</td>
                    <td className="py-3 px-4">{b.customer_id?.phone}</td>
                    <td className="py-3 px-4">
                      {b.services?.map((s) => s.service_id?.name).join(", ") || "N/A"}
                    </td>
                    <td className="py-3 px-4">{b.employee_id?.name || "N/A"}</td>
                    <td className="py-3 px-4 text-center font-medium text-gray-800">
                      ₹{b.amount}
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
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1.5 bg-[#687FE5] text-white text-xs rounded-lg hover:bg-[#556dd8] transition flex items-center gap-1"
                        >
                          <Info size={14} /> View
                        </button>
                        <button
                          onClick={() => setEditBooking(b)}
                          className="px-2.5 py-1.5 bg-[#dce3ff] text-[#687FE5] text-xs rounded-lg hover:bg-[#c5d1ff] transition flex items-center gap-1"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="py-8 text-center text-gray-500 text-sm font-medium"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-4 text-sm">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-[#687FE5] font-semibold">
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
            onClose={() => setEditBooking(null)}
            onUpdated={() => {
              fetchBookings();
              setEditBooking(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BookingList;
