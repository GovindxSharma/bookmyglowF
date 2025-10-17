import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, RefreshCw } from "lucide-react";

const API_BASE = "http://localhost:3000/auth/employees"; // ⬅️ Change base URL as per your backend

const EmployeeManagement = () => {
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
  });

  // ✅ Fetch Employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
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

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Add / Update Employee
  const handleSave = async () => {
    try {
      if (editingEmployee) {
        await axios.put(`${API_BASE}/${editingEmployee._id}`, formData);
      } else {
        await axios.post(API_BASE, formData);
      }
      fetchEmployees();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // ✅ Delete Employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // ✅ Toggle Active/Inactive
  const toggleStatus = async (emp) => {
    try {
      await axios.put(`${API_BASE}/${emp._id}`, {
        ...emp,
        status: !emp.status,
      });
      fetchEmployees();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // ✅ Modal controls
  const openModal = (emp = null) => {
    setEditingEmployee(emp);
    setFormData(
      emp || { name: "", email: "", role: "employee", address: "", status: true }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Employee Management</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchEmployees}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} /> Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{emp.name}</td>
                    <td className="px-6 py-3">{emp.email}</td>
                    <td className="px-6 py-3">{emp.role}</td>
                    <td className="px-6 py-3">{emp.address || "—"}</td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(emp)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          emp.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-3 flex justify-center gap-3">
                      <button
                        onClick={() => openModal(emp)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </h3>

            <div className="space-y-3">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              <input
                name="role"
                placeholder="Role (e.g. employee, admin)"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <label>Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
