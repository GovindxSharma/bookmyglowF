import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import BookingsPage from "./pages/Bookings/BookingsPage"; // adjust path if needed

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard / Bookings */}
        <Route path="/bookings" element={<BookingsPage />} />

        {/* Add more routes later — e.g. /services, /settings, etc. */}
      </Routes>
    </Router>
  );
};

export default App;
