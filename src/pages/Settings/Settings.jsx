import { useEffect, useState } from "react";
import User from "@/components/Settings/User";
import Services from "@/components/Settings/Services";
import Loader from "../../components/Layout/Loader";
import { Settings as SettingsIcon, Users, Scissors, Sparkles } from "lucide-react";

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { key: "services", label: "Services & Price List", icon: <Scissors size={15} /> },
    { key: "users", label: "Staff Login Accounts", icon: <Users size={15} /> },
  ];

  const handleTabChange = (tabKey) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tabKey);
      setLoading(false);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#182A4A] p-4 sm:p-6 md:p-10 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6DCCE] shadow-soft-sm">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-[#182A4A] flex items-center gap-2">
              <SettingsIcon size={22} className="text-[#C89B3C]" /> Studio Configuration & Catalog
            </h1>
            <p className="text-xs text-[#5C6D88] mt-0.5">
              Customize service menu prices, categories, and manage front desk access accounts
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-[#FAF6EE] p-1.5 rounded-2xl border border-[#E6DCCE] text-xs font-bold uppercase tracking-wider">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#182A4A] text-white shadow-soft-sm font-bold"
                      : "text-[#5C6D88] hover:text-[#182A4A]"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-[#E6DCCE]">
              <Loader size={160} />
            </div>
          ) : (
            <>
              {activeTab === "services" && <Services />}
              {activeTab === "users" && <User />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;
