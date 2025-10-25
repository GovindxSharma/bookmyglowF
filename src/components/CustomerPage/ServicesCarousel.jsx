import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Arrows
const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-[-35px] top-1/2 -translate-y-1/2 bg-[#687FE5] hover:bg-[#5a6fd8] text-white p-3 rounded-full cursor-pointer shadow-lg z-20 transition-all duration-300 hidden md:flex"
  >
    <ChevronRight size={22} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-[-35px] top-1/2 -translate-y-1/2 bg-[#687FE5] hover:bg-[#5a6fd8] text-white p-3 rounded-full cursor-pointer shadow-lg z-20 transition-all duration-300 hidden md:flex"
  >
    <ChevronLeft size={22} />
  </div>
);

// Services Data
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
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2800,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: false, dots: true } },
    ],
  };

  return (
    <section
      id="services"
      className="py-20 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#FDFBFF] via-[#FEEBF6] to-[#EBD6FB]"
    >
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-gray-900">
        Our <span className="text-[#687FE5]">Signature Services</span>
      </h2>

      <div className="max-w-6xl mx-auto relative">
        <Slider {...settings}>
          {services.map((service) => (
            <div key={service.id} className="px-3">
              <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group min-h-[430px]">
                {/* Image Layer */}
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${service.image})` }}
                ></div>

                {/* Subtle Top Gradient (no blur) */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/50 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/60 group-hover:via-black/25"></div>

                {/* Bottom Gradient for Text Contrast */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                {/* Text Content */}
                <div className="absolute bottom-0 z-10 w-full p-8 text-center text-white">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-wide drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
                    {service.name}
                  </h3>
                  <p className="text-sm md:text-base mb-5 leading-relaxed text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
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
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ServicesCarousel;
