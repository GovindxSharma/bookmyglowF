import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "@/api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Sparkles, ShieldCheck, UserCheck, ArrowLeft, Lock } from "lucide-react";
import Loader from "@/components/Layout/Loader.jsx";
import { SALON_CONFIG } from "@/data/data";
import { GeometricEmblem } from "@/components/Common/GeometricLogo";

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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6EE] px-4 py-12 relative overflow-hidden text-[#182A4A]">
      {/* Abstract Background Accents */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#182A4A]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#C89B3C]/10 blur-3xl pointer-events-none" />

      {/* Fullscreen Loader */}
      <AnimatePresence>
        {loading && <Loader fullscreen={true} size={220} />}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white border-2 border-[#182A4A] shadow-2xl rounded-[36px] p-7 sm:p-9 w-full max-w-md z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C89B3C] hover:text-[#182A4A] mb-5 transition"
        >
          <ArrowLeft size={14} /> Back to Studio Home
        </Link>

        {/* Brand Header with Geometric Emblem */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#E6DCCE] shadow-soft-sm">
              <GeometricEmblem size={48} />
            </div>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-[#182A4A] tracking-tight">
            {SALON_CONFIG.name}
          </h1>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B3C] block mt-0.5">
            Staff & Reception Portal
          </span>
        </div>

        {/* ⚡ Quick Demo Autofill */}
        <div className="mb-5 bg-[#FAF6EE] border border-[#E6DCCE] rounded-2xl p-3.5 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-extrabold text-[#182A4A] uppercase tracking-wider text-[10px]">
            <Sparkles size={13} className="text-[#C89B3C]" />
            <span>Instant Demo Accounts (Click to Fill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("admin@bookmyglow.com", "admin123")}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white border border-[#E6DCCE] hover:border-[#182A4A] hover:bg-[#FAF2DE] text-[#182A4A] font-bold transition text-xs shadow-xs"
            >
              <span>👑 Owner (Admin)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("reception@bookmyglow.com", "recep123")}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white border border-[#E6DCCE] hover:border-[#182A4A] hover:bg-[#FAF2DE] text-[#182A4A] font-bold transition text-xs shadow-xs"
            >
              <span>👩‍💼 Receptionist</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#182A4A] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. admin@bookmyglow.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E6DCCE] bg-[#FAF6EE] focus:bg-white focus:border-[#182A4A] text-xs sm:text-sm text-[#182A4A] outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#182A4A] mb-1.5">
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
                className="w-full px-4 py-3 rounded-xl border border-[#E6DCCE] bg-[#FAF6EE] focus:bg-white focus:border-[#182A4A] text-xs sm:text-sm text-[#182A4A] outline-none transition pr-10 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-400 hover:text-[#182A4A] transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-navy-primary w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-navy-glow transition duration-200 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "SIGN IN TO STUDIO DASHBOARD"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-[10px] font-bold uppercase tracking-wider text-[#9A8F7F]">
          Authorized Personnel Only &bull; {SALON_CONFIG.name}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

