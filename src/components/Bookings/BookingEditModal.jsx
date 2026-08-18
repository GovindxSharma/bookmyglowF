import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "@/api/axiosInstance";
import Toast from "../Toast";
import { BASE_URL } from "../../data/data";
import { X, Calendar, User, Phone, MapPin, Scissors, Trash2, Check, Sparkles, Clock, DollarSign } from "lucide-react";

const BookingEditModal = ({ editBooking, employees, onClose, onUpdate }) => {
  const [services, setServices] = useState([]);
  const [serviceList, setServiceList] = useState([
    {
      service: null,
      subService: null,
      subServices: [],
      employee: null,
      price: "",
      duration: "",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    note: "",
    date: "",
    service_status: "in_queue",
    payment_status: "pending",
    payment_mode: "upi",
    amount: "",
  });

  const [toast, setToast] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/services`)
      .then((res) => {
        const formatted = res.data.map((s) => ({
          label: s.name,
          value: s._id,
          sub_services: (s.sub_services || []).map((sub) => ({
            label: `${sub.name} - ₹${sub.price}`,
            value: sub._id,
            price: sub.price,
            duration: sub.duration || "",
          })),
        }));
        setServices(formatted);
      })
      .catch(() =>
        setToast({ message: "Failed to load services", type: "error" })
      );
  }, []);

  useEffect(() => {
    if (!editBooking || services.length === 0) return;

    setFormData({
      name: editBooking.customer_id?.name || "",
      email: editBooking.customer_id?.email || "",
      phone: editBooking.customer_id?.phone || "",
      gender: editBooking.customer_id?.gender || "",
      address: editBooking.customer_id?.address || "",
      note: editBooking.note || "",
      date: editBooking.date?.split("T")[0] || today,
      service_status: editBooking.service_status || "in_queue",
      payment_status: editBooking.payment_status || "pending",
      payment_mode: editBooking.payment_mode || "upi",
      amount: editBooking.amount || "",
    });

    const mapped = (editBooking.services || []).map((s) => {
      const main = services.find((ser) => ser.value === s.service_id?._id) || {
        label: s.service_id?.name || "Service",
        value: s.service_id?._id,
        sub_services: [],
      };

      const sub = (main.sub_services || []).find(
        (sub) => sub.value === s.sub_service_id
      ) || {
        label: s.service_id?.name || "Treatment",
        value: s.sub_service_id,
        price: s.price,
        duration: s.duration || "",
      };

      return {
        service: main,
        subService: sub,
        subServices: main.sub_services || [],
        employee: s.employee_id
          ? { label: s.employee_id.name, value: s.employee_id._id }
          : null,
        price: s.price,
        duration: s.duration || "",
      };
    });

    setServiceList(
      mapped.length > 0
        ? mapped
        : [
            {
              service: null,
              subService: null,
              subServices: [],
              employee: null,
              price: "",
              duration: "",
            },
          ]
    );
  }, [editBooking, services]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleServiceChange = (i, v) => {
    const copy = [...serviceList];
    copy[i].service = v;
    copy[i].subServices = v ? v.sub_services || [] : [];
    copy[i].subService = null;
    copy[i].price = "";
    copy[i].duration = "";
    setServiceList(copy);
  };

  const handleSubServiceChange = (i, v) => {
    const copy = [...serviceList];
    copy[i].subService = v;
    copy[i].price = v ? v.price : "";
    copy[i].duration = v ? v.duration : "";
    setServiceList(copy);
  };

  const handleEmployeeChange = (i, v) => {
    const copy = [...serviceList];
    copy[i].employee = v;
    setServiceList(copy);
  };

  const addServiceBlock = () => {
    setServiceList((p) => [
      ...p,
      {
        service: null,
        subService: null,
        subServices: [],
        employee: null,
        price: "",
        duration: "",
      },
    ]);
  };

  const removeServiceBlock = (index) => {
    setServiceList((p) => p.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formattedServices = serviceList
      .filter((s) => s.service)
      .map((s) => ({
        service_id: s.service.value,
        sub_service_id: s.subService ? s.subService.value : null,
        employee_id: s.employee ? s.employee.value : null,
        price: Number(s.price) || 0,
        duration: s.duration || "30 min",
      }));

    if (formattedServices.length === 0) {
      return setToast({
        message: "Please select at least one service",
        type: "error",
      });
    }

    try {
      await axios.put(`${BASE_URL}/appointments/${editBooking._id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
        note: formData.note,
        date: formData.date,
        service_status: formData.service_status,
        payment_status: formData.payment_status,
        payment_mode: formData.payment_mode,
        amount: Number(formData.amount) || 0,
        services: formattedServices,
      });

      setToast({ message: "Appointment updated successfully ✨", type: "success" });
      setTimeout(() => {
        onUpdate && onUpdate();
        onClose();
      }, 500);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to update appointment",
        type: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`${BASE_URL}/appointments/${editBooking._id}`);
      setToast({ message: "Appointment deleted", type: "success" });
      setTimeout(() => {
        onUpdate && onUpdate();
        onClose();
      }, 500);
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-[#EAE3D9] shadow-soft-lg max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-4 text-[#242A26]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#F2ECE4] pb-3">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1F2421]">
              Edit Appointment Record
            </h2>
            <p className="text-xs text-[#68706B]">Update customer details, treatment status, or stylist</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F8F5F0] text-[#7D8480] hover:text-[#1F2421] transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#1F2421] block mb-1">Customer Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
                placeholder="Full Name"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-[#1F2421] block mb-1">Phone Number *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
                placeholder="10-digit Phone"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-[#1F2421] block mb-1">Email Address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1F2421] block mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Dual Status Controls: Service Status + Payment Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F2ECE4]">
            <div className="p-3 bg-[#F8F5F0] rounded-2xl border border-[#EAE3D9] space-y-1">
              <label className="font-bold text-[#1F2421] flex items-center gap-1.5">
                <Clock size={13} className="text-[#4E6758]" /> Service Execution Status
              </label>
              <select
                name="service_status"
                value={formData.service_status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs font-semibold text-[#1F2421]"
              >
                <option value="in_queue">⏳ In Queue / Waiting</option>
                <option value="in_progress">💆 In Chair / In Progress</option>
                <option value="completed">✨ Completed</option>
                <option value="cancelled">❌ Cancelled / No-Show</option>
              </select>
            </div>

            <div className="p-3 bg-[#EDF3EF] rounded-2xl border border-[#D9E4DD] space-y-1">
              <label className="font-bold text-[#35473C] flex items-center gap-1.5">
                <DollarSign size={13} className="text-[#4E6758]" /> Payment Collection Status
              </label>
              <select
                name="payment_status"
                value={formData.payment_status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs font-semibold text-[#1F2421]"
              >
                <option value="pending">⏳ Pending / Unpaid</option>
                <option value="completed">💰 Paid (Completed)</option>
                <option value="refunded">↩️ Refunded</option>
              </select>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-3 pt-2 border-t border-[#F2ECE4]">
            <span className="font-bold text-[#1F2421] block">Booked Treatments & Stylist</span>
            {serviceList.map((item, i) => (
              <div
                key={i}
                className="p-3.5 border border-[#EAE3D9] rounded-2xl bg-[#FDFBF9] relative space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Select
                    options={services}
                    value={item.service}
                    onChange={(v) => handleServiceChange(i, v)}
                    placeholder="Select Category"
                    className="text-xs"
                  />
                  <Select
                    options={item.subServices}
                    value={item.subService}
                    onChange={(v) => handleSubServiceChange(i, v)}
                    placeholder="Select Treatment"
                    className="text-xs"
                    isDisabled={!item.subServices.length}
                  />
                  <Select
                    options={employees.map((e) => ({
                      label: e.name,
                      value: e._id,
                    }))}
                    value={item.employee}
                    onChange={(v) => handleEmployeeChange(i, v)}
                    placeholder="Assigned Stylist"
                    className="text-xs"
                  />
                </div>

                {item.price && (
                  <div className="flex justify-between text-xs text-[#4E6758] font-bold px-1">
                    <span>Price: ₹{item.price}</span>
                    <span>{item.duration ? `⏱ ${item.duration}` : ""}</span>
                  </div>
                )}

                {serviceList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeServiceBlock(i)}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addServiceBlock}
              className="w-full py-2 rounded-xl bg-[#EDF3EF] hover:bg-[#E0ECE5] text-[#35473C] font-semibold text-xs transition border border-[#D9E4DD]"
            >
              + Add Another Service
            </button>
          </div>

          {/* Date, Amount, Payment Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F2ECE4]">
            <div>
              <label className="font-semibold text-[#1F2421] block mb-1">Appointment Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1F2421] block mb-1">Total Bill (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount"
                className="w-full px-3 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1F2421] block mb-1">Payment Mode</label>
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs capitalize"
              >
                <option value="upi">UPI (GPay / Paytm)</option>
                <option value="cash">Cash</option>
                <option value="card">Debit / Credit Card</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition border border-rose-200"
            >
              Delete
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#4E6758] hover:bg-[#405448] text-white font-semibold text-xs transition shadow-soft-sm"
            >
              Save Changes
            </button>
          </div>
        </form>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BookingEditModal;
