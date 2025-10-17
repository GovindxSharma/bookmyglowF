// src/components/Layout/DashboardLayout.jsx
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div
      className="flex h-screen bg-gradient-to-br from-[#FCD8CD] via-[#FEEBF6] to-[#EBD6FB] 
      overflow-hidden"
    >
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto ml-10">{children}</main>
    </div>
  );
};

export default DashboardLayout;
