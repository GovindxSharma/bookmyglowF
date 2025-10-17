import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await axios.post("/auth/login", formData);
    const { token, role } = res.data;

    // Store token + role
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Redirect based on role
    if (role === "admin") navigate("/dashboard");
    else if (role === "receptionist") navigate("/bookings");
    else navigate("/login");
  } catch (err) {
    console.error("Login Error:", err);
    setError(err.response?.data?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FEEBF6] via-[#EBD6FB] to-[#FCD8CD] overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-[#687FE5]/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FCD8CD]/50 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-8 md:p-10 w-[90%] max-w-md z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#687FE5] font-[Poppins]">
            Salon Admin Login
          </h1>
          <p className="text-gray-600 mt-2 text-sm font-[Poppins]">
            Access your internal salon management dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-[Poppins]">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@salon.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#687FE5] focus:ring-2 focus:ring-[#EBD6FB] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#687FE5] focus:ring-2 focus:ring-[#EBD6FB] outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center mt-2">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full mt-6 font-semibold py-3 rounded-lg shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#687FE5] text-white hover:bg-[#5a6fd8]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600 font-[Poppins]">
          © {new Date().getFullYear()} GlowUp Salon — Internal Access Only
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
