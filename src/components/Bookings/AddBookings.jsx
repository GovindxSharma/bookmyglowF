import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "@/api/axiosInstance";
import Toast from "../Toast";
import Loader from "../Layout/Loader";
import {
  X,
  Sparkles,
  Phone,
  User,
  Calendar,
  CreditCard,
  Percent,
  Receipt,
  Share2,
  CheckCircle2,
  Scissors,
} from "lucide-react";
import { BASE_URL, SALON_CONFIG } from "../../data/data";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#FDFBF9",
    borderColor: state.isFocused ? "#4E6758" : "#D9D0C5",
    borderRadius: "14px",
    padding: "1px 3px",
    color: "#1F2421",
    boxShadow: state.isFocused ? "0 0 0 1px #4E6758" : "none",
    "&:hover": {
      borderColor: "#4E6758",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    borderRadius: "14px",
    border: "1px solid #EAE3D9",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4E6758"
      : state.isFocused
      ? "#EDF3EF"
      : "transparent",
    color: state.isSelected ? "#FFFFFF" : "#1F2421",
    fontSize: "13px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#1F2421",
    fontSize: "13px",
    fontWeight: "500",
  }),
  input: (base) => ({
    ...base,
    color: "#1F2421",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#8C948F",
    fontSize: "13px",
  }),
};

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
  const [discount, setDiscount] = useState("");
  const [lastCreatedBooking, setLastCreatedBooking] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "female",
    dob: "",
    address: "",
    note: "",
    source: "walk-in",
    date: today,
    appointment_time: "11:00 AM",
    payment_mode: "upi",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servicesRes, employeesRes] = await Promise.all([
          axios.get("/services"),
          axios.get("/employee"),
        ]);

        const formattedServices = (servicesRes.data || []).map((s) => ({
          label: s.name,
          value: s._id,
          sub_services: (s.sub_services || []).map((sub) => ({
            label: `${sub.name} — ₹${sub.price}`,
            value: sub._id,
            price: sub.price,
            duration: sub.duration || s.duration || "30 min",
          })),
        }));
        setServices(formattedServices);

        const formattedEmployees = (employeesRes.data?.employees || []).map(
          (emp) => ({
            label: `${emp.name} (${emp.gender === "female" ? "Stylist 👩" : "Stylist 👨"})`,
            value: emp._id,
          })
        );
        setEmployees(formattedEmployees);
      } catch {
        setToast({ message: "Failed to load services or staff", type: "error" });
      } finally {
        setFetchingData(false);
      }
    };

    fetchInitialData();
  }, []);

  const searchCustomerByPhone = async (phone) => {
    try {
      const res = await axios.get(`/appointments/customer/search?phone=${phone}`);

      if (res.data.success && res.data.customer) {
        const c = res.data.customer;
        setFormData((prev) => ({
          ...prev,
          name: c.name || "",
          email: c.email || "",
          gender: c.gender || "female",
          dob: c.dob ? c.dob.split("T")[0] : "",
          address: c.address || "",
          note: c.note || "",
        }));

        setToast({ message: `Returning customer: ${c.name} ✨`, type: "info" });
      }
    } catch {
      // New walk-in guest
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleServiceChange = (i, val) => {
    const updated = [...serviceList];
    updated[i].service = val;
    updated[i].subServices = val ? val.sub_services : [];
    updated[i].subService = val?.sub_services?.[0] || null;
    updated[i].price = val?.sub_services?.[0]?.price || "";
    updated[i].duration = val?.sub_services?.[0]?.duration || "";
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

  const rawSubtotal = serviceList.reduce(
    (acc, curr) => acc + (parseFloat(curr.price) || 0),
    0
  );

  const discountAmount = parseFloat(discount) || 0;
  const finalPayable = Math.max(0, rawSubtotal - discountAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name || !formData.phone) {
      return setToast({
        message: "Customer name and mobile number are required.",
        type: "error",
      });
    }

    if (formData.phone.length !== 10) {
      return setToast({
        message: "Please enter a valid 10-digit mobile number.",
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
        employee_id: assignEachService
          ? item.employee?.value || null
          : selectedEmployee?.value || null,
      }));

    if (servicesPayload.length === 0) {
      return setToast({
        message: "Please select at least one service.",
        type: "error",
      });
    }

    const payload = {
      ...formData,
      employee_id: assignEachService ? null : selectedEmployee?.value || null,
      services: servicesPayload,
      amount: finalPayable,
    };

    try {
      setLoading(true);
      const res = await axios.post("/appointments", payload);

      setToast({
        message: "Booking and bill recorded successfully! ✨",
        type: "info",
      });

      setLastCreatedBooking(res.data.appointment || { ...payload, _id: "new" });
      resetForm();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to record booking.",
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
      gender: "female",
      dob: "",
      address: "",
      note: "",
      source: "walk-in",
      date: today,
      appointment_time: "11:00 AM",
      payment_mode: "upi",
    });
    setSelectedEmployee(null);
    setDiscount("");
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

  const generateWhatsAppMessage = () => {
    if (!lastCreatedBooking) return;
    const clientName = lastCreatedBooking.customer_id?.name || formData.name || "Customer";
    const clientPhone = lastCreatedBooking.customer_id?.phone || formData.phone;
    const totalPaid = lastCreatedBooking.amount || finalPayable;

    const text = encodeURIComponent(
      `✨ *${SALON_CONFIG.name}* ✨\n\nHello *${clientName}*,\nThank you for visiting us today! 💇‍♀️\n\n📅 Date: ${today}\n💰 Bill Amount: ₹${totalPaid}\n💳 Payment Mode: ${lastCreatedBooking.payment_mode?.toUpperCase() || "PAID"}\n\n📍 ${SALON_CONFIG.address}\n📞 ${SALON_CONFIG.phone}\n\nHave a wonderful day ahead! 😊`
    );

    window.open(`https://wa.me/91${clientPhone}?text=${text}`, "_blank");
  };

  const inputBase =
    "px-3.5 py-2.5 rounded-xl border border-[#D9D0C5] bg-[#FDFBF9] focus:bg-white focus:border-[#4E6758] focus:ring-1 focus:ring-[#4E6758] text-xs sm:text-sm text-[#242A26] placeholder-[#8C948F] outline-none transition";

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center py-20 bg-[#FDFBF9]">
        <Loader size={180} />
      </div>
    );
  }

  return (
    <div className="py-2 text-[#242A26]">
      {/* Bill Generated Success Banner */}
      {lastCreatedBooking && (
        <div className="mb-6 p-4 rounded-2xl bg-white border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-soft-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-800 text-sm">
                Bill Generated: ₹{lastCreatedBooking.amount}
              </h4>
              <p className="text-xs text-[#555E58]">
                Appointment recorded. You can share the bill on WhatsApp with 1 click.
              </p>
            </div>
          </div>
          <button
            onClick={generateWhatsAppMessage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20BE5A] text-white font-semibold text-xs transition shadow-soft-sm"
          >
            <Share2 size={14} /> Send WhatsApp Bill
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CUSTOMER DETAILS */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3D9] shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#35473C] flex items-center gap-1.5">
              <User size={15} className="text-[#4E6758]" />
              Customer Information
            </h3>
            <span className="text-xs text-[#7D8480]">
              * Type 10 digits to search existing client
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#4A524D] mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className={`${inputBase} w-full pl-8`}
                  required
                  maxLength={10}
                />
                <Phone size={14} className="absolute left-2.5 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A524D] mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                className={`${inputBase} w-full`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A524D] mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`${inputBase} w-full`}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A524D] mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`${inputBase} w-full`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A524D] mb-1">
                Time Slot
              </label>
              <input
                type="text"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                placeholder="e.g. 11:30 AM"
                className={`${inputBase} w-full`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A524D] mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@gmail.com"
                className={`${inputBase} w-full`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A524D] mb-1">
              Customer Notes / Hair Requirements
            </label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="e.g. Needs hair spa before coloring, sensitive scalp"
              className={`${inputBase} w-full`}
            />
          </div>
        </div>

        {/* SERVICES CART */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3D9] shadow-soft-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2ECE4] pb-2.5 gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#35473C] flex items-center gap-1.5">
              <Scissors size={15} className="text-[#4E6758]" />
              Selected Services
            </h3>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#4E6758] cursor-pointer">
              <input
                type="checkbox"
                checked={assignEachService}
                onChange={(e) => setAssignEachService(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#4E6758] rounded"
              />
              Assign different stylist for each service
            </label>
          </div>

          <div className="space-y-3">
            {serviceList.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-[#FDFBF9] border border-[#EAE3D9] relative space-y-2.5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#555E58] mb-1">
                      Service Category *
                    </label>
                    <Select
                      options={services}
                      value={item.service}
                      onChange={(val) => handleServiceChange(index, val)}
                      placeholder="Category..."
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#555E58] mb-1">
                      Sub-Service / Package *
                    </label>
                    <Select
                      options={item.subServices}
                      value={item.subService}
                      onChange={(val) => handleSubServiceChange(index, val)}
                      placeholder="Select sub-service..."
                      isDisabled={!item.subServices?.length}
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#555E58] mb-1">
                      Price & Duration
                    </label>
                    <div className="h-[38px] flex items-center justify-between px-3.5 rounded-xl bg-white border border-[#D9D0C5] text-[#1F2421] font-semibold text-xs">
                      <span className="text-[#4E6758] font-bold">₹{item.price || 0}</span>
                      <span className="text-[11px] text-[#7D8480]">
                        {item.duration || "--"}
                      </span>
                    </div>
                  </div>
                </div>

                {assignEachService && (
                  <div className="pt-1.5">
                    <label className="block text-[11px] font-semibold text-[#555E58] mb-1">
                      Assigned Stylist:
                    </label>
                    <Select
                      options={employees}
                      value={item.employee}
                      onChange={(val) => handleEmployeeChangeForService(index, val)}
                      placeholder="Select Stylist..."
                      styles={customSelectStyles}
                    />
                  </div>
                )}

                {serviceList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeServiceBlock(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 flex items-center justify-center transition"
                    title="Remove item"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addServiceBlock}
              className="w-full py-2.5 rounded-2xl border border-dashed border-[#4E6758] text-[#4E6758] font-semibold text-xs hover:bg-[#EDF3EF] transition flex items-center justify-center gap-1.5"
            >
              + Add Another Service
            </button>
          </div>

          {!assignEachService && (
            <div className="pt-1">
              <label className="block text-xs font-semibold text-[#4A524D] mb-1">
                Primary Stylist (for this entire visit):
              </label>
              <Select
                options={employees}
                value={selectedEmployee}
                onChange={setSelectedEmployee}
                placeholder="Select Stylist..."
                styles={customSelectStyles}
              />
            </div>
          )}
        </div>

        {/* BILL SUMMARY & CHECKOUT */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3D9] shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#35473C] flex items-center gap-1.5">
              <Receipt size={16} className="text-[#4E6758]" />
              Bill Calculation & Payment
            </h3>
            <span className="text-xs bg-[#EDF3EF] text-[#35473C] px-3 py-1 rounded-full font-semibold">
              Walk-in POS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[#4A524D] font-semibold mb-1">
                Discount (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 pl-7 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] text-[#242A26] font-semibold text-xs sm:text-sm focus:border-[#4E6758] outline-none"
                />
                <Percent size={13} className="absolute left-2.5 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#4A524D] font-semibold mb-1">
                Payment Mode
              </label>
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] text-[#242A26] font-semibold text-xs sm:text-sm focus:border-[#4E6758] outline-none"
              >
                <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                <option value="cash">Cash</option>
                <option value="card">Card Payment</option>
                <option value="">Pay Later / Pending</option>
              </select>
            </div>

            <div className="bg-[#F8F5F0] rounded-2xl p-3.5 flex flex-col justify-between border border-[#EAE3D9]">
              <div className="flex justify-between text-xs text-[#68706B]">
                <span>Services Total:</span>
                <span>₹{rawSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 mt-1">
                  <span>Discount:</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline mt-1.5 pt-1.5 border-t border-[#EAE3D9]">
                <span className="text-xs font-bold text-[#35473C]">Total Payable:</span>
                <span className="text-xl font-bold text-[#1F2421]">₹{finalPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-soft-sm transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4E6758] hover:bg-[#405448]"
            }`}
          >
            {loading ? "Recording..." : "Save Appointment & Generate Bill ✨"}
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
  );
};

export default AddBooking;
