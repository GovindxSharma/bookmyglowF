import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "@/api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Sparkles, ShieldCheck, UserCheck, ArrowLeft, Lock } from "lucide-react";
import Loader from "@/components/Layout/Loader.jsx";
import { SALON_CONFIG } from "@/data/data";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", formData);
      const { token, role, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (role === "admin") navigate("/dashboard");
      else if (role === "receptionist") navigate("/bookings");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Incorrect email or password. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDFBF9] via-[#F6F1EA] to-[#FDFBF9] px-4 py-12 relative overflow-hidden text-[#242A26]">
      {/* Soft Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[380px] h-[380px] bg-[#E2ECE5]/70 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#F5ECE4]/80 rounded-full blur-[110px] pointer-events-none" />

      {/* Fullscreen Loader */}
      <AnimatePresence>
        {loading && <Loader fullscreen={true} size={220} />}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white/95 backdrop-blur-xl border border-[#EAE3D9] shadow-soft-lg rounded-[32px] p-7 sm:p-9 w-full max-w-md z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4E6758] hover:text-[#35473C] mb-5 transition"
        >
          <ArrowLeft size={14} /> Back to Salon Home
        </Link>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EDF3EF] border border-[#D9E4DD] text-[#4E6758] flex items-center justify-center mx-auto mb-3 shadow-xs font-bold">
            <Sparkles size={22} />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F2421] tracking-tight">
            {SALON_CONFIG.name}
          </h1>
          <span className="text-xs font-medium text-[#68706B] block mt-0.5">
            Staff & Management Login
          </span>
        </div>

        {/* ⚡ Quick Demo Autofill */}
        <div className="mb-5 bg-[#F8F5F0] border border-[#EAE3D9] rounded-2xl p-3 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#35473C]">
            <Sparkles size={13} className="text-[#4E6758]" />
            <span>Instant Demo Accounts (Click to Fill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("admin@bookmyglow.com", "admin123")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DDD5CA] hover:border-[#4E6758] hover:bg-[#EDF3EF] text-[#242A26] font-semibold transition text-xs shadow-xs"
            >
              <span>👑 Owner (Admin)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("reception@bookmyglow.com", "recep123")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DDD5CA] hover:border-[#4E6758] hover:bg-[#EDF3EF] text-[#242A26] font-semibold transition text-xs shadow-xs"
            >
              <span>👩‍💼 Receptionist</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A524D] mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. admin@bookmyglow.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9D0C5] bg-[#FDFBF9] focus:bg-white focus:border-[#4E6758] focus:ring-1 focus:ring-[#4E6758] text-xs sm:text-sm text-[#242A26] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A524D] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9D0C5] bg-[#FDFBF9] focus:bg-white focus:border-[#4E6758] focus:ring-1 focus:ring-[#4E6758] text-xs sm:text-sm text-[#242A26] outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-soft-sm transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4E6758] hover:bg-[#405448]"
            }`}
          >
            {loading ? "Signing In..." : "Sign In to Dashboard"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-[11px] text-[#7D8480]">
          Staff & Authorized Receptionists Only &bull; {SALON_CONFIG.name}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
