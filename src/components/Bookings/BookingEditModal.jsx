import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "@/api/axiosInstance";
import Toast from "../Toast";
import { BASE_URL } from "../../data/data";

const BookingEditModal = ({ editBooking, employees, onClose, onUpdated }) => {
  const [services, setServices] = useState([]);
  const [serviceList, setServiceList] = useState([
    { service: null, subService: null, subServices: [], employee: null, price: "", duration: "" },
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    note: "",
    source: "online",
    date: "",
    payment_mode: "",
    amount: "",
  });
  const [toast, setToast] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Fetch services for dropdown
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
      .catch(() => setToast({ message: "Failed to load services", type: "error" }));
  }, []);

  // Prefill edit data AFTER services are loaded
  useEffect(() => {
    if (!editBooking || services.length === 0) return;

    setFormData({
      name: editBooking.customer_id?.name || "",
      email: editBooking.customer_id?.email || "",
      phone: editBooking.customer_id?.phone || "",
      gender: editBooking.customer_id?.gender || "",
      address: editBooking.customer_id?.address || "",
      note: editBooking.note || "",
      source: editBooking.source || "online",
      date: editBooking.date?.split("T")[0] || today,
      payment_mode: editBooking.payment_mode || "",
      amount: editBooking.amount || "",
    });

    const mappedServices = (editBooking.services || []).map((s) => {
      // Find main service
      const mainService =
        services.find((ser) => ser.value === s.service_id._id) || {
          label: s.service_id.name,
          value: s.service_id._id,
          sub_services: [],
        };

      // Find sub-service
      const subService =
        mainService.sub_services.find((sub) => sub.value === s.sub_service_id) || {
          label: "Unknown Sub-Service",
          value: s.sub_service_id,
          price: s.price,
          duration: s.duration || "",
        };

      // Preselect employee
      const assignedEmployee = s.employee_id
        ? { label: s.employee_id.name, value: s.employee_id._id }
        : null;

      return {
        service: mainService,
        subService,
        subServices: mainService.sub_services,
        employee: assignedEmployee,
        price: s.price,
        duration: s.duration || "",
      };
    });

    setServiceList(mappedServices);
  }, [editBooking, services]);

  // Handlers
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleServiceChange = (i, val) => {
    const updated = [...serviceList];
    updated[i].service = val;
    updated[i].subServices = val?.sub_services || [];
    updated[i].subService = null;
    updated[i].employee = null;
    updated[i].price = "";
    updated[i].duration = "";
    setServiceList(updated);
  };

  const handleSubServiceChange = (i, val) => {
    const updated = [...serviceList];
    updated[i].subService = val;
    updated[i].price = val?.price || "";
    updated[i].duration = val?.duration || "";
    setServiceList(updated);
  };

  const handleEmployeeChange = (i, val) => {
    const updated = [...serviceList];
    updated[i].employee = val;
    setServiceList(updated);
  };

  const addServiceBlock = () =>
    setServiceList([
      ...serviceList,
      { service: null, subService: null, subServices: [], employee: null, price: "", duration: "" },
    ]);

  const removeServiceBlock = (i) => {
    const updated = [...serviceList];
    updated.splice(i, 1);
    setServiceList(updated);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone)
      return setToast({ message: "Name & phone are required", type: "error" });

    const servicesPayload = serviceList
      .filter((s) => s.service && s.subService && s.employee)
      .map((s) => ({
        service_id: s.service.value,
        sub_service_id: s.subService.value,
        employee_id: s.employee.value,
        price: s.price,
        duration: s.duration,
      }));

    if (!servicesPayload.length)
      return setToast({ message: "Select at least one service with employee", type: "error" });

    const payload = { ...formData, services: servicesPayload };

    try {
      const res = await axios.put(`${BASE_URL}/appointments/${editBooking._id}`, payload);
      setToast({ message: "Booking updated successfully ✅", type: "info" });
      setTimeout(() => {
        onUpdated(res.data.appointment); // update parent page
        onClose(); // close modal
      }, 800);
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Failed to update booking", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`${BASE_URL}/appointments/${editBooking._id}`);
      setToast({ message: "Booking deleted successfully ✅", type: "info" });
      setTimeout(() => {
        onUpdated(null); // remove from parent
        onClose(); // close modal
      }, 800);
    } catch (err) {
      setToast({ message: "Failed to delete booking", type: "error" });
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
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Edit Booking</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-3 border rounded-xl w-full"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border rounded-xl w-full"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-3 border rounded-xl w-full"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 border rounded-xl w-full"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Services */}
          <div className="space-y-4">
            {serviceList.map((item, i) => (
              <div key={i} className="p-4 border rounded-xl relative bg-gray-50">
                <Select
                  options={services}
                  value={item.service}
                  onChange={(val) => handleServiceChange(i, val)}
                  placeholder="Select Service"
                  className="mb-2"
                />
                <Select
                  options={item.subServices}
                  value={item.subService}
                  onChange={(val) => handleSubServiceChange(i, val)}
                  placeholder="Select Sub-Service"
                  isDisabled={!item.subServices.length}
                  className="mb-2"
                />
                <Select
                  options={employees.map((e) => ({ label: e.name, value: e._id }))}
                  value={item.employee}
                  onChange={(val) => handleEmployeeChange(i, val)}
                  placeholder="Assign Employee"
                  className="mb-2"
                />

                {item.price && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>💰 ₹{item.price}</p>
                    {item.duration && <p>⏱ {item.duration}</p>}
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
              className="w-full p-2 rounded-xl bg-blue-100 text-blue-600 font-medium hover:bg-blue-200"
            >
              ➕ Add Service
            </button>
          </div>

          {/* Date & Payment */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 border rounded-xl w-full mt-4"
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Total Amount"
            className="p-3 border rounded-xl w-full mt-2"
          />

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-between gap-2 mt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full md:w-1/2 p-3 rounded-xl bg-red-100 text-red-600 font-medium hover:bg-red-200"
            >
              Delete Booking
            </button>
            <button
              type="submit"
              className="w-full md:w-1/2 p-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600"
            >
              Update Booking
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
