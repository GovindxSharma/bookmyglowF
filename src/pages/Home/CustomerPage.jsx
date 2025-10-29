
import React, { useEffect, useState } from "react";
import HeroSection from "../../components/Landing/HeroSection.jsx";
import ServicesSection from "../../components/Landing/ServicesSection.jsx";
import AppointmentForm from "../../components/Landing/AppointmentForm.jsx";
import AboutUs from "../../components/Landing/About.jsx";
import axios from "../../api/axiosInstance";
import { BASE_URL } from "../../data/data.js";
import Loader from "../../components/Layout/Loader.jsx"; // import your loader
import Footer from "../../components/Layout/Footer.jsx";

const CustomerPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/services`);
        setServices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <Loader />; // show loader while fetching
  }

  return (
    <div className="font-poppins text-gray-800 overflow-hidden">
      <HeroSection />
      <ServicesSection services={services} />
      <AppointmentForm />
      <AboutUs />
      <Footer/>
    </div>
  );
};

export default CustomerPage;
