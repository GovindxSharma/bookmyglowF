import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "@/api/axiosInstance";
import Toast from "../Toast";
import { BASE_URL } from "../../data/data";

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
    payment_mode: "",
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
          sub_services: s.sub_services.map((sub) => ({
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
      payment_mode: editBooking.payment_mode || "",
      amount: editBooking.amount || "",
    });

    const mapped = (editBooking.services || []).map((s) => {
      const main = services.find((ser) => ser.value === s.service_id._id) || {
        label: s.service_id.name,
        value: s.service_id._id,
        sub_services: [],
      };

      const sub = main.sub_services.find(
        (sub) => sub.value === s.sub_service_id
      ) || {
        label: "Unknown",
        value: s.sub_service_id,
        price: s.price,
        duration: s.duration || "",
      };

      return {
        service: main,
        subService: sub,
        subServices: main.sub_services,
        employee: s.employee_id
          ? { label: s.employee_id.name, value: s.employee_id._id }
          : null,
        price: s.price,
        duration: s.duration || "",
      };
    });

    setServiceList(mapped);
  }, [editBooking, services]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleServiceChange = (i, v) => {
    const u = [...serviceList];
    u[i].service = v;
    u[i].subServices = v?.sub_services || [];
    u[i].subService = null;
    u[i].employee = null;
    u[i].price = "";
    u[i].duration = "";
    setServiceList(u);
  };

  const handleSubServiceChange = (i, v) => {
    const u = [...serviceList];
    u[i].subService = v;
    u[i].price = v?.price || "";
    u[i].duration = v?.duration || "";
    setServiceList(u);
  };

  const handleEmployeeChange = (i, v) => {
    const u = [...serviceList];
    u[i].employee = v;
    setServiceList(u);
  };

  const addServiceBlock = () =>
    setServiceList([
      ...serviceList,
      {
        service: null,
        subService: null,
        subServices: [],
        employee: null,
        price: "",
        duration: "",
      },
    ]);

  const removeServiceBlock = (i) => {
    const u = [...serviceList];
    u.splice(i, 1);
    setServiceList(u);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone)
      return setToast({ message: "Name & phone required", type: "error" });

    const servicesPayload = serviceList
      .filter((s) => s.service && s.subService && s.employee)
      .map((s) => ({
        service_id: s.service.value,
        sub_service_id: s.subService.value,
        employee_id: s.employee.value,
        price: s.price,
        duration: s.duration,
      }));

    const payload = { ...formData, services: servicesPayload };

    try {
      await axios.put(`${BASE_URL}/appointments/${editBooking._id}`, payload);
      setToast({ message: "Booking updated ✅", type: "info" });

      setTimeout(() => {
        onUpdate && onUpdate();
        onClose();
      }, 600);
    } catch {
      setToast({ message: "Update failed", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete booking?")) return;
    try {
      await axios.delete(`${BASE_URL}/appointments/${editBooking._id}`);
      setToast({ message: "Deleted ✅", type: "info" });
      setTimeout(() => {
        onUpdate && onUpdate();
        onClose();
      }, 600);
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative p-6 bg-white rounded-3xl shadow-lg max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Booking</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Customer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border rounded-xl"
              placeholder="Full Name"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded-xl"
              placeholder="Email"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border rounded-xl"
              placeholder="Phone"
              required
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 border rounded-xl"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="p-3 border rounded-xl col-span-2"
              placeholder="Address"
            />
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="p-3 border rounded-xl col-span-2"
              placeholder="Notes"
            />
          </div>

          {/* Services */}
          <div className="space-y-4">
            {serviceList.map((item, i) => (
              <div
                key={i}
                className="p-4 border rounded-xl bg-gray-50 relative"
              >
                <Select
                  options={services}
                  value={item.service}
                  onChange={(v) => handleServiceChange(i, v)}
                  placeholder="Service"
                  className="mb-2"
                />
                <Select
                  options={item.subServices}
                  value={item.subService}
                  onChange={(v) => handleSubServiceChange(i, v)}
                  placeholder="Sub Service"
                  className="mb-2"
                  isDisabled={!item.subServices.length}
                />
                <Select
                  options={employees.map((e) => ({
                    label: e.name,
                    value: e._id,
                  }))}
                  value={item.employee}
                  onChange={(v) => handleEmployeeChange(i, v)}
                  placeholder="Employee"
                  className="mb-2"
                />

                {item.price && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>₹{item.price}</p>
                    <p>{item.duration ? `⏱ ${item.duration}` : ""}</p>
                  </div>
                )}

                {serviceList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeServiceBlock(i)}
                    className="absolute top-2 right-3 text-red-500 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addServiceBlock}
              className="w-full p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200"
            >
              ➕ Add Service
            </button>
          </div>

          {/* Date + Amount + Payment Mode */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 border rounded-xl w-full"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="p-3 border rounded-xl"
            />
            <select
              name="payment_mode"
              value={formData.payment_mode}
              onChange={handleChange}
              className="p-3 border rounded-xl"
            >
              <option value="">Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full md:w-1/2 p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200"
            >
              Delete
            </button>
            <button
              type="submit"
              className="w-full md:w-1/2 p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
            >
              Update
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
