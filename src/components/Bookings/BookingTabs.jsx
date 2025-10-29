import { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import AddBooking from "./AddBookings";
import BookingList from "./BookingList";
import OnlineBooking from "./OnlineBooking";
import Loader from "../Layout/Loader";
import { BASE_URL } from "../../data/data";

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch new online appointments
  const fetchOnlineNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointments/?for_notification=true`);
      const appointments = res.data.appointments || [];
      const unconfirmed = appointments.some((b) => b.confirmation_status === false);
      setHasUnread(unconfirmed);
    } catch (error) {
      console.error("Failed to fetch online appointment notifications:", error);
    }
  };

  useEffect(() => {
    fetchOnlineNotifications();
    const interval = setInterval(fetchOnlineNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "online") setHasUnread(false);
  }, [activeTab]);

  const tabs = [
    { key: "add", label: "Add Booking" },
    { key: "list", label: "Booking List" },
    { key: "online", label: "Online Appointments" },
  ];

  // ✅ Handle tab change with loader
  const handleTabChange = (tabKey) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tabKey);
      setLoading(false);
    }, 200); // small delay for smooth loader
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md border border-[#e6e9ff]">
      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 mb-5 border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`relative flex-1 text-center px-4 py-2.5 text-sm sm:text-base font-medium transition-all duration-200
                ${isActive
                  ? "text-[#687FE5] border-b-2 border-[#687FE5] bg-[#F5F6FF]"
                  : "text-gray-600 hover:text-[#687FE5]/80 bg-white"
                } rounded-lg sm:rounded-none`}
            >
              {tab.label}

              {/* 🔸 Unread Notification Dot */}
              {tab.key === "online" && hasUnread && (
                <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-[#C66A1F] rounded-full shadow-sm animate-pulse" />
              )}

              {/* Active Tab Indicator Glow */}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#687FE5] rounded-full shadow-[0_0_4px_#687FE5]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-2 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader size={250}/>
          </div>
        ) : (
          <>
            {activeTab === "add" && <AddBooking />}
            {activeTab === "list" && <BookingList />}
            {activeTab === "online" && <OnlineBooking />}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingTabs;
