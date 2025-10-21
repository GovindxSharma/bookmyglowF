import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Toast from "../Toast";
import { BASE_URL } from "../../data/data";

const BookingEditModal = ({ editBooking, employees, onClose, onUpdated }) => {
  const [services, setServices] = useState([]);
  const [serviceList, setServiceList] = useState([
    {
      service: null,
      subService: null,
      subServices: [],
      price: "",
      duration: "",
    },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Fetch all services for dropdown
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

  // Prefill edit data
  useEffect(() => {
    if (!editBooking) return;

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

    const emp = employees.find((e) => e._id === editBooking.employee_id?._id);
    setSelectedEmployee(emp ? { label: emp.name, value: emp._id } : null);

    const fetchServices = async () => {
      const mapped = await Promise.all(
        (editBooking.services || []).map(async (s) => {
          try {
            const { data } = await axios.get(
              `${BASE_URL}/services/${s.service_id._id}`
            );
            const mainService = {
              label: data.name,
              value: data._id,
              sub_services: data.sub_services.map((sub) => ({
                label: `${sub.name} - ₹${sub.price}`,
                value: sub._id,
                price: sub.price,
                duration: sub.duration || "",
              })),
            };
            const subService = mainService.sub_services.find(
              (sub) => sub.value === s.sub_service_id
            );
            return {
              service: mainService,
              subService: subService || null,
              subServices: mainService.sub_services,
              price: s.price,
              duration: s.duration || "",
            };
          } catch {
            return {
              service: null,
              subService: null,
              subServices: [],
              price: s.price,
              duration: s.duration || "",
            };
          }
        })
      );
      setServiceList(
        mapped.length
          ? mapped
          : [
              {
                service: null,
                subService: null,
                subServices: [],
                price: "",
                duration: "",
              },
            ]
      );
    };

    fetchServices();
  }, [editBooking, employees]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleServiceChange = (i, val) => {
    const updated = [...serviceList];
    updated[i].service = val;
    updated[i].subServices = val ? val.sub_services : [];
    updated[i].subService = null;
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

  const addServiceBlock = () =>
    setServiceList([
      ...serviceList,
      {
        service: null,
        subService: null,
        subServices: [],
        price: "",
        duration: "",
      },
    ]);

  const removeServiceBlock = (i) => {
    const updated = [...serviceList];
    updated.splice(i, 1);
    setServiceList(updated);
  };

  // 🧠 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !selectedEmployee)
      return setToast({
        message: "Please fill all required fields.",
        type: "error",
      });

    const servicesPayload = serviceList
      .filter((item) => item.service && item.subService)
      .map((item) => ({
        service_id: item.service.value,
        sub_service_id: item.subService.value,
        price: item.price,
        duration: item.duration,
      }));

    if (!servicesPayload.length)
      return setToast({
        message: "Select at least one service/sub-service.",
        type: "error",
      });

    const payload = {
      ...formData,
      employee_id: selectedEmployee.value,
      services: servicesPayload,
      confirmation_status: editBooking.confirmation_status || true,
    };

    try {
      const res = await axios.put(
        `${BASE_URL}/appointments/${editBooking._id}`,
        payload
      );

      setToast({
        message: res.data.message || "Booking updated successfully ✅",
        type: "info",
      });

      // ✅ Close modal after success and show booking list again
      setTimeout(() => {
        onUpdated(res.data.appointment);
        onClose(); // this should open booking list
      }, 1000);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to update booking",
        type: "error",
      });
    }
  };

  const requiredClass =
    "p-3 rounded-xl border border-blue-400 focus:ring-2 focus:ring-blue-400 w-full bg-blue-50";
  const optionalClass =
    "p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-300 w-full bg-gray-50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        overflow: "hidden",
      }}
      onClick={onClose} // click outside to close -> back to booking list
    >
      <div
        className="relative p-6 bg-white rounded-3xl shadow-lg max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`div::-webkit-scrollbar { display: none !important; }`}</style>

        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-transform hover:scale-110"
          title="Close"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Booking</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name *"
              className={requiredClass}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email (optional)"
              className={optionalClass}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone *"
              className={requiredClass}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={optionalClass}
            >
              <option value="">Gender (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address (optional)"
            className={optionalClass}
          />
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Notes (optional)"
            className={optionalClass}
          />

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Select Services *
            </h3>
            {serviceList.map((item, i) => (
              <div
                key={i}
                className="p-4 border border-gray-300 rounded-xl relative bg-gray-50"
              >
                <Select
                  options={services}
                  value={item.service}
                  onChange={(val) => handleServiceChange(i, val)}
                  placeholder="Select Service *"
                  className="mb-3"
                />
                <Select
                  options={item.subServices}
                  value={item.subService}
                  onChange={(val) => handleSubServiceChange(i, val)}
                  placeholder="Select Sub-Service *"
                  isDisabled={!item.subServices.length}
                  className="mb-3"
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
                    className="absolute top-2 right-3 text-red-500 font-semibold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addServiceBlock}
              className="w-full p-2 rounded-xl bg-blue-100 text-blue-600 font-medium hover:bg-blue-200 transition"
            >
              ➕ Add Another Service
            </button>
          </div>

          {/* Employee */}
          <Select
            options={employees.map((e) => ({ label: e.name, value: e._id }))}
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            placeholder="Assign Employee *"
            className="mt-4"
          />

          {/* Booking Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={requiredClass + " mt-4"}
            required
          />

          {/* Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="Total Amount"
              className={optionalClass + " font-semibold no-spinner"}
              min="0"
            />
            <select
              name="payment_mode"
              value={formData.payment_mode}
              onChange={handleChange}
              className={optionalClass}
            >
              <option value="">Payment Mode (optional)</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-4 rounded-2xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            Update Booking
          </button>
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
