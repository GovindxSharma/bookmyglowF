import React from "react";
import { MapPin } from "lucide-react";

const AboutUs = () => {
  return (
    <section
      id="about"
      className="relative py-16 px-5 sm:px-10 md:px-16 bg-gradient-to-br from-[#F5F6FF] via-[#EBD6FB] to-[#E5EBFF]"
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4E56B2]">
          About <span className="text-[#636CCB]">Us</span>
        </h2>
        <p className="text-[#2A2A2A]/80 mt-2 max-w-xl mx-auto text-sm sm:text-base">
          Welcome to <strong>Bunty's Unisex Saloon</strong>, where style meets perfection.
          Premium hair & beauty services designed just for you.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Text Column */}
        <div className="flex-1 space-y-4">
          <p className="text-[#2A2A2A]/90 text-sm sm:text-base">
            Our mission is to enhance your natural beauty with expert care and
            luxurious treatments. Every client leaves feeling confident and rejuvenated.
          </p>
          <p className="text-[#2A2A2A]/90 text-sm sm:text-base">
            Our vision is to be Mundra’s most trusted salon — known for our quality,
            creativity, and care.
          </p>

          {/* Map */}
          <div className="mt-4">
            <h4 className="flex items-center gap-2 font-semibold text-[#4E56B2] text-base sm:text-lg mb-2">
              <MapPin size={20} /> Our Location
            </h4>
            <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden shadow-md border border-[#EBD6FB]">
              <iframe
                title="Bunty Unisex Salon Location"
                src="https://www.google.com/maps?q=Bunty+Unisex+Salon,+above+Deep+Chinese,+near+HDFC+bank,+Baroi+Rd,+Mundra&output=embed"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div className="flex-1">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-[#EBD6FB]">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80"
              alt="Salon Interior"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
