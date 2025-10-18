import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-[-45px] top-1/2 transform -translate-y-1/2 bg-[#687FE5] hover:bg-[#5a6fd8] text-white p-3 rounded-full cursor-pointer shadow-lg z-20 transition-all duration-300"
  >
    <ChevronRight size={26} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-[-45px] top-1/2 transform -translate-y-1/2 bg-[#687FE5] hover:bg-[#5a6fd8] text-white p-3 rounded-full cursor-pointer shadow-lg z-20 transition-all duration-300"
  >
    <ChevronLeft size={26} />
  </div>
);

const services = [
  {
    id: 1,
    name: "Hair-cut",
    image:
      "https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Stylish haircuts for all genders and ages.",
  },
  {
    id: 2,
    name: "Make-up",
    image:
      "https://images.unsplash.com/photo-1621691536086-e21b2439c73a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Professional make-up for events and occasions.",
  },
  {
    id: 3,
    name: "Shaving",
    image:
      "https://images.unsplash.com/photo-1682325741756-1b5bfea9ae1a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Clean and precise shaving services.",
  },
  {
    id: 4,
    name: "Facial",
    image:
      "https://images.unsplash.com/photo-1731514771613-991a02407132?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Relaxing facials for radiant and glowing skin.",
  },
  {
    id: 5,
    name: "Waxing",
    image:
      "https://plus.unsplash.com/premium_photo-1664187387328-aeb82e38eefb?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Gentle waxing services for smooth skin.",
  },
  {
    id: 6,
    name: "Hair Color",
    image:
      "https://plus.unsplash.com/premium_photo-1664301619580-03412defa987?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=900",
    description: "Vibrant hair coloring tailored to your style.",
  },
];

const ServicesCarousel = () => {
  const settings = {
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
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-20 px-6 md:px-20 bg-gradient-to-br from-[#FDFBFF] via-[#FEEBF6] to-[#EBD6FB] relative">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-14 text-gray-900">
        Our <span className="text-[#687FE5]">Signature Services</span>
      </h2>

      <div className="max-w-6xl mx-auto relative">
        <Slider {...settings}>
          {services.map((service) => (
            <div key={service.id} className="px-3">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-transparent hover:border-[#687FE5] transition-all duration-300 flex flex-col h-[420px]">
                <div className="h-60 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                  <a
                    href="#book"
                    className="mt-4 self-center px-6 py-2 bg-[#687FE5] text-white rounded-full text-sm hover:bg-[#5a6fd8] transition-all"
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
