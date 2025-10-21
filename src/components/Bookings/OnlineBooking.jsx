import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BASE_URL } from "../../data/data";

const OnlineBooking = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/appointments/?for_notification=true`
      );
      const data = res.data.appointments || [];
      setBookings(data);
    } catch (err) {
      console.error("Error fetching online appointments", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${BASE_URL}/appointments/${id}`, {
        confirmation_status: true,
        seen: true,
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert("Appointment approved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve appointment.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6 space-y-4">
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">
          No new online appointments 🎉
        </p>
      ) : (
        bookings.map((b, idx) => (
          <motion.div
            key={b._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex justify-between items-center p-5 bg-white rounded-2xl shadow border border-[#EBD6FB]"
          >
            <div>
              <h3 className="font-semibold text-gray-900">
                {b.customer_id?.name || "Unknown"}
              </h3>
              <p className="text-sm text-gray-600">
                📞 {b.customer_id?.phone || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                💇‍♀️{" "}
                {b.services?.length > 0
                  ? b.services.map((s) => s.service_id?.name).join(", ")
                  : "Service Unavailable"}
              </p>
              <p className="text-sm text-gray-500">
                📅 {new Date(b.date).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => handleApprove(b._id)}
              className="bg-[#687FE5] text-white px-6 py-2 rounded-full hover:bg-[#5a6fd8] transition-all"
            >
              Approve
            </button>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default OnlineBooking;
