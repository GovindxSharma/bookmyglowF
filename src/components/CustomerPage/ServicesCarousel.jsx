import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const ServicesCarousel = ({ services }) => {
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
  );
};

export default ServicesCarousel;
