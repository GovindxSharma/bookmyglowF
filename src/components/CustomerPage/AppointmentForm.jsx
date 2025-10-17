import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import axios from "axios";

const salonId = "68eb4a7fb6c1692cffcf1bcf"; // hardcoded for now

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    note: "",
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/services");
        setServices(res.data); // make sure your API returns _id for each service
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

    if (!formData.service) {
      alert("Please select a service");
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      service_id: formData.service, // ✅ this is now ObjectId
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
        date: "",
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
      className="py-24 px-6 md:px-20 bg-gradient-to-r from-[#FEEBF6] via-[#FDFBFF] to-[#EBD6FB] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/symphony.png')] opacity-20"></div>

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-6 text-gray-900"
      >
        Book Your Appointment 💆‍♀️
      </motion.h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
        Take a moment to relax — we’ll handle the rest. Choose your service and
        reserve your time, or call us directly to book instantly.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-[#EBD6FB] w-full md:w-2/3"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5]"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5]"
            />
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5]"
            >
              <option value="">Choose a Service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5]"
            />
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Any special requests?"
              rows={3}
              className="md:col-span-2 border border-[#FEEBF6] rounded-xl px-4 py-3 bg-[#FFF8FB] focus:ring-2 focus:ring-[#687FE5]"
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
              href="tel:+919876543210"
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
