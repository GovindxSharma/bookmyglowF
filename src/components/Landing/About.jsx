import React from "react";
import { MapPin, Phone, Mail, Clock, Award, ShieldCheck, Heart, Sparkles, Coffee } from "lucide-react";
import { SALON_CONFIG } from "@/data/data";

const AboutUs = () => {
  return (
    <section
      id="about"
      className="relative py-20 px-5 sm:px-10 md:px-16 lg:px-24 bg-[#F8F5F0] text-[#242A26]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Heart size={14} className="text-[#4E6758]" /> About Our Salon
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F2421]">
            Welcome to <span className="text-[#4E6758]">{SALON_CONFIG.name}</span>
          </h2>
          <p className="text-[#68706B] mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Where skilled stylists, premium products, and peaceful hospitality come together for your complete self-care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Narrative */}
          <div className="space-y-5">
            <p className="text-[#4A524D] leading-relaxed text-sm sm:text-base">
              At <strong>{SALON_CONFIG.name}</strong>, we believe every salon visit should be relaxing and uplifting. From everyday haircuts and hair coloring to rejuvenating facials and bridal grooming, our trained team takes the time to understand exactly what you want and delivers it with care.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] shadow-soft-sm space-y-1.5">
                <Award size={20} className="text-[#4E6758]" />
                <h4 className="font-bold text-sm text-[#1F2421]">Experienced Stylists</h4>
                <p className="text-xs text-[#68706B]">
                  Friendly, certified hair and skin specialists with years of salon experience.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] shadow-soft-sm space-y-1.5">
                <ShieldCheck size={20} className="text-[#4E6758]" />
                <h4 className="font-bold text-sm text-[#1F2421]">Hygiene & Care</h4>
                <p className="text-xs text-[#68706B]">
                  Sterilized tools, disposable towels, and genuine branded products.
                </p>
              </div>
            </div>

            {/* Location & Map Card */}
            <div className="p-5 rounded-3xl bg-white border border-[#EAE3D9] shadow-soft-sm space-y-2.5">
              <h4 className="font-bold text-[#1F2421] text-sm flex items-center gap-1.5">
                <MapPin size={16} className="text-[#4E6758]" />
                Salon Location & Visiting Hours
              </h4>
              <p className="text-xs text-[#68706B]">
                {SALON_CONFIG.address} &bull; Open Daily: 9:00 AM – 9:00 PM
              </p>

              <div className="w-full h-52 rounded-2xl overflow-hidden shadow-inner border border-[#EAE3D9]">
                <iframe
                  title="Salon Location Map"
                  src="https://maps.google.com/maps?q=Luxury+Day+Spa+and+Salon&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Salon Interior Photo */}
          <div className="relative">
            <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-soft-md border-4 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80"
                alt="Salon Interior"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-soft-md border border-[#EAE3D9] hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDF3EF] text-[#4E6758] flex items-center justify-center font-bold text-lg">
                ★
              </div>
              <div>
                <div className="font-bold text-[#1F2421] text-sm">4.9 Star Salon Experience</div>
                <div className="text-xs text-[#747E78]">Loved by hundreds of happy clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
