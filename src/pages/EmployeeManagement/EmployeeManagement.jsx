import React, { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";
import { Pencil, Trash2, Plus } from "lucide-react";
import { BASE_URL } from "../../data/data";

const EmployeeManagement = () => {
  const token = localStorage.getItem("token"); // get token

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
    address: "",
    status: true,
    password: "123456",
  });

  // Axios config with token
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/auth/employees`, config);
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

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add / Update Employee
  const handleSave = async () => {
    try {
      if (editingEmployee) {
        const payload = {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          status: formData.status,
        };
        await axios.put(`${BASE_URL}/auth/${editingEmployee._id}`, payload, config);
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "employee",
        };
        await axios.post(`${BASE_URL}/auth/register`, payload, config);
      }
      fetchEmployees();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Something went wrong while saving employee.");
    }
  };

  // Delete Employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${BASE_URL}/auth/${id}`, config);
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete employee.");
      }
    }
  };

  // Toggle Active/Inactive
  const toggleStatus = async (emp) => {
    try {
      await axios.put(
        `${BASE_URL}/auth/${emp._id}`,
        { ...emp, status: !emp.status },
        config
      );
      fetchEmployees();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    }
  };

  // Modal controls
  const openModal = (emp = null) => {
    setEditingEmployee(emp);
    setFormData(
      emp || {
        name: "",
        email: "",
        role: "employee",
        address: "",
        status: true,
        password: "123456",
      }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-[#687FE5] tracking-wide">
          Employee Management
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 text-base rounded-2xl bg-[#FBB6D6] text-white hover:bg-[#fa9bc5] font-medium transition-all"
        >
          <Plus size={20} /> Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white/90 backdrop-blur-md shadow-md rounded-3xl border border-[#f5d3eb]">
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">
            Loading...
          </div>
        ) : (
          <table className="min-w-full text-base font-medium">
            <thead className="bg-[#FEEBF6] text-[#687FE5] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Address</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500 text-lg italic"
                  >
                    No employees found 💨
                  </td>
                </tr>
              ) : (
                employees.map((emp, i) => (
                  <tr
                    key={emp._id}
                    className={`border-t ${
                      i % 2 === 0 ? "bg-white/80" : "bg-[#fef5fc]"
                    } hover:bg-[#fbe7f3]/80 transition-all`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{emp.email}</td>
                    <td className="px-6 py-4 capitalize text-gray-700">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {emp.address || "—"}
                    </td>
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
                    <td className="px-6 py-4 flex justify-center gap-4">
                      <button
                        onClick={() => openModal(emp)}
                        className="text-[#687FE5] hover:text-indigo-700"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="text-[#F78FB3] hover:text-[#f45b8a]"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white/95 rounded-3xl shadow-2xl border border-[#EBD6FB] w-full max-w-lg p-8 animate-fadeIn">
            <h3 className="text-2xl font-semibold text-[#687FE5] mb-5 text-center">
              {editingEmployee ? "Edit Employee ✏️" : "Add New Employee 💼"}
            </h3>

            <div className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-[#EBD6FB] rounded-xl p-3 text-base focus:ring-2 focus:ring-[#FBB6D6] outline-none"
              />
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-[#EBD6FB] rounded-xl p-3 text-base focus:ring-2 focus:ring-[#FBB6D6] outline-none"
              />
              {!editingEmployee && (
                <input
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-[#EBD6FB] rounded-xl p-3 text-base focus:ring-2 focus:ring-[#FBB6D6] outline-none"
                />
              )}
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-[#EBD6FB] rounded-xl p-3 text-base focus:ring-2 focus:ring-[#FBB6D6] outline-none"
              />
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="accent-[#687FE5] scale-125"
                />
                <label className="text-gray-700 text-base font-medium">
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-2xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-base font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-2xl bg-[#687FE5] text-white hover:bg-[#586ed6] transition-all text-base font-medium"
              >
                {editingEmployee ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
