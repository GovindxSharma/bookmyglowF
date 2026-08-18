import React, { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Pencil,
  Info,
  Trash2,
  Share2,
  FileSpreadsheet,
  Search,
  Calendar,
  Sparkles,
  Phone,
  User,
  Clock,
  Scissors,
} from "lucide-react";
import BookingEditModal from "./BookingEditModal";
import BookingExploreModal from "./BookingExploreModal";
import { BASE_URL, SALON_CONFIG } from "../../data/data";
import Loader from "../Layout/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SERVICE_STATUS_CONFIG = {
  in_queue: {
    label: "In Queue",
    icon: "⏳",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  in_progress: {
    label: "In Chair",
    icon: "💆",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Completed",
    icon: "✨",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: "❌",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
  },
};

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterServiceStatus, setFilterServiceStatus] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [dateFilter, setDateFilter] = useState("Today");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

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
      let query = "for_notification=false";

      if (dateFilter === "Today") {
        const todayStr = formatLocalDate(now);
        query += `&date_start=${todayStr}&date_end=${todayStr}`;
      } else if (dateFilter === "This Week") {
        const currentDay = now.getDay();
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const start = new Date(now);
        start.setDate(now.getDate() - diffToMonday);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        query += `&date_start=${formatLocalDate(start)}&date_end=${formatLocalDate(end)}`;
      } else if (dateFilter === "This Month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        query += `&date_start=${formatLocalDate(start)}&date_end=${formatLocalDate(end)}`;
      }

      const res = await axios.get(`/appointments?${query}`);
      setBookings(res.data.appointments || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      showAlert("error", "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [empRes, servRes] = await Promise.all([
        axios.get("/employee"),
        axios.get("/services"),
      ]);
      setEmployees(empRes.data.employees || []);
      setServices(servRes.data || []);
    } catch (err) {
      console.error("Dropdown fetch error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/appointments/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      showAlert("success", "Appointment deleted successfully!");
      setConfirmDelete(null);
    } catch (err) {
      showAlert("error", "Failed to delete booking.");
    }
  };

  const handlePaymentToggle = async (b) => {
    try {
      const newStatus = b.payment_status === "completed" ? "pending" : "completed";
      const res = await axios.put(`/appointments/${b._id}`, {
        payment_status: newStatus,
        payment_mode: b.payment_mode || "upi",
      });
      setBookings((prev) =>
        prev.map((item) => (item._id === b._id ? res.data.appointment : item))
      );
      showAlert("success", `Payment marked as ${newStatus === "completed" ? "Paid" : "Pending"}`);
    } catch {
      showAlert("error", "Failed to update payment status");
    }
  };

  const handleServiceStatusChange = async (b, newServiceStatus) => {
    try {
      const res = await axios.put(`/appointments/${b._id}`, {
        service_status: newServiceStatus,
      });
      setBookings((prev) =>
        prev.map((item) => (item._id === b._id ? res.data.appointment : item))
      );
      showAlert("success", `Service status updated to ${SERVICE_STATUS_CONFIG[newServiceStatus]?.label || newServiceStatus}`);
    } catch {
      showAlert("error", "Failed to update service status");
    }
  };

  const sendWhatsAppReceipt = (b) => {
    const clientName = b.customer_id?.name || "Customer";
    const phone = b.customer_id?.phone?.replace(/\D/g, "");
    if (!phone) return showAlert("error", "No mobile number available for WhatsApp");

    const serviceNames = (b.services || [])
      .map((s) => s.service_id?.name || "Service")
      .join(", ");

    const text = encodeURIComponent(
      `✨ *${SALON_CONFIG.name} — Tax Invoice & Receipt* ✨\n\nDear *${clientName}*,\nThank you for visiting us! Here are your visit details:\n\n📅 *Date:* ${new Date(b.date).toLocaleDateString()}\n⏰ *Time:* ${b.appointment_time || "11:00 AM"}\n💇‍♀️ *Services:* ${serviceNames}\n💈 *Service Status:* ${SERVICE_STATUS_CONFIG[b.service_status]?.label || "In Queue"}\n💳 *Payment Status:* ${b.payment_status === "completed" ? "PAID" : "PENDING"}\n💰 *Total Amount:* ₹${b.amount}\n\n📍 *Address:* ${SALON_CONFIG.address}\n📞 *Helpline:* ${SALON_CONFIG.phone}\n\n_We look forward to serving you again!_ 🌿`
    );

    window.open(`https://wa.me/91${phone}?text=${text}`, "_blank");
  };

  const handleExport = () => {
    setExporting(true);
    try {
      const data = filteredBookings.map((b) => ({
        Customer: b.customer_id?.name || "N/A",
        Phone: b.customer_id?.phone || "N/A",
        Date: new Date(b.date).toLocaleDateString(),
        Time: b.appointment_time || "11:00 AM",
        Services: (b.services || []).map((s) => s.service_id?.name).join(", "),
        Stylist: (b.services || []).map((s) => s.employee_id?.name).filter(Boolean).join(", ") || "General",
        Amount: b.amount,
        "Service Status": SERVICE_STATUS_CONFIG[b.service_status]?.label || "In Queue",
        "Payment Status": b.payment_status === "completed" ? "Paid" : "Pending",
        "Payment Mode": b.payment_mode || "UPI",
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Appointments");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `AuraSalon_Appointments_${dateFilter}.xlsx`);
      showAlert("success", "Exported successfully!");
    } catch {
      showAlert("error", "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.customer_id?.name?.toLowerCase().includes(q) ||
      b.customer_id?.phone?.includes(q) ||
      (b.services || []).some((s) => s.service_id?.name?.toLowerCase().includes(q));

    const matchesServiceStatus =
      filterServiceStatus === "All" || b.service_status === filterServiceStatus;

    const matchesPaymentStatus =
      filterPaymentStatus === "All" ||
      (filterPaymentStatus === "Paid" && b.payment_status === "completed") ||
      (filterPaymentStatus === "Pending" && b.payment_status !== "completed");

    return matchesSearch && matchesServiceStatus && matchesPaymentStatus;
  });

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {alert.show && (
        <div
          className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-soft-sm ${
            alert.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{alert.message}</span>
          <button onClick={() => setAlert({ show: false, type: "", message: "" })}>
            &times;
          </button>
        </div>
      )}

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EAE3D9] shadow-soft-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 text-[#7D8480] w-4 h-4" />
          <input
            type="text"
            placeholder="Search by client name, mobile, or treatment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs sm:text-sm text-[#1F2421] placeholder-[#8C948F]"
          />
        </div>

        {/* Date Filter, Service Status, Payment Filter & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Segmented Control */}
          <div className="flex bg-[#F8F5F0] p-1 rounded-2xl border border-[#EAE3D9]">
            {["Today", "This Week", "This Month"].map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  dateFilter === df
                    ? "bg-[#4E6758] text-white shadow-xs"
                    : "text-[#555E58] hover:text-[#1F2421]"
                }`}
              >
                {df}
              </button>
            ))}
          </div>

          {/* Service Status Filter */}
          <select
            value={filterServiceStatus}
            onChange={(e) => setFilterServiceStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] text-xs font-semibold text-[#4A524D] outline-none"
          >
            <option value="All">All Service Statuses</option>
            <option value="in_queue">⏳ In Queue</option>
            <option value="in_progress">💆 In Chair (In Progress)</option>
            <option value="completed">✨ Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] text-xs font-semibold text-[#4A524D] outline-none"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">💰 Paid</option>
            <option value="Pending">⏳ Pending</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={exporting || filteredBookings.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF3EF] text-[#35473C] hover:bg-[#E0ECE5] font-semibold text-xs border border-[#D9E4DD] transition"
          >
            <FileSpreadsheet size={14} />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {/* MOBILE CARDS VIEW (on screens < md) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-16 bg-white rounded-3xl border border-[#EAE3D9]">
            <Loader size={150} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#EAE3D9] text-gray-400">
            <Calendar size={28} className="mx-auto mb-2 text-[#4E6758] opacity-50" />
            <p className="text-sm font-semibold text-[#555E58]">No appointments found</p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const servConf = SERVICE_STATUS_CONFIG[b.service_status || "in_queue"];
            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl p-4 border border-[#EAE3D9] shadow-soft-sm space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#1F2421] flex items-center gap-1.5">
                      <User size={14} className="text-[#4E6758]" />
                      {b.customer_id?.name || "Walk-in Guest"}
                    </h4>
                    <a
                      href={`tel:${b.customer_id?.phone}`}
                      className="text-xs text-[#4E6758] font-mono flex items-center gap-1 mt-0.5"
                    >
                      <Phone size={11} /> {b.customer_id?.phone || "N/A"}
                    </a>
                  </div>

                  {/* Dual Badges on Mobile */}
                  <div className="flex flex-col items-end gap-1">
                    {/* Service Status Selector */}
                    <select
                      value={b.service_status || "in_queue"}
                      onChange={(e) => handleServiceStatusChange(b, e.target.value)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border outline-none ${servConf?.badgeClass || ""}`}
                    >
                      <option value="in_queue">⏳ In Queue</option>
                      <option value="in_progress">💆 In Chair</option>
                      <option value="completed">✨ Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>

                    {/* Payment Status Toggle */}
                    <button
                      onClick={() => handlePaymentToggle(b)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        b.payment_status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {b.payment_status === "completed" ? "💰 Paid" : "⏳ Unpaid"}
                    </button>
                  </div>
                </div>

                {/* Service Info */}
                <div className="bg-[#FDFBF9] p-2.5 rounded-xl border border-[#EAE3D9] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#7D8480]">Services:</span>
                    <span className="font-medium text-[#1F2421] text-right max-w-[60%] truncate">
                      {(b.services || []).map((s) => s.service_id?.name).join(", ") || "Service"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#7D8480]">Date & Slot:</span>
                    <span className="font-medium text-[#1F2421]">
                      {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} &bull; {b.appointment_time || "11:00 AM"}
                    </span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-[#EAE3D9]">
                    <span className="text-[#7D8480]">Bill Total:</span>
                    <span className="font-bold text-[#1F2421] text-sm">
                      ₹{b.amount.toLocaleString()}{" "}
                      <span className="text-[10px] text-[#7D8480] font-normal uppercase">
                        ({b.payment_mode || "upi"})
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <button
                    onClick={() => sendWhatsAppReceipt(b)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs flex items-center justify-center gap-1 border border-emerald-200 transition"
                  >
                    <Share2 size={12} /> WhatsApp
                  </button>

                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-[#EDF3EF] text-[#35473C] hover:bg-[#E0ECE5] font-semibold text-xs flex items-center justify-center gap-1 border border-[#D9E4DD] transition"
                  >
                    <Info size={12} /> Details
                  </button>

                  <button
                    onClick={() => setEditBooking(b)}
                    className="p-1.5 rounded-xl bg-[#F8F5F0] text-[#555E58] hover:bg-[#EAE3D9] transition"
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    onClick={() => setConfirmDelete(b._id)}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW (on screens md+) */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#EAE3D9] shadow-soft-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-[#FDFBF9]">
            <Loader size={160} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={32} className="mx-auto mb-2 text-[#4E6758] opacity-50" />
            <p className="text-sm font-semibold text-[#555E58]">No appointments found for the selected filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#F8F5F0] text-left text-xs font-bold text-[#4A524D] uppercase tracking-wider">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Services & Stylist</th>
                  <th className="px-4 py-3">Service Status</th>
                  <th className="px-4 py-3">Bill & Payment</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4] text-sm">
                {filteredBookings.map((b) => {
                  const servConf = SERVICE_STATUS_CONFIG[b.service_status || "in_queue"];
                  return (
                    <tr key={b._id} className="hover:bg-[#FAF7F2] transition">
                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#1F2421]">
                          {b.customer_id?.name || "Walk-in Guest"}
                        </div>
                        <div className="text-xs text-[#7D8480] font-mono">
                          {b.customer_id?.phone || "N/A"}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3.5 text-[#555E58]">
                        <div className="font-medium text-[#1F2421]">
                          {new Date(b.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                        <div className="text-xs text-[#7D8480]">
                          {b.appointment_time || "11:00 AM"}
                        </div>
                      </td>

                      {/* Services & Stylist */}
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-[#242A26]">
                          {(b.services || []).map((s) => s.service_id?.name).join(", ") ||
                            "Service"}
                        </div>
                        <div className="text-xs text-[#4E6758]">
                          Stylist:{" "}
                          {(b.services || [])
                            .map((s) => s.employee_id?.name)
                            .filter(Boolean)
                            .join(", ") || "General Staff"}
                        </div>
                      </td>

                      {/* Service Execution Status (Dropdown Selector) */}
                      <td className="px-4 py-3.5">
                        <select
                          value={b.service_status || "in_queue"}
                          onChange={(e) => handleServiceStatusChange(b, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer transition ${servConf?.badgeClass || ""}`}
                        >
                          <option value="in_queue">⏳ In Queue</option>
                          <option value="in_progress">💆 In Chair (In Progress)</option>
                          <option value="completed">✨ Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>

                      {/* Bill & Payment Status */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#1F2421]">
                          ₹{b.amount.toLocaleString()}
                        </div>
                        <button
                          onClick={() => handlePaymentToggle(b)}
                          className={`mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                            b.payment_status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {b.payment_status === "completed" ? (
                            <>
                              <CheckCircle size={11} /> Paid ({b.payment_mode || "UPI"})
                            </>
                          ) : (
                            <>
                              <AlertCircle size={11} /> Unpaid
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => sendWhatsAppReceipt(b)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition inline-flex"
                          title="Send WhatsApp Bill"
                        >
                          <Share2 size={13} />
                        </button>

                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg bg-[#EDF3EF] text-[#35473C] hover:bg-[#E0ECE5] transition inline-flex"
                          title="View Details"
                        >
                          <Info size={13} />
                        </button>

                        <button
                          onClick={() => setEditBooking(b)}
                          className="p-1.5 rounded-lg bg-[#F8F5F0] text-[#555E58] hover:bg-[#EAE3D9] transition inline-flex"
                          title="Edit Appointment"
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          onClick={() => setConfirmDelete(b._id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition inline-flex"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EAE3D9] shadow-soft-lg space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#1F2421]">Delete Appointment?</h3>
              <p className="text-xs text-[#68706B] mt-1">
                Are you sure you want to remove this appointment record from the system?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-xl bg-[#F8F5F0] text-[#555E58] font-semibold text-xs border border-[#EAE3D9]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-soft-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
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
          onUpdate={fetchBookings}
        />
      )}
    </div>
  );
};

export default BookingList;
