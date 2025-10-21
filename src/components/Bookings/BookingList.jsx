// BookingList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, AlertCircle, Pencil, Info } from "lucide-react";
import BookingEditModal from "./BookingEditModal";
import BookingExploreModal from "./BookingExploreModal";
import { BASE_URL} from "../../data/data"

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);



  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointments/`);
      setBookings(res.data.appointments);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch dropdowns
  const fetchDropdowns = async () => {
    try {
      const [empRes, servRes] = await Promise.all([
        axios.get(`${BASE_URL}/auth/employees`),
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

  // 🔍 Filter Bookings
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 flex items-center gap-1 rounded">
            <CheckCircle size={14} /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 flex items-center gap-1 rounded">
            <AlertCircle size={14} /> Pending
          </span>
        );
      case "refunded":
        return (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 flex items-center gap-1 rounded">
            <XCircle size={14} /> Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-[#687FE5]">
            Salon Appointments
          </h1>
        </header>

        {/* 🔎 Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, phone, service, or payment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 pl-3 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#a3bffa] rounded-md shadow-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-[#a3bffa] rounded-md shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* 🧾 Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[#a3bffa] text-white">
              <tr>
                <th className="py-2 px-4 border">Customer</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Service(s)</th>
                <th className="py-2 px-4 border">Employee</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Payment</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[#e8ecff] transition-all">
                    <td className="py-2 px-4 border">{b.customer_id?.name}</td>
                    <td className="py-2 px-4 border">{b.customer_id?.phone}</td>
                    <td className="py-2 px-4 border">
                      {b.services?.map((s) => s.service_id?.name).join(", ") ||
                        "N/A"}
                    </td>
                    <td className="py-2 px-4 border">
                      {b.employee_id?.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">₹{b.amount}</td>
                    <td className="py-2 px-4 border">
                      {getStatusBadge(b.payment_status)}
                    </td>
                    <td className="py-2 px-4 border">
                      {b.confirmation_status ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1 justify-center">
                          <CheckCircle size={14} /> Confirmed
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1 justify-center">
                          <AlertCircle size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border flex gap-2">
                      <button
                        className="px-2 py-1 text-xs bg-[#687FE5] text-white hover:bg-[#556fd1] rounded-md flex items-center gap-1"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <Info size={14} /> Explore
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-[#c5d1ff] text-[#687FE5] hover:bg-[#b0c4ff] rounded-md flex items-center gap-1"
                        onClick={() => setEditBooking(b)}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔍 Explore Modal */}
        {selectedBooking && (
          <BookingExploreModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}

        {/* ✏️ Edit Modal */}
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
