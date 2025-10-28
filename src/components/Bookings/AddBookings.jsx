import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Toast from "../Toast";
import { BASE_URL } from "../../data/data";

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
  const [toast, setToast] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    note: "",
    source: "walk-in",
    date: today,
    payment_mode: "",
  });

  // Fetch services
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

  // Fetch employees
  useEffect(() => {
    axios
      .get(`${BASE_URL}/employee`)
      .then((res) => {
        const formatted = res.data.employees.map((emp) => ({
          label: emp.name,
          value: emp._id,
        }));
        setEmployees(formatted);
      })
      .catch(() =>
        setToast({ message: "Failed to load employees", type: "error" })
      );
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // When phone reaches 10 digits → search customer
    if (name === "phone" && value.length === 10) {
      searchCustomerByPhone(value);
    }
  };

  // Search customer by phone
  // 🔍 Search customer by phone
  const searchCustomerByPhone = async (phone) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/appointments/customer/search?phone=${phone}`
      );

      // 🟢 Check if backend returned a customer
      if (res.data.success && res.data.customer) {
        const c = res.data.customer;

        setFormData((prev) => ({
          ...prev,
          name: c.name || "",
          email: c.email || "",
          gender: c.gender || "",
          dob: c.dob ? c.dob.split("T")[0] : "",
          address: c.address || "",
          note: c.note || "",
        }));

        setToast({
          message: "Customer found ✅",
          type: "info",
        });
      } else {
        setToast({
          message: "New customer — please fill details.",
          type: "info",
        });
      }
    } catch (err) {
      console.error("Error searching customer:", err);
      setToast({
        message: "Error searching customer.",
        type: "error",
      });
    }
  };

  // Handle service change
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

  // Handle sub-service change
  const handleSubServiceChange = (index, selectedSubService) => {
    const updated = [...serviceList];
    updated[index].subService = selectedSubService;
    updated[index].price = selectedSubService?.price || "";
    updated[index].duration = selectedSubService?.duration || "";
    setServiceList(updated);
  };

  // Add / Remove services
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

  const removeServiceBlock = (index) => {
    const updated = [...serviceList];
    updated.splice(index, 1);
    setServiceList(updated);
  };

  const totalAmount = serviceList.reduce(
    (acc, curr) => acc + (parseFloat(curr.price) || 0),
    0
  );

  // Submit
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
      // confirmation_status not sent — default true in schema
    };

    try {
      const res = await axios.post(`${BASE_URL}/appointments`, payload);
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

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      address: "",
      note: "",
      source: "walk-in",
      date: today,
      payment_mode: "",
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
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone *"
            className={requiredClass}
            required
          />
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
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="Date of Birth (optional)"
            className={optionalClass}
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
