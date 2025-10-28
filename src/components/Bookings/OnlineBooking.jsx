import React, { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import { motion } from "framer-motion";
import { BASE_URL } from "../../data/data";
import { CalendarDays, Phone, User2, Scissors } from "lucide-react";
import Loader from "../Layout/Loader"; // Make sure you have a Loader component

const OnlineBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/appointments/?for_notification=true`);
      const data = res.data.appointments || [];
      setBookings(data);
    } catch (err) {
      console.error("Error fetching online appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${BASE_URL}/appointments/${id}`, {
        confirmation_status: true,
        seen: true,
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to approve appointment.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/appointments/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to reject appointment.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size={100} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-[400px]">
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-16">
          <CalendarDays size={36} className="mb-3 text-[#687FE5]" />
          <p className="text-base">No new online appointments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b, idx) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 bg-white border border-[#E6E9FF] rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Booking Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <User2 size={16} className="text-[#687FE5]" />
                    {b.customer_id?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <Phone size={15} className="text-[#687FE5]" />
                    {b.customer_id?.phone || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <Scissors size={15} className="text-[#687FE5]" />
                    {b.services?.length > 0
                      ? b.services.map((s) => s.service_id?.name).join(", ")
                      : "Service Unavailable"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <CalendarDays size={15} className="text-[#687FE5]" />
                    {new Date(b.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApprove(b._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#687FE5] rounded-md hover:bg-[#586fdd] transition-all"
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReject(b._id)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-200 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    Reject
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineBooking;
