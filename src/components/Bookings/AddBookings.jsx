import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "@/api/axiosInstance";
import Toast from "../Toast";
import { BASE_URL } from "../../data/data";

const AddBooking = () => {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [serviceList, setServiceList] = useState([
    { service: null, subService: null, subServices: [], price: "", duration: "" },
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "phone" && value.length === 10) searchCustomerByPhone(value);
  };

  // Search by phone
  const searchCustomerByPhone = async (phone) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/appointments/customer/search?phone=${phone}`
      );
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
        setToast({ message: "Customer found ✅", type: "info" });
      } else {
        setToast({ message: "New customer — please fill details.", type: "info" });
      }
    } catch {
      setToast({ message: "Error searching customer.", type: "error" });
    }
  };

  // Service handlers
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
      { service: null, subService: null, subServices: [], price: "", duration: "" },
    ]);

  const removeServiceBlock = (i) => {
    const updated = [...serviceList];
    updated.splice(i, 1);
    setServiceList(updated);
  };

  const totalAmount = serviceList.reduce(
    (acc, curr) => acc + (parseFloat(curr.price) || 0),
    0
  );

  // Submit
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

    if (servicesPayload.length === 0)
      return setToast({
        message: "Please select at least one service and sub-service.",
        type: "error",
      });

    const payload = {
      ...formData,
      employee_id: selectedEmployee.value,
      services: servicesPayload,
      amount: totalAmount,
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
      { service: null, subService: null, subServices: [], price: "", duration: "" },
    ]);
  };

  const inputBase =
    "p-3 rounded-xl border focus:ring-2 w-full transition text-gray-800 placeholder-gray-500";
  const requiredClass = `${inputBase} border-[#4A6CF7] focus:ring-[#4A6CF7]/50 bg-[#EEF2FF]`;
  const optionalClass = `${inputBase} border-gray-200 focus:ring-gray-300 bg-gray-50`;

  return (
    <div className="bg-gradient-to-br from-[#EEF3FF] to-white min-h-screen py-10 px-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl mx-auto p-10 border border-gray-100">
        <h2 className="text-3xl font-bold text-[#4A6CF7] mb-10 text-center tracking-tight">
          Create New Booking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="Phone *" className={requiredClass} required />
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="Full Name *" className={requiredClass} required />
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email (optional)" className={optionalClass} />
            <input type="date" name="dob" value={formData.dob} onChange={handleChange}
              className={optionalClass} />
            <select name="gender" value={formData.gender} onChange={handleChange}
              className={optionalClass}>
              <option value="">Gender (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="text" name="address" value={formData.address}
              onChange={handleChange} placeholder="Address (optional)"
              className={optionalClass} />
          </div>

          <textarea name="note" value={formData.note} onChange={handleChange}
            placeholder="Notes (optional)"
            className={`${optionalClass} h-24`} />

          {/* Services */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 border-gray-200">
              Select Services *
            </h3>
            {serviceList.map((item, index) => (
              <div key={index} className="p-5 border border-gray-200 rounded-2xl bg-[#F8FAFF] relative shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select options={services} value={item.service}
                    onChange={(val) => handleServiceChange(index, val)}
                    placeholder="Select Service *" />
                  <Select options={item.subServices} value={item.subService}
                    onChange={(val) => handleSubServiceChange(index, val)}
                    placeholder="Select Sub-Service *"
                    isDisabled={!item.subServices.length} />
                  {item.price && (
                    <div className="flex items-center justify-between text-sm text-[#4A6CF7] font-medium bg-white rounded-xl px-3 py-2 border border-[#4A6CF7]/20 shadow-sm">
                      <span>₹{item.price}</span>
                      {item.duration && <span>{item.duration}</span>}
                    </div>
                  )}
                </div>
                {serviceList.length > 1 && (
                  <button type="button" onClick={() => removeServiceBlock(index)}
                    className="absolute top-3 right-4 text-red-500 hover:text-red-600 font-bold text-lg">
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addServiceBlock}
              className="w-full p-3 rounded-xl bg-[#4A6CF7]/10 text-[#4A6CF7] font-medium hover:bg-[#4A6CF7]/20 transition">
              ➕ Add Another Service
            </button>
          </div>

          {/* Employee */}
          <Select options={employees} value={selectedEmployee}
            onChange={setSelectedEmployee}
            placeholder="Assign Employee *" className="mt-2" />

          {/* Date + Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="date" name="date" value={formData.date} onChange={handleChange}
              className={requiredClass} required />
            <input type="number" name="amount" value={formData.amount}
              onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
              placeholder={`Total Amount (₹${totalAmount})`}
              className={`${optionalClass} font-semibold no-spinner`} min="0" />
            <select name="payment_mode" value={formData.payment_mode} onChange={handleChange}
              className={optionalClass}>
              <option value="">Payment Mode (optional)</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit"
            className="w-full p-4 rounded-2xl bg-[#4A6CF7] text-white font-semibold hover:bg-[#3855D1] transition duration-300 shadow-md">
            Create Booking
          </button>
        </form>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </div>
  );
};

export default AddBooking;
