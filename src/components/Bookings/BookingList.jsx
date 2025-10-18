import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, AlertCircle, Pencil, Info } from "lucide-react";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const API_BASE = "http://localhost:3000";

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/appointments/`);
      const formatted = res.data.map((b) => ({
        _id: b._id,
        customer: b.customer_id?.name || "N/A",
        phone: b.customer_id?.phone || "N/A",
        service: b.service_id?.name || "N/A",
        subservice: b.subservice_id?.name || "",
        employee: b.employee_id?.name || "N/A",
        amount: b.amount,
        payment_status: b.payment_status || "pending",
        confirmation_status_label: b.confirmation_status ? "Confirmed" : "Pending",
        raw: b,
      }));
      setBookings(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [empRes, servRes] = await Promise.all([
        axios.get(`${API_BASE}/auth/employees`),
        axios.get(`${API_BASE}/services`),
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

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.subservice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.payment_status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || b.payment_status === filterStatus;
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

  const handleEdit = (b) => {
    const raw = b.raw;
    setEditBooking(b);
    setEditForm({
      name: raw.customer_id?.name || "",
      phone: raw.customer_id?.phone || "",
      email: raw.customer_id?.email || "",
      gender: raw.customer_id?.gender || "",
      address: raw.customer_id?.address || "",
      note: raw.customer_id?.note || "",
      service_id: raw.service_id?._id || "",
      subservice_id: raw.subservice_id?._id || "",
      employee_id: raw.employee_id?._id || "",
      amount: raw.amount || "",
      payment_mode: raw.payment_mode || "",
      date: raw.date ? new Date(raw.date).toISOString().split("T")[0] : "",
      confirmation_status: raw.confirmation_status || false,
      source: raw.source || "online",
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updated = { ...editForm, [name]: type === "checkbox" ? checked : value };

    // If subservice changes, auto-update amount
    if (name === "subservice_id" && editForm.service_id) {
      const selectedService = services.find((s) => s._id === editForm.service_id);
      const subserviceObj = selectedService?.sub_services.find((sub) => sub._id === value);
      if (subserviceObj) updated.amount = subserviceObj.price;
    }

    setEditForm(updated);
  };

  const handleUpdate = async () => {
    try {
      // Clone edit form
      const payload = { ...editForm };
  
      // 💰 Automatically mark payment as completed if both are provided
      if (payload.amount && payload.payment_mode) {
        payload.payment_status = "completed";
      }
  
      await axios.put(`${API_BASE}/appointments/${editBooking._id}`, payload);
      alert("Appointment updated successfully ✅");
      setEditBooking(null);
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("Failed to update appointment ❌");
    }
  };
  

  return (
    <div className="min-h-screen bg-[#f5f7ff] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-[#687FE5]">Salon Appointments</h1>
        </header>

        {/* Filters */}
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

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[#a3bffa] text-white">
              <tr>
                <th className="py-2 px-4 border">Customer</th>
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
                  <tr key={b._id} className="hover:bg-[#e8ecff] transition-all">
                    <td className="py-2 px-4 border">{b.customer}</td>
                    <td className="py-2 px-4 border">{b.phone}</td>
                    <td className="py-2 px-4 border">
                      {b.service}{b.subservice ? ` (${b.subservice})` : ""}
                    </td>
                    <td className="py-2 px-4 border">{b.employee}</td>
                    <td className="py-2 px-4 border">₹{b.amount}</td>
                    <td className="py-2 px-4 border">{getStatusBadge(b.payment_status)}</td>
                    <td className="py-2 px-4 border">
                      {b.raw.confirmation_status ? (
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
                        onClick={() => setSelectedBooking(b.raw)}
                      >
                        <Info size={14} /> Explore
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-[#c5d1ff] text-[#687FE5] hover:bg-[#b0c4ff] rounded-md flex items-center gap-1"
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

        {/* Explore Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-[#f5f7ff] rounded-xl p-6 w-full max-w-md shadow-lg relative border border-[#d1d9ff]">
              <button
                className="absolute top-3 right-3 text-red-500 font-bold"
                onClick={() => setSelectedBooking(null)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-[#687FE5] flex items-center gap-2">
                <Info /> Appointment Details
              </h2>

              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Customer:</strong> {selectedBooking.customer_id?.name}</p>
                <p><strong>Phone:</strong> {selectedBooking.customer_id?.phone}</p>
                <p><strong>Email:</strong> {selectedBooking.customer_id?.email || "N/A"}</p>
                <p><strong>Gender:</strong> {selectedBooking.customer_id?.gender || "N/A"}</p>
                <p><strong>Address:</strong> {selectedBooking.customer_id?.address || "N/A"}</p>
                <p>
                  <strong>Service:</strong> {selectedBooking.service_id?.name}
                  {selectedBooking.subservice_id ? ` (${selectedBooking.subservice_id.name})` : ""}
                </p>
                <p><strong>Employee:</strong> {selectedBooking.employee_id?.name}</p>
                <p><strong>Amount:</strong> ₹{selectedBooking.amount}</p>
                <p><strong>Payment Mode:</strong> {selectedBooking.payment_mode || "N/A"}</p>
                <p><strong>Status:</strong> {selectedBooking.payment_status}</p>
                <p><strong>Date:</strong> {selectedBooking.date?.split("T")[0]}</p>
                <p><strong>Source:</strong> {selectedBooking.source || "N/A"}</p>
                <p><strong>Notes:</strong> {selectedBooking.customer_id?.note || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-[#f5f7ff] rounded-xl p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh] relative border border-[#d1d9ff]">
              <button
                className="absolute top-3 right-3 text-red-500 font-bold"
                onClick={() => setEditBooking(null)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-[#687FE5]">Edit Appointment</h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <label>
                  Service:
                  <select
                    name="service_id"
                    value={editForm.service_id}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#a3bffa]"
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
                  Subservice:
                  <select
                    name="subservice_id"
                    value={editForm.subservice_id}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#a3bffa]"
                  >
                    <option value="">Select Subservice</option>
                    {services
                      .find((s) => s._id === editForm.service_id)
                      ?.sub_services.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name} (₹{sub.price})
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
                    className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#a3bffa]"
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
                    className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#a3bffa]"
                  />
                </label>

                <label>
                  Payment Mode:
                  <select
                    name="payment_mode"
                    value={editForm.payment_mode}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#a3bffa]"
                  >
                    <option value="">Select Mode</option>
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
                    className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#a3bffa]"
                  />
                </label>

                <label className="flex items-center gap-2 mt-2 col-span-2">
                  <input
                    type="checkbox"
                    name="confirmation_status"
                    checked={editForm.confirmation_status}
                    onChange={handleEditChange}
                  />
                  Confirmed
                </label>

                <label className="col-span-2">
                  Notes:
                  <textarea
                    name="note"
                    value={editForm.note}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#a3bffa]"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
