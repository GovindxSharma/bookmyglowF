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
      `✨ *${SALON_CONFIG.name}* ✨\nHello! I have booked an online appointment for *${bookingSuccess.name}*.\n\n📅 Date: ${bookingSuccess.date}\n⏰ Time: ${bookingSuccess.time}\n👩‍🎨 Stylist: ${bookingSuccess.stylist}\n💰 Est. Total: ₹${calculatedTotal}\n\nPlease confirm my reservation. Thank you!`
    );
    window.open(`https://wa.me/91${SALON_CONFIG.phone.replace(/\D/g, "")}?text=${text}`, "_blank");
  };

  return (
    <section
      id="book"
      className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#FDFBF9] via-[#F6F1EA] to-[#FDFBF9] text-[#242A26] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Calendar size={14} className="text-[#4E6758]" /> Real-Time Online Booking
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F2421]">
            Reserve Your Salon Experience
          </h2>
          <p className="text-[#68706B] text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Choose your service, select a specific stylist, pick a verified open slot, and get instant confirmation.
          </p>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="mb-8 p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 text-[#242A26] shadow-soft-md text-center space-y-3.5"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1F2421]">
                Reservation Confirmed & Saved!
              </h3>
              <p className="text-sm text-[#555E58] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{bookingSuccess.name}</strong>. Your slot has been reserved for{" "}
                <strong className="text-[#1F2421]">
                  {bookingSuccess.date} at {bookingSuccess.time}
                </strong>{" "}
                with <strong className="text-[#4E6758]">{bookingSuccess.stylist}</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={shareToWhatsApp}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BE5A] text-white font-semibold text-xs shadow-soft-sm transition"
                >
                  <Share2 size={15} /> Confirm on WhatsApp
                </button>
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="px-5 py-2.5 rounded-full bg-[#EDF3EF] hover:bg-[#E0ECE5] text-[#35473C] text-xs font-semibold transition"
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
          className="bg-white rounded-[32px] shadow-soft-md border border-[#EAE3D9] p-6 sm:p-9"
        >
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Step 1: Select Services */}
            <div>
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2.5 mb-3.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#35473C] flex items-center gap-2">
                  <Scissors size={15} className="text-[#4E6758]" />
                  1. Select Treatments & Services
                </label>
                <span className="text-xs text-[#4E6758] font-bold">
                  Estimated Bill: ₹{calculatedTotal.toLocaleString()}
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
                          ? "bg-[#EDF3EF] border-[#4E6758] shadow-xs"
                          : "bg-white border-[#EAE3D9] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs text-[#242A26]">
                          {srv.name}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "bg-[#4E6758] border-[#4E6758] text-white"
                              : "border-[#C5BCB0]"
                          }`}
                        >
                          {isSelected && <Check size={11} />}
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="text-[#7D8480]">Starting from</span>
                        <span className="font-bold text-[#4E6758]">
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
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2.5 mb-3.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#35473C] flex items-center gap-2">
                  <Award size={15} className="text-[#4E6758]" />
                  2. Choose Stylist or Specialist
                </label>
                <span className="text-[11px] text-[#7D8480]">
                  Selected: <strong className="text-[#1F2421]">{selectedStylistName}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {/* Any Stylist Option */}
                <div
                  onClick={() => setSelectedEmployeeId("any")}
                  className={`p-3 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    selectedEmployeeId === "any"
                      ? "bg-[#EDF3EF] border-[#4E6758] shadow-xs"
                      : "bg-[#FDFBF9] border-[#EAE3D9] hover:bg-[#F8F5F0]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-[#D9E4DD] flex items-center justify-center text-[#4E6758]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#1F2421] block">Any Stylist</span>
                    <span className="text-[10px] text-[#4E6758] font-semibold">Earliest Slot</span>
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
                          ? "bg-[#EDF3EF] border-[#4E6758] shadow-xs"
                          : "bg-[#FDFBF9] border-[#EAE3D9] hover:bg-[#F8F5F0]"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-[#D9E4DD] flex items-center justify-center text-[#4E6758] font-bold text-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#1F2421] block truncate max-w-[100px]">
                          {emp.name.split(" ")[0]}
                        </span>
                        <span className="text-[10px] text-[#7D8480] block capitalize truncate max-w-[100px]">
                          {emp.gender || "Stylist"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Date & Smart Real-Time Slot Picker */}
            <div>
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2.5 mb-3.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#35473C] flex items-center gap-2">
                  <Clock size={15} className="text-[#4E6758]" />
                  3. Select Date & Verified Open Slot
                </label>
                {availabilityLoading && (
                  <span className="text-xs text-[#4E6758] animate-pulse font-medium">
                    Checking slot calendar...
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
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs sm:text-sm font-semibold text-[#1F2421] transition shadow-2xs"
                />
              </div>

              {/* Next Available Slot Recommendation Banner */}
              {nextAvailableSlot && (
                <div className="mb-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
                  <span className="text-emerald-800">
                    ✨ Earliest open slot with <strong>{selectedStylistName}</strong>:{" "}
                    <strong>{nextAvailableSlot}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, time: nextAvailableSlot }))}
                    className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
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
                      className={`py-2 px-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex flex-col items-center justify-center gap-0.5 ${
                        !isAvailable
                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through opacity-60"
                          : isSelected
                          ? "bg-[#4E6758] text-white shadow-soft-sm scale-102 font-bold"
                          : "bg-[#FDFBF9] text-[#4A524D] hover:bg-[#EDF3EF] border border-[#EAE3D9]"
                      }`}
                    >
                      <span>{slot.time}</span>
                      <span
                        className={`text-[9px] ${
                          !isAvailable
                            ? "text-rose-500 font-normal no-underline"
                            : isSelected
                            ? "text-emerald-200"
                            : "text-[#4E6758]"
                        }`}
                      >
                        {isAvailable ? "Open" : "Busy"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Contact Info */}
            <div className="pt-2 border-t border-[#F2ECE4]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#35473C] flex items-center gap-2 mb-3.5">
                <User size={15} className="text-[#4E6758]" />
                4. Your Contact Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] text-xs sm:text-sm text-[#242A26] placeholder-[#8C948F] outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="10-Digit Mobile Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] text-xs sm:text-sm text-[#242A26] placeholder-[#8C948F] outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Special requests or styling notes (optional)"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] text-xs sm:text-sm text-[#242A26] placeholder-[#8C948F] outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#4E6758] hover:bg-[#405448] text-white font-bold text-sm sm:text-base transition duration-200 flex items-center justify-center gap-2 shadow-soft-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Checking & Reserving...</span>
                ) : (
                  <>
                    <span>
                      Confirm Reservation ({formData.date} at {formData.time})
                    </span>
                    <Sparkles size={16} />
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#7D8480] text-center mt-2">
                🔒 Verified conflict-free scheduling with instant WhatsApp receipt confirmation.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default AppointmentForm;
