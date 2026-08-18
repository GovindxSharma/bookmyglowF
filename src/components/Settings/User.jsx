import React, { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Layout/Loader";
import { Pencil, Trash2, Plus, Eye, EyeOff, ShieldCheck, UserCheck, X, Sparkles } from "lucide-react";

const User = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "info", message: "" });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "info", message: "" }), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/auth/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("❌ Failed fetching users:", err);
      showAlert("error", "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => setDeleteUserId(id);

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    setOperationLoading(true);
    try {
      await axios.delete(`/auth/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== deleteUserId));
      showAlert("success", "User account removed!");
    } catch (err) {
      console.error("Delete failed:", err);
      showAlert("error", "Failed to delete user.");
    } finally {
      setOperationLoading(false);
      setDeleteUserId(null);
    }
  };

  const handleEdit = (user) =>
    setForm({
      ...user,
      password: "",
    });

  const handleAdd = () =>
    setForm({
      name: "",
      email: "",
      password: "",
      role: "receptionist",
      phone: [""],
      gender: "female",
      status: true,
      address: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      return showAlert("error", "Name and email are required.");
    }
    setOperationLoading(true);
    try {
      if (form._id) {
        await axios.put(`/auth/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("success", "User account updated! ✨");
      } else {
        await axios.post(`/auth/register`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("success", "New staff account created! ✨");
      }
      fetchUsers();
      setForm(null);
    } catch (err) {
      console.error("Save failed:", err);
      showAlert("error", err.response?.data?.message || "Failed to save user.");
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading) return <Loader fullscreen={true} size={220} />;

  return (
    <div className="space-y-6 text-[#242A26]">
      {/* Alert */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3.5 rounded-2xl text-xs font-semibold text-center ${
              alert.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-3xl border border-[#EAE3D9] shadow-soft-sm">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1F2421]">
            Authorized Staff Accounts ({users.length})
          </h2>
          <p className="text-xs text-[#68706B]">
            Manage login permissions for Salon Owner and Front Desk Receptionists
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-2xl bg-[#4E6758] hover:bg-[#405448] text-white font-semibold text-xs transition duration-200 flex items-center gap-2 shadow-soft-sm"
        >
          <Plus size={15} />
          <span>Add Staff Account</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D9] shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F8F5F0] text-left text-xs font-bold text-[#4A524D] uppercase tracking-wider">
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email / Login ID</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] text-sm">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-[#FAF7F2] transition">
                  <td className="px-5 py-3.5 font-semibold text-[#1F2421]">
                    {u.name}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#555E58] font-mono">
                    {u.email}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        u.role === "admin"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-[#EDF3EF] text-[#35473C] border border-[#D9E4DD]"
                      }`}
                    >
                      {u.role === "admin" ? (
                        <>
                          <ShieldCheck size={12} /> Owner
                        </>
                      ) : (
                        <>
                          <UserCheck size={12} /> Front Desk
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(u)}
                      className="p-1.5 rounded-lg bg-[#F8F5F0] text-[#555E58] hover:bg-[#EAE3D9] transition inline-flex"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition inline-flex"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl shadow-soft-lg p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#F2ECE4] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1F2421]">
                {form._id ? "Edit Staff Account" : "Add Staff Account"}
              </h3>
              <button
                onClick={() => setForm(null)}
                className="text-[#7D8480] hover:text-[#1F2421]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Reception Desk"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Email / Login ID *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="staff@aurasalon.demo"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Password {form._id && "(leave blank to keep current)"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password || ""}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter secure password"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#7D8480]"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Access Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs font-semibold"
                >
                  <option value="receptionist">Receptionist (POS Billing & Register)</option>
                  <option value="admin">Salon Owner (Full Admin & Analytics)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F2ECE4] text-[#4A524D] text-xs font-semibold hover:bg-[#EAE3D9] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#4E6758] text-white text-xs font-semibold hover:bg-[#405448] transition shadow-soft-sm"
                >
                  {operationLoading ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EAE3D9] shadow-soft-lg space-y-3 text-center">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <h3 className="text-base font-bold text-[#1F2421]">Delete User Account?</h3>
            <p className="text-xs text-[#68706B]">
              This user will no longer be able to log in to the staff portal.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setDeleteUserId(null)}
                className="flex-1 py-2 rounded-xl bg-[#F2ECE4] text-[#4A524D] text-xs font-semibold hover:bg-[#EAE3D9] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
