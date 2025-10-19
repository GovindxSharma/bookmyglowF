import { useEffect, useState } from "react";
import axios from "axios";
import AddBooking from "./AddBookings";
import BookingList from "./BookingList";
import OnlineBooking from "./OnlineBooking"; // 👈 new component

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [hasUnread, setHasUnread] = useState(false);

  // 🔸 Check for new online appointments
  const fetchOnlineNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/appointments/?for_notification=true"
      );
      const appointments = res.data.appointments || [];
      const unconfirmed = appointments.some(
        (b) => b.confirmation_status === false
      );
      setHasUnread(unconfirmed);
    } catch (error) {
      console.error("Failed to fetch online appointment notifications:", error);
    }
  };

  useEffect(() => {
    fetchOnlineNotifications();
    const interval = setInterval(fetchOnlineNotifications, 15000); // check every 15s
    return () => clearInterval(interval);
  }, []);

  // 🔸 Hide unread dot once user visits online tab
  useEffect(() => {
    if (activeTab === "online") setHasUnread(false);
  }, [activeTab]);

  const tabs = [
    { key: "add", label: "Add Booking" },
    { key: "list", label: "Booking List" },
    { key: "online", label: "Online Appointments" },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {/* Tabs Header */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-6 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}

            {/* 🟠 Orange unread dot for "Online Appointments" */}
            {tab.key === "online" && hasUnread && (
              <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "add" && <AddBooking />}
        {activeTab === "list" && <BookingList />}
        {activeTab === "online" && <OnlineBooking />}
      </div>
    </div>
  );
};

export default BookingTabs;
