import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import axios from "axios";

const salonId = "68eb4a7fb6c1692cffcf1bcf";

const AppointmentForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: today,
    note: "",
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.services.length === 0) {
      alert("Please select at least one service!");
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      service_id: formData.service,
      date: formData.date,
      salon_id: salonId,
      source: "online",
      seen: false,
      confirmation_status: false,
      note: formData.note || "",
    };

    try {
      await axios.post("http://localhost:3000/appointments", payload);
      alert(`Appointment booked successfully for ${formData.name}!`);
      setFormData({
        name: "",
        phone: "",
        service: "",
        date: today,
        note: "",
      });
    } catch (err) {
      console.error("Failed to create appointment:", err);
      alert("Something went wrong. Please try again.");
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
          Select your services and preferred date. We’ll make sure you get the
          best care possible.
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
            {/* Name */}
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            />

            {/* Phone */}
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            />

            {/* Service */}
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            >
              <option value="">Choose a Service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Date */}
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={today}
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            />

            {/* Note */}
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Any special requests?"
              rows={3}
              className="md:col-span-2 border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5] outline-none transition-all"
            />
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
              href="tel:+919999999999" // testing number
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
