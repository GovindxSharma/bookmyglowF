// src/pages/Admin/EmployeeManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../../data/data";
import Loader from "../../components/Layout/Loader.jsx"; // Custom fullscreen loader

const EmployeeManagement = () => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false); // For save/update/delete
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    gender: "",
    address: "",
    status: true,
  });

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/employee`, config);
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!/^[A-Za-z\s]+$/.test(formData.name.trim()))
      newErrors.name = "Only letters and spaces are allowed.";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save employee
  const handleSave = async () => {
    if (!validateForm()) return;
    setOperationLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: `${formData.countryCode}${formData.phone}`,
        gender: formData.gender,
        address: formData.address,
        status: formData.status,
      };
      if (editingEmployee) {
        await axios.put(`${BASE_URL}/employee/${editingEmployee._id}`, payload, config);
      } else {
        await axios.post(`${BASE_URL}/employee`, payload, config);
      }
      fetchEmployees();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Something went wrong while saving.");
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    setOperationLoading(true);
    try {
      await axios.delete(`${BASE_URL}/employee/${id}`, config);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete employee.");
    } finally {
      setOperationLoading(false);
    }
  };

  // Toggle active/inactive
  const toggleStatus = async (emp) => {
    setOperationLoading(true);
    try {
      await axios.put(`${BASE_URL}/employee/${emp._id}`, { ...emp, status: !emp.status }, config);
      fetchEmployees();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    } finally {
      setOperationLoading(false);
    }
  };

  // Modal handlers
  const openModal = (emp = null) => {
    setEditingEmployee(emp);
    setFormData(
      emp
        ? {
            name: emp.name,
            countryCode: emp.phone?.startsWith("+91") ? "+91" : "+1",
            phone: emp.phone?.replace("+91", "").replace("+1", ""),
            gender: emp.gender,
            address: emp.address,
            status: emp.status,
          }
        : {
            name: "",
            countryCode: "+91",
            phone: "",
            gender: "",
            address: "",
            status: true,
          }
    );
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-[#EEF1FF] via-[#F5F6FF] to-white relative">
      {/* Fullscreen loader */}
      {(loading || operationLoading) && <Loader fullscreen={true} size={150} />}

      {/* Add Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#636CCB] text-white font-medium hover:bg-[#535bc1] transition-all shadow-md"
        >
          <Plus size={20} /> Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-3xl border border-[#DDE1FF] relative">
        {!loading && employees.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg italic">
            No employees found 
          </div>
        ) : (
          <table className="min-w-full text-base font-medium border-collapse">
            <thead className="bg-[#636CCB]/10 text-[#3A3A3A] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left w-[20%]">Name</th>
                <th className="px-6 py-4 text-left w-[20%]">Phone</th>
                <th className="px-6 py-4 text-left w-[10%]">Gender</th>
                <th className="px-6 py-4 text-left w-[25%]">Address</th>
                <th className="px-6 py-4 text-center w-[10%]">Status</th>
                <th className="px-6 py-4 text-center w-[15%]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp, i) => (
                <tr
                  key={emp._id}
                  className={`border-t ${i % 2 === 0 ? "bg-white" : "bg-[#F7F8FF]"} hover:bg-[#E9EBFF]/70 transition`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">{emp.name}</td>
                  <td className="px-6 py-4 text-gray-700">{emp.phone}</td>
                  <td className="px-6 py-4 capitalize text-gray-700">{emp.gender || "—"}</td>
                  <td className="px-6 py-4 text-gray-700">{emp.address || "—"}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(emp)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        emp.status
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {emp.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-4">
                      <button onClick={() => openModal(emp)} className="text-[#636CCB] hover:text-[#4f56b0]">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleDelete(emp._id)} className="text-[#F87171] hover:text-[#dc2626]">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 rounded-3xl shadow-2xl border border-[#DDE1FF] w-full max-w-lg p-8"
            >
              <h3 className="text-2xl font-semibold text-[#636CCB] mb-6 text-center">
                {editingEmployee ? "Edit Employee " : "Add New Employee "}
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-[#DDE1FF] rounded-xl p-3 text-base focus:ring-2 focus:ring-[#636CCB] outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="border border-[#DDE1FF] rounded-xl p-3 bg-white text-base focus:ring-2 focus:ring-[#636CCB] outline-none w-24"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                    <input
                      name="phone"
                      placeholder="10-digit Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 border border-[#DDE1FF] rounded-xl p-3 text-base focus:ring-2 focus:ring-[#636CCB] outline-none"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Gender */}
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-[#DDE1FF] rounded-xl p-3 text-base focus:ring-2 focus:ring-[#636CCB] outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>

                {/* Address */}
                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-[#DDE1FF] rounded-xl p-3 text-base focus:ring-2 focus:ring-[#636CCB] outline-none"
                />

                {/* Status */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="accent-[#636CCB] scale-125"
                  />
                  <label className="text-gray-700 text-base font-medium">Active</label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-2xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-2xl bg-[#636CCB] text-white hover:bg-[#5057b6] transition-all text-base font-medium"
                >
                  {editingEmployee ? "Update" : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeManagement;
