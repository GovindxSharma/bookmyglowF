// src/components/Bookings/BookingTabs.jsx
import { useState } from "react";
import AddBooking from "./AddBookings";
import BookingList from "./BookingList";

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState("add");

  const tabs = [
    { key: "add", label: "Add Booking" },
    { key: "list", label: "Booking List" },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "add" && <AddBooking />}
        {activeTab === "list" && <BookingList />}
      </div>
    </div>
  );
};

export default BookingTabs;
