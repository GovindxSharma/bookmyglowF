import React, { useState } from "react";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login successful!\nEmail: ${formData.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FEEBF6] via-[#EBD6FB] to-[#FCD8CD] overflow-hidden relative">
      {/* Decorative gradient blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-[#687FE5]/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FCD8CD]/50 rounded-full blur-[120px]" />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-8 md:p-10 w-[90%] max-w-md z-10"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#687FE5] font-[Poppins]">
            Salon Admin Login
          </h1>
          <p className="text-gray-600 mt-2 text-sm font-[Poppins]">
            Access your internal salon management dashboard
          </p>
        </div>

        {/* Form */}
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

          <div className="flex justify-between items-center text-sm mt-2">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-[#687FE5]" /> Remember me
            </label>
            <a href="#" className="text-[#687FE5] hover:underline">
              Forgot Password?
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full mt-6 bg-[#687FE5] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#5a6fd8] transition-all"
          >
            Login
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600 font-[Poppins]">
          © {new Date().getFullYear()} GlowUp Salon — Internal Access Only
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
