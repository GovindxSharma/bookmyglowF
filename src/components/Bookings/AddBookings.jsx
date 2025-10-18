import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Toast from "../Toast";

const AddBooking = () => {
  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedSubService, setSelectedSubService] = useState(null);
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
    amount: "",
    payment_mode: "",
    salon_id: "6708dc20b54f5c6a4d0cf9a2",
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
          })),
        }));
        setServices(formattedServices);
      })
      .catch(() => setToast({ message: "Failed to load services", type: "error" }));
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
      .catch(() => setToast({ message: "Failed to load employees", type: "error" }));
  }, []);

  // Update sub-services
  useEffect(() => {
    if (selectedService) {
      setSubServices(selectedService.sub_services);
      setSelectedSubService(null);
    } else setSubServices([]);
  }, [selectedService]);

  // Auto-fill amount
  useEffect(() => {
    if (selectedSubService) {
      setFormData((prev) => ({ ...prev, amount: selectedSubService.price }));
    }
  }, [selectedSubService]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      name: "",
      email: "",
      phone: "",
      gender: "",
      address: "",
      note: "",
      date: today,
      amount: "",
      payment_mode: "",
    });
    setSelectedService(null);
    setSelectedSubService(null);
    setSelectedEmployee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedService || !selectedEmployee || !formData.name || !formData.phone) {
      return setToast({ message: "Please fill all required fields.", type: "error" });
    }
  
    const payload = {
      ...formData,
      service_id: selectedService.value,
      employee_id: selectedEmployee.value,
      amount: formData.amount || selectedSubService?.price || 0,
      confirmation_status: true, // ✅ send true
    };
  
    if (selectedSubService) payload.sub_service_id = selectedSubService.value;
  
    try {
      const res = await axios.post("http://localhost:3000/appointments", payload);
      setToast({ message: res.data.message || "Booking created!", type: "info" });
      resetForm();
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Failed to create booking.", type: "error" });
    }
  };
  

  // Styles for required vs optional
  const requiredClass = "p-3 rounded-xl border border-blue-400 focus:ring-2 focus:ring-blue-400 w-full bg-blue-50";
  const optionalClass = "p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-300 w-full bg-gray-50";

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

        {/* Service & Sub-Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            options={services}
            value={selectedService}
            onChange={setSelectedService}
            placeholder="Select Service *"
            className="rounded-xl"
          />
          <Select
            options={subServices}
            value={selectedSubService}
            onChange={setSelectedSubService}
            placeholder="Select Sub-Service (optional)"
            isDisabled={!subServices.length}
            className="rounded-xl"
          />
        </div>

        {/* Employee */}
        <Select
          options={employees}
          value={selectedEmployee}
          onChange={setSelectedEmployee}
          placeholder="Assign Employee *"
          className="mt-4 rounded-xl"
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
            onChange={handleChange}
            placeholder="Amount (optional)"
            className={optionalClass}
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

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default AddBooking;
