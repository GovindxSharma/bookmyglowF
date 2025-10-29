import React, { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Layout/Loader";
import { Pencil, Trash2, Plus } from "lucide-react";

const User = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "info", message: "" });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

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
      showAlert("success", "User deleted successfully!");
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
      gender: "other",
      status: true,
      address: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    try {
      if (form._id) {
        await axios.put(`/auth/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("success", "User updated successfully!");
      } else {
        await axios.post(`/auth/register`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("success", "User added successfully!");
      }
      fetchUsers();
      setForm(null);
    } catch (err) {
      console.error("Save failed:", err);
      showAlert("error", "Failed to save user.");
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div className="min-h-[70vh] sm:min-h-[80vh] relative">
      {/* Alert */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-medium shadow-lg text-white ${
              alert.type === "success"
                ? "bg-[#4ade80]" // Updated green
                : alert.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-2xl font-semibold text-[#3A3A3A]">All Users</h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="bg-[#687FE5] text-white px-5 py-2 rounded-2xl shadow-md hover:bg-[#5a6fd8] flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add User
        </motion.button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {users.map((u) => (
          <motion.div
            key={u._id}
            className="bg-white rounded-2xl border border-[#E0E3FF] shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-lg transition-all"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex-1">
              <p className="font-semibold text-[#3A3A3A]">{u.name}</p>
              <p className="text-gray-500 text-sm">{u.email}</p>
              <p className="text-gray-500 text-sm capitalize">{u.role}</p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                u.status ? "bg-[#d1fae5] text-[#4ade80]" : "bg-red-100 text-red-700" // Active status green updated
              }`}
            >
              {u.status ? "Active" : "Inactive"}
            </span>

            <div className="flex gap-3 mt-2 sm:mt-0">
              <button
                onClick={() => handleEdit(u)}
                className="text-[#687FE5] hover:text-[#5057b6]"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className="text-[#F87171] hover:text-[#dc2626]"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Add/Edit Modal */}
      <AnimatePresence>
        {form && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start sm:items-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#DDE1FF] w-full max-w-md p-6"
            >
              <h2 className="text-2xl font-semibold mb-4 text-[#687FE5] text-center">
                {form._id ? "Edit User" : "Add User"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-2 border border-[#DDE1FF] rounded-xl focus:ring-2 focus:ring-[#687FE5] outline-none"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-2 border border-[#DDE1FF] rounded-xl focus:ring-2 focus:ring-[#687FE5] outline-none"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-[#DDE1FF] rounded-xl focus:ring-2 focus:ring-[#687FE5] outline-none"
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2 border border-[#DDE1FF] rounded-xl focus:ring-2 focus:ring-[#687FE5] outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Address"
                  className="w-full px-4 py-2 border border-[#DDE1FF] rounded-xl focus:ring-2 focus:ring-[#687FE5] outline-none"
                />

                <div className="flex justify-end gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setForm(null)}
                    className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#687FE5] text-white px-5 py-2 rounded-2xl hover:bg-[#5057b6] font-medium"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteUserId && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 shadow-xl w-[90%] max-w-sm text-center"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#636CCB]">Delete User?</h3>
              <p className="text-gray-600 mb-5">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteUserId(null)}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {operationLoading && <Loader fullscreen />}
    </div>
  );
};

export default User;
