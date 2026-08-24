import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  Sparkles,
  CheckCircle2,
  Share2,
  Check,
  AlertCircle,
  Award,
  ChevronRight,
} from "lucide-react";
import axios from "@/api/axiosInstance";
import { BASE_URL, SALON_CONFIG } from "../../data/data";

const DEFAULT_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

const AppointmentForm = () => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: today,
    time: "11:00 AM",
    note: "",
  });

  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("any");

  // Real-time Slot Availability State
  const [slotAvailability, setSlotAvailability] = useState([]);
  const [nextAvailableSlot, setNextAvailableSlot] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Services & Stylists on load
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [servRes, empRes] = await Promise.all([
          axios.get("/services"),
          axios.get("/employee"),
        ]);
        const sList = servRes.data || [];
        setServices(sList);
        if (sList.length > 0) setSelectedServices([sList[0]._id]);

        setEmployees(empRes.data.employees || []);
      } catch (err) {
        console.error("Failed to fetch booking metadata:", err);
      }
    };
    fetchInitial();
  }, []);

  // Fetch real-time slot availability whenever date or stylist changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.date) return;
      setAvailabilityLoading(true);
      try {
        const empParam = selectedEmployeeId || "any";
        const res = await axios.get(
          `/appointments/availability?date=${formData.date}&employee_id=${empParam}`
        );
        if (res.data?.slots) {
          setSlotAvailability(res.data.slots);
          setNextAvailableSlot(res.data.nextAvailableSlot);

          // If current selected time is booked, auto-select next available
          const currentSlotObj = res.data.slots.find((s) => s.time === formData.time);
          if (currentSlotObj && !currentSlotObj.available && res.data.nextAvailableSlot) {
            setFormData((p) => ({ ...p, time: res.data.nextAvailableSlot }));
          }
        }
      } catch (err) {
        console.error("Error fetching slot availability:", err);
        // Fallback default
        setSlotAvailability(DEFAULT_SLOTS.map((t) => ({ time: t, available: true })));
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchSlots();
  }, [formData.date, selectedEmployeeId]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculatedTotal = services
    .filter((s) => selectedServices.includes(s._id))
    .reduce((sum, s) => {
      const price = s.sub_services?.[0]?.price || 450;
      return sum + price;
    }, 0);

  const selectedStylistName =
    selectedEmployeeId === "any"
      ? "Any Available Stylist"
      : employees.find((e) => e._id === selectedEmployeeId)?.name || "Selected Stylist";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg("Please enter your full name and mobile number.");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (selectedServices.length === 0) {
      setErrorMsg("Please select at least one service.");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      services: selectedServices.map((id) => ({
        service_id: id,
        employee_id: selectedEmployeeId !== "any" ? selectedEmployeeId : undefined,
      })),
      employee_id: selectedEmployeeId !== "any" ? selectedEmployeeId : undefined,
      date: formData.date,
      appointment_time: formData.time,
      source: "online",
      confirmation_status: false,
      note: formData.note.trim(),
      amount: calculatedTotal,
    };

    try {
      const res = await axios.post("/appointments", payload);
      if (res.data.success) {
        setBookingSuccess({
          ...res.data.appointment,
          name: formData.name,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          stylist: selectedStylistName,
        });
        setFormData({
          name: "",
          phone: "",
          date: today,
          time: "11:00 AM",
          note: "",
        });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMsg(
          `${err.response.data.message} ${err.response.data.suggestedMessage || ""}`
        );
        if (err.response.data.nextAvailableSlot) {
          setFormData((p) => ({ ...p, time: err.response.data.nextAvailableSlot }));
        }
      } else {
        setErrorMsg(err.response?.data?.message || "Booking failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    if (!bookingSuccess) return;
    const text = encodeURIComponent(
      `✨ *${SALON_CONFIG.name} — Reservation* ✨\nHello Concierge! I have reserved an appointment for *${bookingSuccess.name}*.\n\n📅 Date: ${bookingSuccess.date}\n⏰ Time: ${bookingSuccess.time}\n👩‍🎨 Stylist: ${bookingSuccess.stylist}\n💰 Est. Total: ₹${calculatedTotal}\n\nPlease confirm my slot. Thank you!`
    );
    window.open(`https://wa.me/${SALON_CONFIG.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  return (
    <section
      id="book"
      className="py-24 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#FAF6EE] text-[#182A4A] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DCCE] text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            <Calendar size={13} /> INSTANT SCHEDULING
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.04em] text-[#182A4A] leading-tight">
            RESERVE YOUR APPOINTMENT
          </h2>
          <p className="text-[#4A5D7A] text-sm sm:text-base max-w-lg mx-auto">
            Choose your treatments, select a preferred specialist, and secure a verified open slot instantly.
          </p>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="mb-8 p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#182A4A] text-[#182A4A] shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#FAF2DE] text-[#C89B3C] border border-[#C89B3C] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-[#182A4A]">
                RESERVATION SECURED & CONFIRMED!
              </h3>
              <p className="text-sm text-[#5C6D88] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{bookingSuccess.name}</strong>. Your slot has been reserved for{" "}
                <strong className="text-[#182A4A]">
                  {bookingSuccess.date} at {bookingSuccess.time}
                </strong>{" "}
                with <strong className="text-[#C89B3C]">{bookingSuccess.stylist}</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={shareToWhatsApp}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BE5A] text-white font-bold text-xs shadow-soft-sm transition uppercase tracking-wider"
                >
                  <Share2 size={15} /> Confirm on WhatsApp
                </button>
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="px-6 py-3 rounded-xl bg-[#FAF6EE] hover:bg-[#182A4A] hover:text-white text-[#182A4A] text-xs font-bold transition border border-[#E6DCCE] uppercase tracking-wider"
                >
                  Book Another Appointment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[36px] shadow-2xl border-2 border-[#182A4A] p-6 sm:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Select Services */}
            <div>
              <div className="flex items-center justify-between border-b border-[#FAF6EE] pb-3 mb-4">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#182A4A] flex items-center gap-2">
                  <Scissors size={15} className="text-[#C89B3C]" />
                  1. SELECT TREATMENTS & SERVICES
                </label>
                <span className="text-xs text-[#C89B3C] font-extrabold">
                  Est. Total: ₹{calculatedTotal.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((srv) => {
                  const isSelected = selectedServices.includes(srv._id);
                  const startPrice = srv.sub_services?.[0]?.price || 450;

                  return (
                    <div
                      key={srv._id}
                      onClick={() => handleServiceToggle(srv._id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-white border-2 border-[#182A4A] shadow-soft-sm scale-[1.02]"
                          : "bg-white border-[#E6DCCE] hover:bg-[#FAF6EE]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-[#182A4A]">
                          {srv.name}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "bg-[#182A4A] border-[#182A4A] text-white"
                              : "border-[#C5BCB0]"
                          }`}
                        >
                          {isSelected && <Check size={11} />}
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="text-[#9A8F7F]">Starts at</span>
                        <span className="font-extrabold text-[#C89B3C]">
                          ₹{startPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Preferred Stylist */}
            <div>
              <div className="flex items-center justify-between border-b border-[#FAF6EE] pb-3 mb-4">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#182A4A] flex items-center gap-2">
                  <Award size={15} className="text-[#C89B3C]" />
                  2. CHOOSE ARTIST OR SPECIALIST
                </label>
                <span className="text-[11px] text-[#5C6D88]">
                  Selected: <strong className="text-[#182A4A]">{selectedStylistName}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {/* Any Stylist Option */}
                <div
                  onClick={() => setSelectedEmployeeId("any")}
                  className={`p-3 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    selectedEmployeeId === "any"
                      ? "bg-white border-2 border-[#182A4A] shadow-soft-sm scale-[1.02]"
                      : "bg-white border-[#E6DCCE] hover:bg-[#FAF6EE]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAF2DE] border border-[#C89B3C] flex items-center justify-center text-[#C89B3C]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#182A4A] block">Any Stylist</span>
                    <span className="text-[10px] text-[#8EA89D] font-bold">Earliest Slot</span>
                  </div>
                </div>

                {/* Individual Stylists */}
                {employees.map((emp) => {
                  const isSelected = selectedEmployeeId === emp._id;
                  return (
                    <div
                      key={emp._id}
                      onClick={() => setSelectedEmployeeId(emp._id)}
                      className={`p-3 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? "bg-white border-2 border-[#182A4A] shadow-soft-sm scale-[1.02]"
                          : "bg-white border-[#E6DCCE] hover:bg-[#FAF6EE]"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E6DCCE] flex items-center justify-center text-[#182A4A] font-bold text-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#182A4A] block truncate max-w-[100px]">
                          {emp.name.split(" ")[0]}
                        </span>
                        <span className="text-[10px] text-[#5C6D88] block capitalize truncate max-w-[100px]">
                          {emp.gender || "Specialist"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Date & Smart Real-Time Slot Picker */}
            <div>
              <div className="flex items-center justify-between border-b border-[#FAF6EE] pb-3 mb-4">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#182A4A] flex items-center gap-2">
                  <Clock size={15} className="text-[#C89B3C]" />
                  3. SELECT DATE & OPEN TIME SLOT
                </label>
                {availabilityLoading && (
                  <span className="text-xs text-[#C89B3C] animate-pulse font-bold">
                    Checking live calendar...
                  </span>
                )}
              </div>

              {/* Date Input */}
              <div className="mb-4">
                <input
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#E6DCCE] focus:border-[#182A4A] outline-none text-xs sm:text-sm font-bold text-[#182A4A] transition"
                />
              </div>

              {/* Next Available Slot Recommendation */}
              {nextAvailableSlot && (
                <div className="mb-4 p-3 rounded-2xl bg-[#FAF2DE] border border-[#C89B3C]/40 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#182A4A]">
                    ✨ Earliest open slot with <strong>{selectedStylistName}</strong>:{" "}
                    <strong>{nextAvailableSlot}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, time: nextAvailableSlot }))}
                    className="px-3 py-1 rounded-lg bg-[#C89B3C] text-white font-bold text-[11px] hover:bg-[#B5882B] transition uppercase tracking-wider"
                  >
                    Select {nextAvailableSlot}
                  </button>
                </div>
              )}

              {/* Time Slots Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {(slotAvailability.length > 0
                  ? slotAvailability
                  : DEFAULT_SLOTS.map((t) => ({ time: t, available: true }))
                ).map((slot) => {
                  const isSelected = formData.time === slot.time;
                  const isAvailable = slot.available;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setFormData({ ...formData, time: slot.time })}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-150 flex flex-col items-center justify-center gap-0.5 ${
                        !isAvailable
                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through opacity-50"
                          : isSelected
                          ? "bg-[#182A4A] text-white shadow-soft-sm scale-[1.03]"
                          : "bg-[#FAF6EE] text-[#182A4A] hover:bg-white border border-[#E6DCCE]"
                      }`}
                    >
                      <span>{slot.time}</span>
                      <span
                        className={`text-[9px] ${
                          !isAvailable
                            ? "text-rose-500 font-normal no-underline"
                            : isSelected
                            ? "text-[#C89B3C]"
                            : "text-[#6C8E82]"
                        }`}
                      >
                        {isAvailable ? "Open" : "Booked"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Contact Info */}
            <div className="pt-2 border-t border-[#FAF6EE]">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#182A4A] flex items-center gap-2 mb-4">
                <User size={15} className="text-[#C89B3C]" />
                4. YOUR CONTACT DETAILS
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#E6DCCE] focus:border-[#182A4A] text-xs sm:text-sm text-[#182A4A] placeholder-[#9A8F7F] outline-none transition font-medium"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="10-Digit Mobile Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#E6DCCE] focus:border-[#182A4A] text-xs sm:text-sm text-[#182A4A] placeholder-[#9A8F7F] outline-none transition font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Special requests or styling notes (optional)"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#E6DCCE] focus:border-[#182A4A] text-xs sm:text-sm text-[#182A4A] placeholder-[#9A8F7F] outline-none transition font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-navy-primary w-full py-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-navy-glow disabled:opacity-50"
              >
                {loading ? (
                  <span>Checking & Reserving...</span>
                ) : (
                  <>
                    <span>
                      CONFIRM RESERVATION ({formData.date} at {formData.time})
                    </span>
                    <Sparkles size={16} />
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#5C6D88] text-center mt-2.5">
                🔒 Conflict-free scheduling with instant WhatsApp receipt confirmation.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default AppointmentForm;

