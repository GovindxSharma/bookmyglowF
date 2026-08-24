import { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import AddBooking from "./AddBookings";
import BookingList from "./BookingList";
import OnlineBooking from "./OnlineBooking";
import Loader from "../Layout/Loader";
import { BASE_URL } from "../../data/data";
import { Sparkles, PlusCircle, ListOrdered, Inbox } from "lucide-react";

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOnlineNotifications = async () => {
    try {
      const res = await axios.get("/appointments/?for_notification=true");
      const appointments = res.data.appointments || [];
      const unconfirmed = appointments.some((b) => b.confirmation_status === false);
      setHasUnread(unconfirmed);
    } catch (error) {
      console.error("Failed to fetch online notifications:", error);
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
    { key: "add", label: "New Walk-in & Billing", icon: <PlusCircle size={15} /> },
    { key: "list", label: "Appointments Register", icon: <ListOrdered size={15} /> },
    { key: "online", label: "Online Website Inquiries", icon: <Inbox size={15} /> },
  ];

  const handleTabChange = (tabKey) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tabKey);
      setLoading(false);
    }, 150);
  };

  return (
    <div className="p-4 sm:p-8 bg-[#FAF6EE] min-h-screen text-[#182A4A]">
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C] mb-2">
            <Sparkles size={13} /> FRONT DESK POS & BILLING
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#182A4A]">
            Appointments & Invoicing
          </h1>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl bg-white border border-[#E6DCCE]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 uppercase tracking-wider ${
                isActive
                  ? "bg-[#182A4A] text-white shadow-soft-sm"
                  : "text-[#5C6D88] hover:text-[#182A4A] hover:bg-[#FAF6EE]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>

              {tab.key === "online" && hasUnread && (
                <span className="w-2.5 h-2.5 bg-[#C89B3C] rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size={180} />
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
