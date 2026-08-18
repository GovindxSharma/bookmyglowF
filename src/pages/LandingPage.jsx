import React from "react";
import HeroSection from "@/components/Landing/HeroSection";
import ServicesSection from "@/components/Landing/ServicesSection";
import PackageEstimator from "@/components/Landing/PackageEstimator";
import TransformationsSection from "@/components/Landing/TransformationsSection";
import StylistsSection from "@/components/Landing/StylistsSection";
import MembershipsSection from "@/components/Landing/MembershipsSection";
import AppointmentForm from "@/components/Landing/AppointmentForm";
import AboutUs from "@/components/Landing/About";
import Footer from "@/components/Layout/Footer";
import Credit from "@/components/Layout/Credit";

const LandingPage = () => {
  return (
    <div className="bg-[#FDFBF9] text-[#242A26] min-h-screen">
      {/* 1. Hero Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* 2. Services & Prices */}
      <section id="services">
        <ServicesSection />
      </section>

      {/* 3. Custom Package Builder & Savings Estimator */}
      <section id="packages">
        <PackageEstimator />
      </section>

      {/* 4. Before & After Client Transformations */}
      <section id="transformations">
        <TransformationsSection />
      </section>

      {/* 5. Stylists & Specialists Showcase */}
      <section id="stylists">
        <StylistsSection />
      </section>

      {/* 6. VIP Membership Passes & Gift Cards */}
      <section id="memberships">
        <MembershipsSection />
      </section>

      {/* 7. Online Appointment Booking */}
      <section id="book">
        <AppointmentForm />
      </section>

      {/* 8. About & Salon Story */}
      <section id="about">
        <AboutUs />
      </section>

      {/* 9. Footer & Credits */}
      <Footer />
      <Credit />
    </div>
  );
};

export default LandingPage;
