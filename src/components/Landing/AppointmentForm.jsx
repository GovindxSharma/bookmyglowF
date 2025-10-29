import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../data/data";
import CustomerAlert from "../Layout/CustomerAlert";

const AppointmentForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    services: [],
    date: today,
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "info", message: "" });

  const dropdownRef = useRef(null);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/services`);
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setAlert({
          show: true,
          type: "error",
          message: "Failed to load services. Please refresh.",
        });
      }
    };
    fetchServices();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name")
      setErrors((prev) => ({
        ...prev,
        name: value.trim() === "" ? "Name is required." : "",
      }));

    if (name === "phone") {
      const phoneRegex = /^[6-9]\d{9}$/;
      setErrors((prev) => ({
        ...prev,
        phone: !phoneRegex.test(value)
          ? "Enter a valid 10-digit phone number."
          : "",
      }));
    }
  };

  const handleServiceToggle = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.services.includes(id);
      const updated = alreadySelected
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id];
      return { ...prev, services: updated };
    });
    setErrors((prev) => ({ ...prev, services: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (formData.services.length === 0)
      newErrors.services = "Please select at least one service.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      services: formData.services.map((id) => ({ service_id: id })),
      date: formData.date,
      source: "online",
      seen: false,
      confirmation_status: false,
      note: formData.note.trim() || "",
    };

    try {
      const res = await axios.post(`${BASE_URL}/appointments`, payload);
      if (res.data.success) {
        setAlert({
          show: true,
          type: "success",
          message: `Appointment booked successfully for ${formData.name}!`,
        });
        setFormData({ name: "", phone: "", services: [], date: today, note: "" });
        setErrors({});
      } else {
        setAlert({
          show: true,
          type: "error",
          message: res.data.message || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Failed to create appointment:", err);
      setAlert({
        show: true,
        type: "error",
        message: "Server error. Please try again later.",
      });
    }
  };

  return (
    <section
      id="book"
      className="relative py-20 px-5 sm:px-10 md:px-16 bg-gradient-to-br from-[#E5EBFF] via-[#F5F6FF] to-[#EBD6FB] overflow-hidden"
    >
      {/* Alert Component */}
      <CustomerAlert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* Decorative Blurs */}
      <div className="absolute top-[-50px] left-[-50px] w-[250px] h-[250px] bg-[#687FE5]/40 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] bg-[#636CCB]/40 rounded-full blur-[150px] animate-pulse"></div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center relative z-10 mb-12 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4E56B2] mb-3">
          Book Your Appointment
        </h2>
        <p className="text-[#2A2A2A]/80 max-w-2xl mx-auto text-base sm:text-lg">
          Choose your services, select a date, and relax — we’ll take care of the rest.
        </p>
      </motion.div>

      {/* Form */}
      <div className="flex justify-center">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-3xl bg-white/90 backdrop-blur-xl border border-[#A3B0FF]/30 p-8 sm:p-10 md:p-12 rounded-3xl shadow-2xl"
        >
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-[#4E56B2] font-semibold mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-[#A3B0FF]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-[#4E56B2] font-semibold mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              className="w-full px-4 py-3 border border-[#A3B0FF]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Services Dropdown */}
          <div className="mb-6 relative" ref={dropdownRef}>
            <label className="block text-[#4E56B2] font-semibold mb-2">
              Select Services <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => !prev)}
              className="w-full px-4 py-3 border border-[#A3B0FF]/40 rounded-xl flex justify-between items-center bg-white"
            >
              <span>
                {formData.services.length > 0
                  ? `${formData.services.length} selected`
                  : "Choose services"}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  openDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
           
              {openDropdown && (
                <div className="absolute mt-2 w-full bg-white border border-[#A3B0FF]/40 rounded-xl shadow-lg z-50">
                  <div className="max-h-60 overflow-y-auto">
                    {services.length > 0 ? (
                      services.map((s) => (
                        <label
                          key={s._id}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-[#EEF0FF] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(s._id)}
                            onChange={() => handleServiceToggle(s._id)}
                            className="accent-[#636CCB]"
                          />
                          <span>{s.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-3">Loading services...</p>
                    )}
                  </div>
              
                  {/* ✅ Sticky Done button always visible */}
                  <div className="sticky bottom-0 bg-white border-t border-[#A3B0FF]/30">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(false)}
                      className="w-full text-center py-2 font-semibold text-[#636CCB] hover:bg-[#EEF0FF]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
              
            

            {errors.services && (
              <p className="text-red-500 text-sm mt-1">{errors.services}</p>
            )}
          </div>

          {/* Date */}
          <div className="mb-6">
            <label className="block text-[#4E56B2] font-semibold mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              min={today}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#A3B0FF]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-[#4E56B2] font-semibold mb-2">
              Additional Notes
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Any specific requests?"
              rows={4}
              className="w-full px-4 py-3 border border-[#A3B0FF]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#636CCB] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center text-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-10 py-3 bg-gradient-to-r from-[#636CCB] to-[#687FE5] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
            >
              Confirm Appointment
            </motion.button>

            <motion.a
              href="tel:+919904334450"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-8 sm:px-10 py-3 border-2 border-[#636CCB] text-[#636CCB] rounded-full font-semibold hover:bg-[#636CCB]/10 transition-all duration-300 w-full sm:w-auto"
            >
              <Phone size={20} /> Call to Book
            </motion.a>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default AppointmentForm;
