import React, { useState } from "react";
import HeroSection from "@/components/Landing/HeroSection";
import ServicesSection from "@/components/Landing/ServicesSection";
import BotanicalsSection from "@/components/Landing/BotanicalsSection";
import PackageEstimator from "@/components/Landing/PackageEstimator";
import TransformationsSection from "@/components/Landing/TransformationsSection";
import Reviews from "@/components/Landing/Reviews";
import StylistsSection from "@/components/Landing/StylistsSection";
import MembershipsSection from "@/components/Landing/MembershipsSection";
import GiftVoucherSection from "@/components/Landing/GiftVoucherSection";
import AppointmentForm from "@/components/Landing/AppointmentForm";
import AboutUs from "@/components/Landing/About";
import Footer from "@/components/Layout/Footer";
import Credit from "@/components/Layout/Credit";
import StyleAdvisorModal from "@/components/Landing/StyleAdvisorModal";

const LandingPage = () => {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const handleApplyPrescription = (prescription) => {
    const bookEl = document.getElementById("book");
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#FAF6EE] text-[#182A4A] min-h-screen">
      {/* 1. Hero Section with Style Advisor Trigger */}
      <section id="home">
        <HeroSection onOpenAdvisor={() => setIsAdvisorOpen(true)} />
      </section>

      {/* 2. Services & Prices */}
      <section id="services">
        <ServicesSection />
      </section>

      {/* 3. Sensory Botanicals & Aromatherapy Scent Pyramids */}
      <section id="botanicals">
        <BotanicalsSection />
      </section>

      {/* 4. Custom Package Builder & Savings Estimator */}
      <section id="packages">
        <PackageEstimator />
      </section>

      {/* 5. Before & After Client Transformations */}
      <section id="transformations">
        <TransformationsSection />
      </section>

      {/* 6. Client Reviews & Google Ratings */}
      <section id="reviews">
        <Reviews />
      </section>

      {/* 7. Stylists & Specialists Showcase with Lookbooks */}
      <section id="stylists">
        <StylistsSection />
      </section>

      {/* 8. 3D VIP Membership Passes */}
      <section id="memberships">
        <MembershipsSection />
      </section>

      {/* 9. Digital Luxury Gift Vouchers */}
      <section id="gift-cards">
        <GiftVoucherSection />
      </section>

      {/* 10. Online Appointment Booking */}
      <section id="book">
        <AppointmentForm />
      </section>

      {/* 11. About & Salon Story */}
      <section id="about">
        <AboutUs />
      </section>

      {/* 12. Footer & Credits */}
      <Footer />
      <Credit />

      {/* Interactive Virtual Style Advisor Modal */}
      <StyleAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        onApplyPrescription={handleApplyPrescription}
      />
    </div>
  );
};

export default LandingPage;
