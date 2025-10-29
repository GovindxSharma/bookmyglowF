import React, { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";
import { motion } from "framer-motion";
import Loader from "@/components/Layout/Loader";

const User = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/auth/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("❌ Failed fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (user) =>
    setForm({
      ...user,
      password: "", // leave blank for security
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
    try {
      if (form._id) {
        await axios.put(`/auth/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`/auth/register`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers();
      setForm(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">All Users</h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="bg-[#687FE5] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#5a6fd8]"
        >
          + Add User
        </motion.button>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-[#EBD6FB] text-gray-700 font-semibold">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{u.name}</td>
              <td className="py-3 px-4">{u.email}</td>
              <td className="py-3 px-4 capitalize">{u.role}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    u.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {u.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4 flex gap-3">
                <button
                  onClick={() => handleEdit(u)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-[#687FE5]">
              {form._id ? "Edit User" : "Add User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg"
              />

              <select
                name="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {/* Removed super_admin */}
                <option value="admin">Admin</option>
                <option value="receptionist">Receptionist</option>
              </select>

              <textarea
                name="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Address"
                className="w-full px-4 py-2 border rounded-lg"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#687FE5] text-white px-5 py-2 rounded-lg hover:bg-[#5a6fd8]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
