// src/pages/Bookings/BookingsPage.jsx
import DashboardLayout from "@/components/Layout/DashboardLayout";
import BookingTabs from "@/components/Bookings/BookingTabs";

const BookingsPage = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bookings</h1>
        <BookingTabs />
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;
