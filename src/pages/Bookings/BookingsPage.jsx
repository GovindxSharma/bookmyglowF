// src/pages/Bookings/BookingsPage.jsx
import React, { useState, useEffect } from "react";
import BookingTabs from "@/components/Bookings/BookingTabs";
import Loader from "@/components/Layout/Loader.jsx"; // Custom fullscreen loader

const BookingsPage = () => {
  const [loading, setLoading] = useState(true);

  // Simulate async loading (or you can lift state from BookingTabs)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // replace with actual data fetch completion
    }, 1000); // Example: 1s loader

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader fullscreen={true} size={150} />;
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-[#EEF1FF] via-[#F5F6FF] to-white">
      <BookingTabs />
    </div>
  );
};

export default BookingsPage;
