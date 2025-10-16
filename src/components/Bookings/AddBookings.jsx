import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const AddBooking = () => {
  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedSubService, setSelectedSubService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    note: "",
    source: "online",
    date: "",
    appointment_time: "",
    amount: "",
    payment_mode: "",
    salon_id: "6708dc20b54f5c6a4d0cf9a2", // hardcoded for now
  });

  // 🟢 Fetch Services
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
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  // 🟢 Fetch Employees
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
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // 🟢 When service changes, reset sub-services
  useEffect(() => {
    if (selectedService) {
      setSubServices(selectedService.sub_services);
      setSelectedSubService(null);
    } else {
      setSubServices([]);
    }
  }, [selectedService]);

  // 🟢 Auto-fill amount when sub-service is selected
  useEffect(() => {
    if (selectedSubService) {
      setFormData((prev) => ({ ...prev, amount: selectedSubService.price }));
    }
  }, [selectedSubService]);

  // 🟢 Handle Input Changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🟢 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedService || !selectedEmployee) {
      alert("Please select both a service and employee.");
      return;
    }
  
    const payload = {
      ...formData,
      service_id: selectedService.value,
      employee_id: selectedEmployee.value,
      amount: formData.amount || selectedSubService?.price || 0,
    };
  
    // Only include sub_service_id if selected
    if (selectedSubService) {
      payload.sub_service_id = selectedSubService.value;
    }
  
    try {
      const res = await axios.post("http://localhost:3000/appointments", payload);
      alert(res.data.message || "Booking created successfully!");
      resetForm();
    } catch (err) {
      console.error("Error creating booking:", err);
      alert(err.response?.data?.message || "Failed to create booking.");
    }
  };
  

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      address: "",
      note: "",
      source: "online",
      date: "",
      appointment_time: "",
      amount: "",
      payment_mode: "",
      salon_id: "6708dc20b54f5c6a4d0cf9a2",
    });
    setSelectedService(null);
    setSelectedSubService(null);
    setSelectedEmployee(null);
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🧍 Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
        />
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Notes"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
        />

        {/* ✂️ Service & Sub-Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            options={services}
            value={selectedService}
            onChange={setSelectedService}
            placeholder="Select Service"
            isSearchable
            className="rounded-xl"
          />
          <Select
            options={subServices}
            value={selectedSubService}
            onChange={setSelectedSubService}
            placeholder="Select Sub-Service"
            isSearchable
            className="rounded-xl"
            isDisabled={!subServices.length}
          />
        </div>

        {/* 👩‍💼 Employee */}
        <Select
          options={employees}
          value={selectedEmployee}
          onChange={setSelectedEmployee}
          placeholder="Assign Employee"
          isSearchable
          className="rounded-xl mt-4"
        />

        {/* 📅 Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
            required
          />
          <input
            type="time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
            required
          />
        </div>

        {/* 💰 Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
            required
          />
          <select
            name="payment_mode"
            value={formData.payment_mode}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#687FE5] w-full"
            required
          >
            <option value="">Payment Mode</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* ✅ Submit */}
        <button
          type="submit"
          className="w-full p-3 mt-4 rounded-2xl bg-[#687FE5] text-white font-semibold hover:bg-[#556fd1] transition"
        >
          Create Booking
        </button>
      </form>
    </div>
  );
};

export default AddBooking;
