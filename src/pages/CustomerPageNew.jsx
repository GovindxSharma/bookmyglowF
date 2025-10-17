import React, { useEffect, useState } from "react";
import HeroSection from "../components/CustomerPage/HeroSection.jsx";
import ServicesCarousel from "../components/CustomerPage/ServicesCarousel.jsx";
import AppointmentForm from "../components/CustomerPage/AppointmentForm.jsx";
import axios from "axios";

const CustomerPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/services");
        setServices(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="font-poppins text-gray-800 overflow-hidden">
      <HeroSection />
      <ServicesCarousel services={services} />
      <AppointmentForm />
    </div>
  );
};

export default CustomerPage;
