import React, { useEffect, useState } from "react";
import HeroSection from "../../components/Landing/HeroSection.jsx";
import ServicesSection from "../../components/Landing/ServicesSection.jsx";
import AppointmentForm  from "../../components/Landing/AppointmentForm.jsx";
import axios from "axios";
import { BASE_URL } from "../../data/data.js";
import AboutUs from "../../components/Landing/About.jsx";
import Reviews from "../../components/Landing/Reviews.jsx";


const CustomerPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/services`);
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
      <ServicesSection services={services} />
      <AppointmentForm />
      <AboutUs />
      <Reviews/>
    </div>
  );
};

export default CustomerPage;
