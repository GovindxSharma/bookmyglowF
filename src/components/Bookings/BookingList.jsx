import React, { useEffect, useState } from "react";
import axios from "axios";
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

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/appointments/?for_notification=false`
      );
      setBookings(res.data.appointments);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch dropdowns
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

  useEffect(() => {
    fetchBookings();
    fetchDropdowns();
  }, []);

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const serviceNames =
      b.services?.map((s) => s.service_id?.name).join(", ") || "";
    const matchesSearch =
      b.customer_id?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_id?.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.payment_status || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || b.payment_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredBookings.length / recordsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1)
      setCurrentPage(currentPage - 1);
    if (direction === "next" && currentPage < totalPages)
      setCurrentPage(currentPage + 1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-sm bg-green-100 text-green-700 flex items-center gap-1 rounded justify-center">
            <CheckCircle size={16} /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 flex items-center gap-1 rounded justify-center">
            <AlertCircle size={16} /> Pending
          </span>
        );
      case "refunded":
        return (
          <span className="px-2 py-1 text-sm bg-red-100 text-red-700 flex items-center gap-1 rounded justify-center">
            <XCircle size={16} /> Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-[#687FE5]">
            Salon Appointments
          </h1>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name, phone, service, or payment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 pl-4 pr-3 py-3 border border-gray-300 focus:ring-2 focus:ring-[#a3bffa] rounded-md shadow-sm text-base"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 py-3 px-4 focus:ring-2 focus:ring-[#a3bffa] rounded-md shadow-sm text-base"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-base border-collapse">
            <thead className="bg-[#a3bffa] text-white">
              <tr>
                <th className="py-4 px-5 border text-left">Customer</th>
                <th className="py-4 px-5 border text-left">Phone</th>
                <th className="py-4 px-5 border text-left">Service(s)</th>
                <th className="py-4 px-5 border text-left">Employee</th>
                <th className="py-4 px-5 border text-center">Amount</th>
                <th className="py-4 px-5 border text-center">Payment</th>
                <th className="py-4 px-5 border text-center">Status</th>
                <th className="py-4 px-5 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-[#eef2ff] transition-all border-b last:border-0"
                  >
                    <td className="py-4 px-5 align-middle border">
                      {b.customer_id?.name}
                    </td>
                    <td className="py-4 px-5 align-middle border">
                      {b.customer_id?.phone}
                    </td>
                    <td className="py-4 px-5 align-middle border">
                      {b.services?.map((s) => s.service_id?.name).join(", ") ||
                        "N/A"}
                    </td>
                    <td className="py-4 px-5 align-middle border">
                      {b.employee_id?.name || "N/A"}
                    </td>
                    <td className="py-4 px-5 align-middle border text-center">
                      ₹{b.amount}
                    </td>
                    <td className="py-4 px-5 align-middle border text-center">
                      {getStatusBadge(b.payment_status)}
                    </td>
                    <td className="py-4 px-5 align-middle border text-center">
                      {b.confirmation_status ? (
                        <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full flex items-center justify-center gap-1">
                          <CheckCircle size={16} /> Confirmed
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center gap-1">
                          <AlertCircle size={16} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 align-middle border text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          className="px-3 py-1.5 text-sm bg-[#687FE5] text-white hover:bg-[#556fd1] rounded-md flex items-center gap-1"
                          onClick={() => setSelectedBooking(b)}
                        >
                          <Info size={16} /> Explore
                        </button>
                        <button
                          className="px-3 py-1.5 text-sm bg-[#c5d1ff] text-[#687FE5] hover:bg-[#b0c4ff] rounded-md flex items-center gap-1"
                          onClick={() => setEditBooking(b)}
                        >
                          <Pencil size={16} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50"
            >
              <ChevronLeft size={18} /> Prev
            </button>
            <span className="text-[#687FE5] font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50"
            >
              Next <ChevronRight size={18} />
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
