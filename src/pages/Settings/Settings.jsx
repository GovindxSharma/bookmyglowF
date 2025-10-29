import React, { useState } from "react";
import User from "@/components/Settings/User";
import Services from "@/components/Settings/Services";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#687FE5] mb-6">
          Settings ⚙️
        </h1>

        {/* Tabs Navigation */}
        <div className="flex gap-6 mb-6 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`text-lg font-semibold ${
              activeTab === "users"
                ? "text-[#687FE5] border-b-2 border-[#687FE5]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`text-lg font-semibold ${
              activeTab === "services"
                ? "text-[#687FE5] border-b-2 border-[#687FE5]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Services
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          {activeTab === "users" && <User />}
          {activeTab === "services" && <Services />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
