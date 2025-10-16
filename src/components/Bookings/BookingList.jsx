import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, AlertCircle, Pencil } from "lucide-react";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);

  // ✅ Fetch appointments
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/appointments/");
      const formatted = res.data.map((b) => ({
        _id: b._id,
        customer: b.customer_id?.name || "N/A",
        phone: b.customer_id?.phone || "N/A",
        service: b.service_id?.name || "N/A",
        sub_service: b.service_id?.sub_services?.[0]?.name || "",
        employee: b.employee_id?.name || "N/A",
        amount: b.amount,
        payment_status: b.payment_status,
        confirmation_status_label: b.confirmation_status ? "Confirmed" : "Pending",
        ...b,
      }));
      setBookings(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [empRes, servRes] = await Promise.all([
        axios.get("http://localhost:3000/employees/"),
        axios.get("http://localhost:3000/services/"),
      ]);
      setEmployees(empRes.data);
      setServices(servRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchDropdowns();
  }, []);

  // 🟣 Filtered bookings
  const filteredBookings = bookings.filter(
    (b) =>
      (filterStatus === "all" || b.payment_status === filterStatus) &&
      (b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ✅ Status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs bg-[#EBD6FB] text-[#687FE5] flex items-center gap-1 rounded">
            <CheckCircle size={14} /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs bg-[#FEEBF6] text-[#FCD8CD] flex items-center gap-1 rounded">
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

  // 🟣 Open Edit Modal
  const handleEdit = (b) => {
    setEditBooking(b);
    setEditForm({
      name: b.customer_id?.name || "",
      phone: b.customer_id?.phone || "",
      email: b.customer_id?.email || "",
      note: b.customer_id?.note || "",
      service_id: b.service_id?._id || "",
      employee_id: b.employee_id?._id || "",
      amount: b.amount || "",
      payment_mode: b.payment_mode || "",
      date: b.date ? new Date(b.date).toISOString().split("T")[0] : "",
      appointment_time: b.appointment_time || "",
      confirmation_status: b.confirmation_status || false,
      source: b.source || "",
    });
  };

  // 🟣 Handle Edit Input Change
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Update Appointment
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/appointments/${editBooking._id}`, editForm);
      alert("Appointment updated successfully ✅");
      setEditBooking(null);
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("Failed to update appointment ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#FEEBF6] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-800">Salon Appointments</h1>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by customer or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 pl-3 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#687FE5] rounded-md"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-[#687FE5] rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-md">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[#687FE5] text-white">
              <tr>
                <th className="py-2 px-4 border">Customer Name</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Service</th>
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
                  <tr key={b._id} className="hover:bg-[#fcecec] transition-all">
                    <td className="py-2 px-4 border">{b.customer}</td>
                    <td className="py-2 px-4 border">{b.phone}</td>
                    <td className="py-2 px-4 border">{b.service}</td>
                    <td className="py-2 px-4 border">{b.employee}</td>
                    <td className="py-2 px-4 border">₹{b.amount}</td>
                    <td className="py-2 px-4 border">{getStatusBadge(b.payment_status)}</td>
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
                        className="px-2 py-1 text-xs bg-[#687FE5] text-white hover:bg-[#556fd1] rounded-md"
                        onClick={() => setSelectedBooking(b)}
                      >
                        Explore
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-[#FCD8CD] text-[#687FE5] hover:bg-[#f8c6b9] rounded-md flex items-center gap-1"
                        onClick={() => handleEdit(b)}
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

        {/* 🟣 Edit Modal */}
        {editBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
              <button
                className="absolute top-3 right-3 text-red-500 font-bold"
                onClick={() => setEditBooking(null)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-[#687FE5]">
                Edit Appointment
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <label>
                  Customer Name:
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>

                <label>
                  Phone:
                  <input
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>

                <label>
                  Email:
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>

                <label>
                  Service:
                  <select
                    name="service_id"
                    value={editForm.service_id}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Employee:
                  <select
                    name="employee_id"
                    value={editForm.employee_id}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Amount:
                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>

                <label>
                  Payment Mode:
                  <select
                    name="payment_mode"
                    value={editForm.payment_mode}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="">Select</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                </label>

                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>

                <label>
                  Time:
                  <input
                    type="time"
                    name="appointment_time"
                    value={editForm.appointment_time}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>

                <label>
                  Source:
                  <input
                    name="source"
                    value={editForm.source}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>

                <label className="col-span-2">
                  Note:
                  <textarea
                    name="note"
                    value={editForm.note}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>

                <label className="flex items-center gap-2 col-span-2 mt-2">
                  <input
                    type="checkbox"
                    name="confirmation_status"
                    checked={editForm.confirmation_status}
                    onChange={handleEditChange}
                  />
                  Confirmed
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setEditBooking(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#687FE5] text-white rounded hover:bg-[#556fd1]"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;
