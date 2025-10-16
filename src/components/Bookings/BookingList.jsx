import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch bookings
  useEffect(() => {
    axios
      .get("http://localhost:3000/appointments/")
      .then((res) => {
        const formatted = res.data.map((b) => ({
          _id: b._id,
          customer: b.customer_id?.name || "N/A",
          phone: b.customer_id?.phone || "N/A",
          service: b.service_id?.name || "N/A",
          sub_service: b.service_id?.sub_services?.[0]?.name || "", // first sub-service
          employee: b.employee_id?.name || "N/A",
          amount: b.amount,
          payment_status: b.payment_status,
          confirmation_status: b.confirmation_status ? "Confirmed" : "Pending",
          ...b, // full payload for explore more
        }));
        setBookings(formatted);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredBookings = bookings.filter(
    (b) =>
      (filterStatus === "all" || b.payment_status === filterStatus) &&
      (b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs bg-[#EBD6FB] text-[#687FE5] flex items-center gap-1">
            <CheckCircle size={14} /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs bg-[#FEEBF6] text-[#FCD8CD] flex items-center gap-1">
            <AlertCircle size={14} /> Pending
          </span>
        );
      case "refunded":
        return (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle size={14} /> Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FEEBF6] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Salon Appointments
          </h1>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by customer or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 pl-3 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#687FE5]"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-[#687FE5]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[#687FE5] text-white">
              <tr>
                <th className="py-2 px-4 border">Customer Name</th>
                <th className="py-2 px-4 border">Customer Phone</th>
                <th className="py-2 px-4 border">Service (Sub)</th>
                <th className="py-2 px-4 border">Employee Name</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Payment Status</th>
                <th className="py-2 px-4 border">Appointment Status</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[#fcecec]">
                    <td className="py-2 px-4 border">{b.customer}</td>
                    <td className="py-2 px-4 border">{b.phone}</td>
                    <td className="py-2 px-4 border">
                      {b.service} {b.sub_service && `(${b.sub_service})`}
                    </td>
                    <td className="py-2 px-4 border">{b.employee}</td>
                    <td className="py-2 px-4 border">₹{b.amount}</td>
                    <td className="py-2 px-4 border">{getStatusBadge(b.payment_status)}</td>
                    <td className="py-2 px-4 border">{b.confirmation_status}</td>
                    <td className="py-2 px-4 border flex gap-2">
                      <button
                        className="px-2 py-1 text-xs bg-[#687FE5] text-white hover:bg-[#556fd1]"
                        onClick={() => setSelectedBooking(b)}
                      >
                        Explore
                      </button>
                      <button className="px-2 py-1 text-xs bg-[#FCD8CD] text-[#687FE5] hover:bg-[#f8c6b9]">
                        Edit
                      </button>
                      <button className="px-2 py-1 text-xs bg-[#FEEBF6] text-red-500 hover:bg-[#fcdada]">
                        Delete
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

        {/* Explore more frame */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 w-96 rounded-md shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-red-500 font-bold"
                onClick={() => setSelectedBooking(null)}
              >
                X
              </button>
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Name:</strong> {selectedBooking.customer}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedBooking.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedBooking.customer_id?.email || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedBooking.gender || "N/A"}
                </p>
                <p>
                  <strong>DOB:</strong> {selectedBooking.dob || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {selectedBooking.address || "N/A"}
                </p>
                <p>
                  <strong>Note:</strong> {selectedBooking.note || "N/A"}
                </p>
                <p>
                  <strong>Service:</strong> {selectedBooking.service} {selectedBooking.sub_service && `(${selectedBooking.sub_service})`}
                </p>
                <p>
                  <strong>Employee:</strong> {selectedBooking.employee}
                </p>
                <p>
                  <strong>Date:</strong> {selectedBooking.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedBooking.appointment_time}
                </p>
                <p>
                  <strong>Payment Mode:</strong> {selectedBooking.payment_mode}
                </p>
                <p>
                  <strong>Source:</strong> {selectedBooking.source}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;
