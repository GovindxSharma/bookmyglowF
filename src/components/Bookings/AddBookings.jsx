import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Toast from "../Toast";

const AddBooking = () => {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
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

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    note: "",
    source: "online",
    date: today,
    payment_mode: "",
    salon_id: "6708dc20b54f5c6a4d0cf9a2",
    confirmation_status: true
  });

  const [toast, setToast] = useState(null);

  // Fetch services
  useEffect(() => {
    axios
      .get("http://localhost:3000/services")
      .then((res) => {
        const formattedServices = res.data.map((service) => ({
          label: service.name,
          value: service._id,
          sub_services: service.sub_services.map((sub) => ({
            label: `${sub.name} - ₹${sub.price}`,
            value: sub._id,
            price: sub.price,
            duration: sub.duration || "",
          })),
        }));
        setServices(formattedServices);
      })
      .catch(() =>
        setToast({ message: "Failed to load services", type: "error" })
      );
  }, []);

  // Fetch employees
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employees")
      .then((res) => {
        const formattedEmployees = res.data.employees.map((emp) => ({
          label: emp.name,
          value: emp._id,
        }));
        setEmployees(formattedEmployees);
      })
      .catch(() =>
        setToast({ message: "Failed to load employees", type: "error" })
      );
  }, []);

  // Handlers
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleServiceChange = (index, selectedService) => {
    const updated = [...serviceList];
    updated[index].service = selectedService;
    updated[index].subServices = selectedService
      ? selectedService.sub_services
      : [];
    updated[index].subService = null;
    updated[index].price = "";
    updated[index].duration = "";
    setServiceList(updated);
  };

  const handleSubServiceChange = (index, selectedSubService) => {
    const updated = [...serviceList];
    updated[index].subService = selectedSubService;
    updated[index].price = selectedSubService?.price || "";
    updated[index].duration = selectedSubService?.duration || "";
    setServiceList(updated);
  };

  const addServiceBlock = () => {
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
  };

  const removeServiceBlock = (index) => {
    const updated = [...serviceList];
    updated.splice(index, 1);
    setServiceList(updated);
  };

  const totalAmount = serviceList.reduce(
    (acc, curr) => acc + (parseFloat(curr.price) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !selectedEmployee) {
      return setToast({
        message: "Please fill all required fields.",
        type: "error",
      });
    }

    const servicesPayload = serviceList
      .filter((item) => item.service && item.subService)
      .map((item) => ({
        service_id: item.service.value,
        sub_service_id: item.subService.value,
        price: item.price,
        duration: item.duration,
      }));

    if (servicesPayload.length === 0) {
      return setToast({
        message: "Please select at least one service and sub-service.",
        type: "error",
      });
    }

    const payload = {
      ...formData,
      employee_id: selectedEmployee.value,
      services: servicesPayload,
      amount: totalAmount,
      confirmation_status: true,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/appointments",
        payload
      );
      setToast({
        message: res.data.message || "Booking created!",
        type: "info",
      });
      resetForm();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to create booking.",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      address: "",
      note: "",
      source: "online",
      date: today,
      payment_mode: "",
      salon_id: "6708dc20b54f5c6a4d0cf9a2",
    });
    setSelectedEmployee(null);
    setServiceList([
      {
        service: null,
        subService: null,
        subServices: [],
        price: "",
        duration: "",
      },
    ]);
  };

  const requiredClass =
    "p-3 rounded-xl border border-blue-400 focus:ring-2 focus:ring-blue-400 w-full bg-blue-50";
  const optionalClass =
    "p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-300 w-full bg-gray-50";

  return (
    <div className="p-6 bg-white rounded-3xl shadow-lg max-w-3xl mx-auto relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Booking</h2>

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

        {/* Multiple Services */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Select Services *
          </h3>
          {serviceList.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded-xl relative bg-gray-50"
            >
              <Select
                options={services}
                value={item.service}
                onChange={(val) => handleServiceChange(index, val)}
                placeholder="Select Service *"
                className="mb-3"
              />
              <Select
                options={item.subServices}
                value={item.subService}
                onChange={(val) => handleSubServiceChange(index, val)}
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
                  onClick={() => removeServiceBlock(index)}
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
          options={employees}
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
            placeholder={`Total Amount (₹${totalAmount})`}
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full p-3 mt-4 rounded-2xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
        >
          Create Booking
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
  );
};

export default AddBooking;
