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
      className="relative py-20 px-6 md:px-16 bg-gradient-to-br from-[#FEEBF6] via-[#FDFBFF] to-[#EBD6FB] overflow-hidden"
    >
      {/* Subtle pattern & blurs */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/symphony.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-[#FCD8CD]/40 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#687FE5]/40 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Book Your Appointment
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Select your services, choose your date, and we’ll handle the rest 💆‍♀️
        </p>
      </motion.div>

      <div className="flex justify-center">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl w-full bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#EBD6FB]"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1 ml-1">Full Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="border border-[#EBD6FB] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all placeholder-gray-400"
                placeholder="Enter your name"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1 ml-1">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border border-[#EBD6FB] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all placeholder-gray-400"
                placeholder="+91 9999911111"
              />
            </div>

            {/* Services Dropdown */}
            <div className="relative md:col-span-2 flex flex-col" ref={dropdownRef}>
              <label className="text-gray-700 font-medium mb-1 ml-1">Select Services</label>
              <div
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="flex justify-between items-center border border-[#EBD6FB] rounded-xl px-4 py-3 bg-[#FFF8FB] cursor-pointer focus:ring-2 focus:ring-[#687FE5] transition-all"
              >
                <span className="text-gray-700">
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
                <div className="absolute mt-2 w-full bg-white border border-[#EBD6FB] rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto">
                  {services.map((s) => (
                    <label
                      key={s._id}
                      className="flex items-center px-4 py-2 hover:bg-[#F8F4FF] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.services.includes(s._id)}
                        onChange={() => handleServiceToggle(s._id)}
                        className="mr-3 accent-[#687FE5]"
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-gray-700 font-medium mb-1 ml-1">Preferred Date</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={today}
                className="border border-[#EBD6FB] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-gray-700 font-medium mb-1 ml-1">Special Requests</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Any additional details or preferences..."
                rows={3}
                className="border border-[#EBD6FB] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all placeholder-gray-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="text-center mt-10 flex flex-col sm:flex-row justify-center gap-5">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-3 bg-[#687FE5] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#5a6fd8] transition-all duration-300"
            >
              Confirm Appointment
            </motion.button>

            <motion.a
              href="tel:+919999999999"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#687FE5] text-[#687FE5] rounded-full font-semibold hover:bg-[#687FE5]/10 transition-all duration-300"
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
