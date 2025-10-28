import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const services = [
  {
    id: 1,
    name: "Hair Cut",
    image: "https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Trendy, stylish haircuts that define your personality.",
  },
  {
    id: 2,
    name: "Make-up",
    image: "https://images.unsplash.com/photo-1621691536086-e21b2439c73a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Flawless makeup for events, parties, and photoshoots.",
  },
  {
    id: 3,
    name: "Shaving",
    image: "https://images.unsplash.com/photo-1682325741756-1b5bfea9ae1a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Clean, smooth, and refreshing shaving experience.",
  },
  {
    id: 4,
    name: "Facial",
    image: "https://images.unsplash.com/photo-1731514771613-991a02407132?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Deep-cleansing facials for glowing and rejuvenated skin.",
  },
  {
    id: 5,
    name: "Waxing",
    image: "https://plus.unsplash.com/premium_photo-1664187387328-aeb82e38eefb?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Smooth, gentle waxing using premium organic products.",
  },
  {
    id: 6,
    name: "Hair Color",
    image: "https://plus.unsplash.com/premium_photo-1664301619580-03412defa987?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Express yourself with vibrant, professional hair colors.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-6 bg-gradient-to-b from-[#F5F6FF] to-[#EDEFFF]">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 text-[#636CCB]">
        Our <span className="text-[#4E56B2]">Premium Services</span>
      </h2>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-3 gap-10">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 w-full p-6 text-center text-white">
              <h3 className="text-2xl font-bold drop-shadow-lg">{service.name}</h3>
              <p className="mt-2 text-sm sm:text-base drop-shadow-md">{service.description}</p>
              <a
                href="#book"
                className="mt-4 inline-block bg-gradient-to-r from-[#636CCB] to-[#4E56B2] hover:from-[#4E56B2] hover:to-[#636CCB] px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Swiper Carousel */}
      <div className="md:hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
        >
          {services.map((service) => (
            <SwiperSlide key={service.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-56 object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 w-full p-4 text-center text-white">
                  <h3 className="text-lg font-bold drop-shadow-lg">{service.name}</h3>
                  <p className="mt-1 text-xs sm:text-sm drop-shadow-md">{service.description}</p>
                  <a
                    href="#book"
                    className="mt-3 inline-block bg-gradient-to-r from-[#636CCB] to-[#4E56B2] hover:from-[#4E56B2] hover:to-[#636CCB] px-4 py-2 rounded-full font-semibold shadow hover:shadow-md text-sm transition-all duration-300"
                  >
                    Book Now
                  </a>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ServicesSection;
