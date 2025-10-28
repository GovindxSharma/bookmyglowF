import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../data/data";

const salonId = "68eb4a7fb6c1692cffcf1bcf";

const AppointmentForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    services: [],
    date: today,
    note: "",
  });
  const [services, setServices] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/services`);
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleServiceToggle = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.services.includes(id);
      const updated = alreadySelected
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id];
      return { ...prev, services: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || formData.services.length === 0) {
      alert("Please fill all required fields.");
      return;
    }
    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      salon_id: salonId,
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
        alert(`Appointment booked successfully for ${formData.name}!`);
        setFormData({ name: "", phone: "", services: [], date: today, note: "" });
      } else {
        alert(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Failed to create appointment:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <section
      id="book"
      className="relative py-20 px-5 sm:px-10 md:px-16 bg-gradient-to-br from-[#E5EBFF] via-[#F5F6FF] to-[#EBD6FB] overflow-hidden"
    >
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
          Choose your services, select a date, and relax — we’ll take care of the rest 
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-[#2A2A2A] font-medium mb-2 text-sm sm:text-base">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="border border-[#A3B0FF]/40 rounded-xl px-4 py-3 bg-[#F5F6FF] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all placeholder-gray-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-[#2A2A2A] font-medium mb-2 text-sm sm:text-base">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 99999 11111"
                className="border border-[#A3B0FF]/40 rounded-xl px-4 py-3 bg-[#F5F6FF] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all placeholder-gray-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Services Dropdown */}
            <div className="md:col-span-2 relative" ref={dropdownRef}>
              <label className="text-[#2A2A2A] font-medium mb-2 text-sm sm:text-base">
                Select Services
              </label>
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex justify-between items-center border border-[#A3B0FF]/40 rounded-xl px-4 py-3 bg-[#F5F6FF] cursor-pointer hover:ring-2 hover:ring-[#687FE5] transition-all"
              >
                <span className="text-[#2A2A2A] text-sm sm:text-base">
                  {formData.services.length > 0
                    ? `${formData.services.length} service(s) selected`
                    : "Choose Services"}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${openDropdown ? "rotate-180" : "rotate-0"}`}
                />
              </div>

              {openDropdown && (
                <div className="absolute mt-2 w-full bg-white border border-[#A3B0FF]/30 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
                  {services.length > 0 ? (
                    services.map((s) => (
                      <label
                        key={s._id}
                        className="flex items-center px-4 py-2 hover:bg-[#E8EBFF] cursor-pointer text-sm sm:text-base"
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(s._id)}
                          onChange={() => handleServiceToggle(s._id)}
                          className="mr-3 accent-[#687FE5]"
                        />
                        {s.name}
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-3 text-sm">Loading...</p>
                  )}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-[#2A2A2A] font-medium mb-2 text-sm sm:text-base">
                Preferred Date
              </label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                className="border border-[#A3B0FF]/40 rounded-xl px-4 py-3 bg-[#F5F6FF] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all text-sm sm:text-base"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-[#2A2A2A] font-medium mb-2 text-sm sm:text-base">
                Special Requests
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Any additional details or preferences..."
                rows={3}
                className="border border-[#A3B0FF]/40 rounded-xl px-4 py-3 bg-[#F5F6FF] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all text-sm sm:text-base placeholder-gray-400"
              />
            </div>
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
