import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "@/api/axiosInstance";
import Toast from "../Toast";
import Loader from "../Layout/Loader";
import { X } from "lucide-react";
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
      employee: null,
    },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assignEachService, setAssignEachService] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

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
    amount: "",
  });

  // Fetch services + employees
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servicesRes, employeesRes] = await Promise.all([
          axios.get(`${BASE_URL}/services`),
          axios.get(`${BASE_URL}/employee`),
        ]);

        const formattedServices = servicesRes.data.map((s) => ({
          label: s.name,
          value: s._id,
          sub_services: s.sub_services.map((sub) => ({
            label: `${sub.name} - ₹${sub.price}`,
            value: sub._id,
            price: sub.price,
            duration: sub.duration || "",
          })),
        }));
        setServices(formattedServices);

        const formattedEmployees = employeesRes.data.employees.map((emp) => ({
          label: emp.name,
          value: emp._id,
        }));
        setEmployees(formattedEmployees);
      } catch {
        setToast({ message: "Failed to load initial data", type: "error" });
      } finally {
        setFetchingData(false);
      }
    };

    fetchInitialData();
  }, []);

  // Search existing customer by phone
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
        setToast({
          message: "New customer — please fill details.",
          type: "info",
        });
      }
    } catch {
      setToast({ message: "Error searching customer.", type: "error" });
    }
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone validation (only digits, max 10)
    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      if (onlyDigits.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: onlyDigits }));

        if (onlyDigits.length === 10) {
          searchCustomerByPhone(onlyDigits);
        }
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle service selection
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

  const handleEmployeeChangeForService = (i, val) => {
    const updated = [...serviceList];
    updated[i].employee = val;
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
        employee: null,
      },
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
    if (loading) return;

    if (!formData.name || !formData.phone)
      return setToast({
        message: "Please fill all required fields.",
        type: "error",
      });

    // Phone must be exactly 10 digits
    if (formData.phone.length !== 10)
      return setToast({
        message: "Phone number must be exactly 10 digits.",
        type: "error",
      });

    const servicesPayload = serviceList
      .filter((item) => item.service && item.subService)
      .map((item) => ({
        service_id: item.service.value,
        sub_service_id: item.subService.value,
        price: item.price,
        duration: item.duration,
        employee_id: assignEachService
          ? item.employee?.value || null
          : selectedEmployee?.value || null,
      }));

    if (servicesPayload.length === 0)
      return setToast({
        message: "Please select at least one service and sub-service.",
        type: "error",
      });

    if (assignEachService && servicesPayload.some((s) => !s.employee_id))
      return setToast({
        message: "Please assign an employee for each service.",
        type: "error",
      });

    if (!assignEachService && !selectedEmployee)
      return setToast({ message: "Please select an employee.", type: "error" });

    const payload = {
      ...formData,
      employee_id: assignEachService ? null : selectedEmployee.value,
      services: servicesPayload,
      amount: formData.amount || totalAmount,
    };

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/appointments`, payload);

      setToast({
        message: res.data.message || "Booking created successfully ✅",
        type: "info",
      });

      resetForm();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to create booking.",
        type: "error",
      });
    } finally {
      setLoading(false);
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
      amount: "",
    });
    setSelectedEmployee(null);
    setServiceList([
      {
        service: null,
        subService: null,
        subServices: [],
        price: "",
        duration: "",
        employee: null,
      },
    ]);
    setAssignEachService(false);
  };

  const inputBase =
    "p-3 rounded-xl border focus:ring-2 w-full transition text-gray-800 placeholder-gray-500 text-sm sm:text-base backdrop-blur-md bg-white/70 focus:bg-white";
  const requiredClass = `${inputBase} border-[#4A6CF7] focus:ring-[#4A6CF7]/40`;
  const optionalClass = `${inputBase} border-gray-200 focus:ring-gray-300`;

  if (fetchingData)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#EEF3FF] to-white">
        <Loader size={250} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FF] via-[#F8FAFF] to-white py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-3xl p-6 sm:p-10 space-y-8">
        <h2 className="text-3xl font-bold text-[#4A6CF7] text-center mb-4 tracking-tight drop-shadow-sm">
          Create New Booking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* CUSTOMER INFO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* UPDATED PHONE INPUT */}
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone *"
                className={requiredClass}
                required
                maxLength={10}
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
                className={optionalClass}
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={optionalClass}
                required
              >
                <option value="">Gender (optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address (optional)"
                className={optionalClass}
              />
            </div>

            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Notes (optional)"
              className={`${optionalClass} h-24`}
            />
          </div>

          {/* SERVICES */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-700">Services</h3>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={assignEachService}
                  onChange={(e) => setAssignEachService(e.target.checked)}
                  className="w-4 h-4 accent-[#4A6CF7]"
                />
                Assign employee per service
              </label>
            </div>

            {serviceList.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-gradient-to-tr from-[#F5F8FF] to-white border border-gray-200 shadow-md relative"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Select
                    options={services}
                    value={item.service}
                    onChange={(val) => handleServiceChange(index, val)}
                    placeholder="Select Service *"
                  />

                  <Select
                    options={item.subServices}
                    value={item.subService}
                    onChange={(val) => handleSubServiceChange(index, val)}
                    placeholder="Select Sub-Service *"
                    isDisabled={!item.subServices.length}
                  />

                  {item.price && (
                    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white border border-[#4A6CF7]/30 text-[#4A6CF7] font-semibold text-sm shadow-sm">
                      <span>₹{item.price}</span>
                      {item.duration && <span>{item.duration}</span>}
                    </div>
                  )}
                </div>

                {assignEachService && (
                  <div className="mt-3">
                    <Select
                      options={employees}
                      value={item.employee}
                      onChange={(val) =>
                        handleEmployeeChangeForService(index, val)
                      }
                      placeholder="Assign Employee *"
                    />
                  </div>
                )}

                {serviceList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeServiceBlock(index)}
                    className="absolute top-2.5 right-2.5 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-400 shadow-sm transition-all duration-200"
                    title="Remove Service"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addServiceBlock}
              className="w-full py-3 bg-[#4A6CF7]/10 text-[#4A6CF7] rounded-xl font-semibold hover:bg-[#4A6CF7]/20 transition"
            >
              ➕ Add Another Service
            </button>
          </div>

          {!assignEachService && (
            <Select
              options={employees}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              placeholder="Assign Employee *"
              className="mt-4"
            />
          )}

          {/* PAYMENT */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Payment & Date
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={requiredClass}
                required
              />

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, amount: e.target.value }))
                }
                placeholder={`Total Amount (₹${totalAmount})`}
                className={`${optionalClass} font-semibold`}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 rounded-2xl font-bold transition duration-300 shadow-md ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#4A6CF7] hover:bg-[#3855D1] text-white"
            }`}
          >
            {loading ? "Creating..." : "Create Booking"}
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

export default AddBooking;
