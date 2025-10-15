import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const services = [
  {
    id: 1,
    name: "Haircut & Styling",
    description: "Trendy cuts and stunning styles to suit your personality.",
    image:
      "https://images.unsplash.com/photo-1600180758890-6d5bbf4a0d7d?auto=format&fit=crop&w=800&q=80",
    price: "₹500",
  },
  {
    id: 2,
    name: "Facial & Skincare",
    description: "Luxurious facials that refresh and rejuvenate your skin.",
    image:
      "https://images.unsplash.com/photo-1598514982357-d7b5b75b4e26?auto=format&fit=crop&w=800&q=80",
    price: "₹1200",
  },
  {
    id: 3,
    name: "Manicure & Pedicure",
    description: "Pamper yourself with our spa-grade manicure and pedicure.",
    image:
      "https://images.unsplash.com/photo-1603287681836-50e2d44c7b29?auto=format&fit=crop&w=800&q=80",
    price: "₹800",
  },
  {
    id: 4,
    name: "Hair Spa & Treatment",
    description: "Nourish and revitalize your hair with deep treatments.",
    image:
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80",
    price: "₹1500",
  },
  {
    id: 5,
    name: "Bridal Makeup",
    description:
      "Elegant bridal looks to make your special day unforgettable.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    price: "₹2500",
  },
];

// Custom Arrows (moved more to the side)
const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 bg-[#687FE5] hover:bg-[#5a6fd8] text-white p-3 rounded-full cursor-pointer shadow-xl transition-all duration-300 z-20"
  >
    <ChevronRight size={24} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 bg-[#687FE5] hover:bg-[#5a6fd8] text-white p-3 rounded-full cursor-pointer shadow-xl transition-all duration-300 z-20"
  >
    <ChevronLeft size={24} />
  </div>
);

const CustomerPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    note: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment booked successfully for ${formData.name}!`);
    setFormData({
      name: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      note: "",
    });
  };

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="font-poppins text-gray-800 overflow-hidden">
      {/* 🌸 HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDFE] via-[#FEEBF6] to-[#EBD6FB] min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-20">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-[#FCD8CD]/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#687FE5]/40 rounded-full blur-[120px]"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 flex flex-col gap-6 max-w-xl text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            The best place to{" "}
            <span className="text-[#687FE5] font-pacifico">relax</span> <br />
            and{" "}
            <span className="text-[#FCD8CD] font-pacifico">glow</span> ✨
          </h1>

          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Discover premium salon experiences designed to help you unwind,
            refresh, and reveal your natural beauty — because you deserve it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.a
              href="#book"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#687FE5] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Book Appointment
            </motion.a>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-[#687FE5] text-[#687FE5] px-8 py-3 rounded-full font-semibold hover:bg-[#687FE5]/10 transition-all duration-300"
            >
              Explore Services
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-16 md:mt-0 md:ml-10"
        >
          <div className="relative w-[280px] md:w-[400px] h-[280px] md:h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#687FE5] via-[#EBD6FB] to-[#FCD8CD] rounded-[50%_40%_60%_50%/50%_60%_40%_50%] blur-[2px] animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1600180758890-6d5bbf4a0d7d?auto=format&fit=crop&w=800&q=80"
              alt="Salon"
              className="absolute inset-0 w-full h-full object-cover rounded-[50%_40%_60%_50%/50%_60%_40%_50%] shadow-xl"
            />
          </div>
        </motion.div>
      </section>

      {/* 💇 SERVICES CAROUSEL */}
      <section
        id="services"
        className="py-20 px-6 md:px-20 bg-[#FDFBFF] relative"
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-14 text-gray-900"
        >
          Our <span className="text-[#687FE5]">Signature Services</span>
        </motion.h2>

        <div className="max-w-6xl mx-auto relative">
          <Slider {...carouselSettings}>
            {services.map((service, index) => (
              <div key={service.id} className="px-3">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#EBD6FB]"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {service.description}
                    </p>
                    <p className="text-[#687FE5] font-semibold mb-3">
                      {service.price}
                    </p>
                    <a
                      href="#book"
                      className="inline-block px-5 py-2 bg-[#687FE5] text-white rounded-full text-sm hover:bg-[#5a6fd8] transition-all"
                    >
                      Book Now
                    </a>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* 🧾 SEXY APPOINTMENT FORM SECTION */}
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
          {/* Form Card */}
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
                  <option key={s.id} value={s.name}>
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
              <input
                name="time"
                type="time"
                value={formData.time}
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
    </div>
  );
};

export default CustomerPage;
