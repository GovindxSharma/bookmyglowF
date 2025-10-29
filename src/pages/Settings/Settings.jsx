import { useEffect, useState } from "react";
import User from "@/components/Settings/User";
import Services from "@/components/Settings/Services";
import Loader from "../../components/Layout/Loader";
const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { key: "users", label: "Users" },
    { key: "services", label: "Services" },
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
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-md border border-[#e6e9ff]">
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
            <Loader size={150} />
          </div>
        ) : (
          <>
            {activeTab === "users" && <User />}
            {activeTab === "services" && <Services />}
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsTabs;
