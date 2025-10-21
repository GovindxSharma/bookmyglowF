import React, { useState, useEffect,useRef } from "react";
import { motion } from "framer-motion";
import { Phone ,ChevronDown } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../data/data";

///lets hope it works
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

  // Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle service selection toggle
  const handleServiceToggle = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.services.includes(id);
      const updatedServices = alreadySelected
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id];
      return { ...prev, services: updatedServices };
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

if (!formData.name.trim() || !formData.phone.trim() || formData.services.length === 0) {
  alert("Please fill all required fields.");
  return;
}

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      service_id: [formData.service], // ✅ send as array
      date: formData.date,
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
      } else {
        alert(res.data.message || "Something went wrong. Please try again.");
      }

      setFormData({
        name: "",
        phone: "",
        services: [],
        date: today,
        note: "",
      });
    } catch (err) {
      console.error("Failed to create appointment:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <section
      id="book"
      className="relative py-24 px-6 md:px-20 bg-gradient-to-br from-[#FEEBF6] via-[#FDFBFF] to-[#EBD6FB] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/symphony.png')] opacity-15"></div>

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
          Select your service and preferred date. We’ll make sure you get the best care possible.
        </p>
      </motion.div>

      <div className="flex flex-col items-center justify-center">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl w-full bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-[#EBD6FB]"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            />

            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            />

            {/* Service Dropdown */}
            <div className="relative md:col-span-2" ref={dropdownRef}>
              <div
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="flex justify-between items-center border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] cursor-pointer select-none focus:ring-2 focus:ring-[#687FE5]"
              >
                <span className="text-gray-700">
                  {formData.services.length > 0
                    ? `${formData.services.length} service(s) selected`
                    : "Choose Services"}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openDropdown ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {openDropdown && (
                <div className="absolute mt-2 w-full bg-white border border-[#EBD6FB] rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto">
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

            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={today}
              className="md:col-span-2 border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            />

            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Any special requests?"
              rows={3}
              className="md:col-span-2 border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            />
          </div>

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

      <div className="absolute top-20 left-10 w-72 h-72 bg-[#FCD8CD] rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#687FE5] rounded-full blur-3xl opacity-40 animate-pulse"></div>
    </section>
  );
};

export default AppointmentForm;
