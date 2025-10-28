import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F6FF] via-[#E8EAFF] to-[#FFFFFF] min-h-screen flex flex-col md:flex-row items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-20 md:py-24">
      {/* Decorative blurred circles */}
      <div className="absolute top-[-15%] left-[-20%] w-[260px] sm:w-[340px] md:w-[400px] h-[260px] sm:h-[340px] md:h-[400px] bg-[#636CCB]/25 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-20%] w-[280px] sm:w-[400px] md:w-[460px] h-[280px] sm:h-[400px] md:h-[460px] bg-[#4E56B2]/25 rounded-full blur-[120px] animate-pulse"></div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col gap-6 max-w-lg text-center md:text-left"
      >
        <h1 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.4rem] lg:text-[4rem] font-extrabold leading-tight text-[#2A2A2A] tracking-tight break-words">
          Discover{" "}
          <span className="text-[#636CCB] font-pacifico drop-shadow-sm">
            Timeless Beauty
          </span>{" "}
          at{" "}
          <span className="text-[#4E56B2] font-pacifico drop-shadow-sm">
            Bunty Salon
          </span>
        </h1>

        <p className="text-[#2A2A2A]/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
          Experience elegance and calm — where our expert stylists blend art
          and care to bring out your unique charm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
          <motion.a
            href="#book"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#636CCB] text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:bg-[#4E56B2] transition-all duration-300 text-center text-sm sm:text-base"
          >
            Book Appointment
          </motion.a>

          <motion.a
            href="#services"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-[#636CCB] text-[#636CCB] px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-[#636CCB]/10 shadow-sm hover:shadow-md transition-all duration-300 text-center text-sm sm:text-base"
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
        <div className="relative w-[200px] sm:w-[280px] md:w-[360px] lg:w-[420px] h-[200px] sm:h-[280px] md:h-[360px] lg:h-[420px]">
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
            className="absolute inset-0 bg-gradient-to-tr from-[#636CCB] via-[#A3A8E6] to-[#4E56B2] rounded-[55%_45%_65%_45%/55%_60%_45%_55%] blur-[3px]"
          ></motion.div>

          {/* PNG Image */}
          <img
            src="https://png.pngtree.com/png-clipart/20240311/original/pngtree-working-as-hairdresser-hair-salon-and-barber-shop-png-image_14565273.png"
            alt="Salon"
            className="absolute inset-0 w-full h-full object-contain rounded-[55%_45%_65%_45%/55%_60%_45%_55%] shadow-2xl"
          />
        </div>

        {/* Reflection */}
        <div className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 w-[70%] sm:w-[80%] h-[25px] bg-gradient-to-t from-[#636CCB]/40 to-transparent blur-2xl rounded-full"></div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
