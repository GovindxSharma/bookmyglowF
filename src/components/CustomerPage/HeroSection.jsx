import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDFE] via-[#FEEBF6] to-[#EBD6FB] min-h-screen flex flex-col md:flex-row items-center justify-center px-6 sm:px-10 md:px-16 py-20 md:py-24">
      {/* Decorative blurred circles */}
      <div className="absolute top-[-15%] left-[-25%] w-[300px] sm:w-[350px] md:w-[400px] h-[300px] sm:h-[350px] md:h-[400px] bg-[#FCD8CD]/50 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-25%] w-[320px] sm:w-[400px] md:w-[450px] h-[320px] sm:h-[400px] md:h-[450px] bg-[#687FE5]/40 rounded-full blur-[130px] animate-pulse"></div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col gap-6 max-w-xl text-center md:text-left"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
          The best place to{" "}
          <span className="text-[#687FE5] font-pacifico drop-shadow-sm">
            relax
          </span>{" "}
          <br className="hidden sm:block" />
          and{" "}
          <span className="text-[#FCD8CD] font-pacifico drop-shadow-sm">
            glow
          </span>{" "}
          ✨
        </h1>

        <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed max-w-md md:max-w-lg mx-auto md:mx-0">
          Discover premium salon experiences designed to help you unwind,
          refresh, and reveal your natural beauty — because you deserve it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
          <motion.a
            href="#book"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#687FE5] text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-[#5a70d6] transition-all duration-300 text-center"
          >
            Book Appointment
          </motion.a>

          <motion.a
            href="#services"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-[#687FE5] text-[#687FE5] px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-[#687FE5]/10 shadow-md hover:shadow-lg transition-all duration-300 text-center"
          >
            Explore Services
          </motion.a>
        </div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="relative mt-12 sm:mt-16 md:mt-0 md:ml-10 lg:ml-16 z-10 flex justify-center"
      >
        <div className="relative w-[220px] sm:w-[300px] md:w-[380px] lg:w-[420px] h-[220px] sm:h-[300px] md:h-[380px] lg:h-[420px]">
          {/* Gradient Glow */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-tr from-[#687FE5] via-[#EBD6FB] to-[#FCD8CD] rounded-[55%_45%_65%_45%/55%_60%_45%_55%] blur-[3px]"
          ></motion.div>

          {/* PNG Image */}
          <img
            src="https://png.pngtree.com/png-clipart/20240311/original/pngtree-working-as-hairdresser-hair-salon-and-barber-shop-png-image_14565273.png"
            alt="Salon"
            className="absolute inset-0 w-full h-full object-contain rounded-[55%_45%_65%_45%/55%_60%_45%_55%] shadow-2xl drop-shadow-xl"
          />
        </div>

        {/* Soft Reflection Glow */}
        <div className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 w-[70%] sm:w-[80%] h-[25px] bg-gradient-to-t from-[#EBD6FB]/50 to-transparent blur-2xl rounded-full"></div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

