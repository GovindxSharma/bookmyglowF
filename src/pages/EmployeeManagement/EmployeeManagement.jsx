import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import { Pencil, Trash2, Plus, Users, Award, TrendingUp, Phone, MapPin, X, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../../data/data";
import Loader from "../../components/Layout/Loader.jsx";
import Alert from "../../components/Layout/Alert.jsx";
import EmployeePerformanceModal from "../../components/Employee/EmployeePerformaceModal.jsx";

const EmployeeManagement = () => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedPerformanceEmp, setSelectedPerformanceEmp] = useState(null);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: "info", message: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    gender: "female",
    address: "",
    status: true,
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "info", message: "" }), 3000);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/employee");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      showAlert("error", "Failed to fetch stylists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Stylist name is required.";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone number must be 10 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setOperationLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: `${formData.countryCode}${formData.phone.replace(/\D/g, "")}`,
        gender: formData.gender,
        address: formData.address,
        status: formData.status,
      };

      if (editingEmployee) {
        await axios.put(`/employee/${editingEmployee._id}`, payload);
        showAlert("success", "Stylist profile updated! ✨");
      } else {
        await axios.post("/employee", payload);
        showAlert("success", "New stylist added to team! ✨");
      }

      setShowModal(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Save error:", err);
      showAlert("error", "Failed to save stylist.");
    } finally {
      setOperationLoading(false);
    }
  };

  const openModal = (emp = null) => {
    setErrors({});
    if (emp) {
      setEditingEmployee(emp);
      const rawPhone = emp.phone ? emp.phone.replace("+91", "") : "";
      setFormData({
        name: emp.name || "",
        countryCode: "+91",
        phone: rawPhone,
        gender: emp.gender || "female",
        address: emp.address || "",
        status: emp.status !== undefined ? emp.status : true,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: "",
        countryCode: "+91",
        phone: "",
        gender: "female",
        address: "",
        status: true,
      });
    }
    setShowModal(true);
  };

  const toggleStatus = async (emp) => {
    try {
      await axios.put(`/employee/${emp._id}`, { status: !emp.status });
      setEmployees((prev) =>
        prev.map((e) => (e._id === emp._id ? { ...e, status: !emp.status } : e))
      );
      showAlert("success", `Stylist marked ${!emp.status ? "Active" : "Inactive"}`);
    } catch {
      showAlert("error", "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/employee/${id}`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
      showAlert("success", "Stylist removed.");
      setConfirmDelete(null);
    } catch {
      showAlert("error", "Failed to delete stylist.");
    }
  };

  if (loading && employees.length === 0) {
    return <Loader fullscreen={true} size={220} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#182A4A] p-4 sm:p-6 md:p-10 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6DCCE] shadow-soft-sm">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-[#182A4A] flex items-center gap-2">
              <Users size={22} className="text-[#C89B3C]" /> Specialist & Staff Directory
            </h1>
            <p className="text-xs text-[#5C6D88] mt-0.5">
              Manage salon staff, view performance metrics, and configure booking availability
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="btn-navy-primary px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-navy-glow"
          >
            <Plus size={15} />
            <span>ADD NEW SPECIALIST</span>
          </button>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="md:hidden space-y-3">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white rounded-2xl p-4 border border-[#EAE3D9] shadow-soft-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#1F2421]">{emp.name}</h4>
                  <a
                    href={`tel:${emp.phone}`}
                    className="text-xs text-[#4E6758] font-mono flex items-center gap-1 mt-0.5"
                  >
                    <Phone size={11} /> {emp.phone || "N/A"}
                  </a>
                </div>

                <button
                  onClick={() => toggleStatus(emp)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    emp.status
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {emp.status ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="bg-[#FDFBF9] p-2.5 rounded-xl border border-[#EAE3D9] text-xs space-y-1 text-[#555E58]">
                <div className="flex justify-between">
                  <span className="text-[#7D8480]">Gender:</span>
                  <span className="capitalize font-medium">{emp.gender || "Staff"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7D8480]">Address:</span>
                  <span className="font-medium max-w-[65%] truncate">{emp.address || "Metro City"}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => setSelectedPerformanceEmp(emp)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-[#EDF3EF] text-[#35473C] hover:bg-[#E0ECE5] font-semibold text-xs flex items-center justify-center gap-1 border border-[#D9E4DD] transition"
                >
                  <TrendingUp size={12} /> Performance
                </button>

                <button
                  onClick={() => openModal(emp)}
                  className="p-1.5 rounded-xl bg-[#F8F5F0] text-[#555E58] hover:bg-[#EAE3D9] transition"
                >
                  <Pencil size={13} />
                </button>

                <button
                  onClick={() => setConfirmDelete(emp._id)}
                  className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block bg-white rounded-3xl border border-[#EAE3D9] shadow-soft-sm overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F8F5F0] text-left text-xs font-bold text-[#4A524D] uppercase tracking-wider">
                <th className="px-5 py-3.5">Stylist</th>
                <th className="px-5 py-3.5">Phone Number</th>
                <th className="px-5 py-3.5">Gender</th>
                <th className="px-5 py-3.5">Address</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-sm">
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-[#FAF7F2] transition">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#1F2421]">{emp.name}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#555E58] font-mono">
                    {emp.phone || "N/A"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="capitalize text-xs font-medium px-2 py-0.5 rounded-md bg-[#F8F5F0] border border-[#EAE3D9] text-[#4A524D]">
                      {emp.gender || "Staff"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#555E58]">
                    {emp.address || "Metro City"}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleStatus(emp)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        emp.status
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {emp.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedPerformanceEmp(emp)}
                      className="px-2.5 py-1 rounded-lg bg-[#EDF3EF] text-[#35473C] hover:bg-[#E0ECE5] text-xs font-semibold inline-flex items-center gap-1 border border-[#D9E4DD] transition"
                    >
                      <TrendingUp size={12} /> Performance
                    </button>

                    <button
                      onClick={() => openModal(emp)}
                      className="p-1.5 rounded-lg bg-[#F8F5F0] text-[#555E58] hover:bg-[#EAE3D9] transition inline-flex"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>

                    <button
                      onClick={() => setConfirmDelete(emp._id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition inline-flex"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Stylist Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl shadow-soft-lg p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#F2ECE4] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1F2421]">
                {editingEmployee ? "Edit Stylist Profile" : "Add New Stylist"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#7D8480] hover:text-[#1F2421]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-sm"
                />
                {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-sm"
                />
                {errors.phone && <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Gender
                </label>
                <div className="flex gap-2">
                  {["female", "male", "other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, gender: g }))}
                      className={`flex-1 py-1.5 rounded-xl capitalize font-semibold transition ${
                        formData.gender === g
                          ? "bg-[#4E6758] text-white"
                          : "bg-[#F8F5F0] text-[#555E58] border border-[#EAE3D9]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Address / Locality
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Metro City"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  name="status"
                  id="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#4E6758]"
                />
                <label htmlFor="status" className="font-semibold text-[#1F2421]">
                  Active Stylist (Available for bookings)
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#F2ECE4] text-[#4A524D] text-xs font-semibold hover:bg-[#EAE3D9] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={operationLoading}
                className="flex-1 py-2.5 rounded-xl bg-[#4E6758] text-white text-xs font-semibold hover:bg-[#405448] transition shadow-soft-sm"
              >
                {operationLoading ? "Saving..." : "Save Stylist"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EAE3D9] shadow-soft-lg space-y-3 text-center">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <h3 className="text-base font-bold text-[#1F2421]">Remove Stylist?</h3>
            <p className="text-xs text-[#68706B]">
              This will remove this stylist from the active salon staff roster.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-xl bg-[#F2ECE4] text-[#4A524D] text-xs font-semibold hover:bg-[#EAE3D9] transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Modal */}
      {selectedPerformanceEmp && (
        <EmployeePerformanceModal
          employee={selectedPerformanceEmp}
          onClose={() => setSelectedPerformanceEmp(null)}
        />
      )}

      <Alert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default EmployeeManagement;
