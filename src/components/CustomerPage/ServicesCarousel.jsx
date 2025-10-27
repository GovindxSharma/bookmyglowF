import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const services = [
  {
    id: 1,
    name: "Hair Cut",
    image:
      "https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Trendy, stylish haircuts that define your personality.",
  },
  {
    id: 2,
    name: "Make-up",
    image:
      "https://images.unsplash.com/photo-1621691536086-e21b2439c73a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Flawless makeup for events, parties, and photoshoots.",
  },
  {
    id: 3,
    name: "Shaving",
    image:
      "https://images.unsplash.com/photo-1682325741756-1b5bfea9ae1a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Clean, smooth, and refreshing shaving experience.",
  },
  {
    id: 4,
    name: "Facial",
    image:
      "https://images.unsplash.com/photo-1731514771613-991a02407132?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Deep-cleansing facials for glowing and rejuvenated skin.",
  },
  {
    id: 5,
    name: "Waxing",
    image:
      "https://plus.unsplash.com/premium_photo-1664187387328-aeb82e38eefb?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Smooth, gentle waxing using premium organic products.",
  },
  {
    id: 6,
    name: "Hair Color",
    image:
      "https://plus.unsplash.com/premium_photo-1664301619580-03412defa987?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Express yourself with vibrant, professional hair colors.",
  },
];

const ServicesCarousel = () => {
  return (
    <section
      id="services"
      className="py-16 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#FDFBFF] via-[#FEEBF6] to-[#EBD6FB] overflow-hidden"
    >
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-gray-900">
        Our <span className="text-[#687FE5]">Signature Services</span>
      </h2>

      <div className="max-w-6xl mx-auto relative">
        {/* Professional Navigation Arrows */}
        <div className="hidden md:flex justify-between items-center absolute inset-y-1/2 -translate-y-1/2 w-full px-4 z-20">
          <div className="swiper-button-prev group w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-[#687FE5] shadow-md cursor-pointer hover:bg-[#687FE5] hover:text-white transition-all duration-300">
            <ChevronLeft size={26} className="transition-transform group-hover:-translate-x-0.5" />
          </div>
          <div className="swiper-button-next group w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-[#687FE5] shadow-md cursor-pointer hover:bg-[#687FE5] hover:text-white transition-all duration-300">
            <ChevronRight size={26} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="!pb-12"
        >
          {services.map((service) => (
            <SwiperSlide key={service.id}>
              <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group h-[430px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${service.image})` }}
                ></div>

                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/50 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 z-10 w-full p-6 sm:p-8 text-center text-white">
                  <h3 className="text-2xl sm:text-3xl font-semibold mb-3 drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
                    {service.name}
                  </h3>
                  <p className="text-sm sm:text-base mb-5 leading-relaxed text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {service.description}
                  </p>
                  <a
                    href="#book"
                    className="inline-block bg-[#687FE5] hover:bg-[#5a6fd8] text-white px-6 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ServicesCarousel;
