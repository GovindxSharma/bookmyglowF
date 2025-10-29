import React, { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Layout/Loader";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const Services = () => {
  const token = localStorage.getItem("token");
  const salon_id = localStorage.getItem("userId");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "info", message: "" });
  const [operationLoading, setOperationLoading] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "info", message: "" }), 3000);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/services", config);
      setServices(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch services:", err);
      showAlert("error", "Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = (id) => setDeleteServiceId(id);

  const confirmDelete = async () => {
    if (!deleteServiceId) return;
    setOperationLoading(true);
    try {
      await axios.delete(`/services/${deleteServiceId}`, config);
      setServices((prev) => prev.filter((s) => s._id !== deleteServiceId));
      showAlert("success", "Service deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      showAlert("error", "Failed to delete service.");
    } finally {
      setOperationLoading(false);
      setDeleteServiceId(null);
    }
  };

  const handleEdit = (srv) => {
    setForm({
      _id: srv._id,
      name: srv.name,
      description: srv.description,
      sub_services: srv.sub_services || [],
    });
  };

  const handleAdd = () =>
    setForm({
      name: "",
      description: "",
      sub_services: [{ name: "", price: "" }],
    });

  const addSubService = () =>
    setForm({
      ...form,
      sub_services: [...form.sub_services, { name: "", price: "" }],
    });

  const removeSubService = (index) => {
    const updated = [...form.sub_services];
    updated.splice(index, 1);
    setForm({ ...form, sub_services: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    try {
      const payload = { ...form, salon_id };
      if (form._id) {
        await axios.put(`/services/${form._id}`, payload, config);
        showAlert("success", "Service updated successfully!");
      } else {
        await axios.post("/services", payload, config);
        showAlert("success", "Service added successfully!");
      }
      fetchServices();
      setForm(null);
    } catch (err) {
      console.error("Save failed:", err);
      showAlert("error", err.response?.data?.message || "Failed to save service");
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
                ? "bg-[#4ade80]" // green like Employee Management
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
        <h3 className="text-2xl font-semibold text-[#3A3A3A]">Services</h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="bg-[#687FE5] text-white px-5 py-2 rounded-2xl shadow-md hover:bg-[#5a6fd8] flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add Service
        </motion.button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <motion.div
            key={srv._id}
            className="bg-white rounded-2xl border border-[#E0E3FF] shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <h4 className="text-lg font-semibold text-[#3A3A3A]">{srv.name}</h4>
              <p className="text-gray-600 mt-1 text-sm">{srv.description}</p>

              {srv.sub_services.length > 0 && (
                <div className="mt-3">
                  <p className="text-gray-700 font-medium text-sm">Sub-Services:</p>
                  <ul className="list-disc ml-5 mt-1 text-gray-500 text-sm space-y-0.5">
                    {srv.sub_services.map((s, idx) => (
                      <li key={idx}>
                        {s.name} - ₹{s.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => handleEdit(srv)} className="text-[#687FE5] hover:text-[#5057b6]">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(srv._id)} className="text-[#F87171] hover:text-[#dc2626]">
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
              className="bg-white rounded-3xl shadow-2xl border border-[#DDE1FF] w-full max-w-lg p-6"
            >
              <h3 className="text-2xl font-semibold text-[#687FE5] mb-6 text-center">
                {form._id ? "Edit Service" : "Add Service"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  placeholder="Service Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[#DDE1FF] rounded-xl p-3 focus:ring-2 focus:ring-[#687FE5] outline-none"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[#DDE1FF] rounded-xl p-3 focus:ring-2 focus:ring-[#687FE5] outline-none"
                />
                <div className="mt-4 space-y-2">
                  <p className="font-medium text-gray-700 mb-2">Sub Services:</p>
                  {form.sub_services.map((sub, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        placeholder="Name"
                        value={sub.name}
                        onChange={(e) => {
                          const updated = [...form.sub_services];
                          updated[idx].name = e.target.value;
                          setForm({ ...form, sub_services: updated });
                        }}
                        className="w-1/2 border border-[#DDE1FF] rounded-xl p-2 focus:ring-2 focus:ring-[#687FE5] outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={sub.price}
                        onChange={(e) => {
                          const updated = [...form.sub_services];
                          updated[idx].price = e.target.value;
                          setForm({ ...form, sub_services: updated });
                        }}
                        className="w-1/3 border border-[#DDE1FF] rounded-xl p-2 focus:ring-2 focus:ring-[#687FE5] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubService(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSubService}
                    className="text-sm text-[#687FE5] hover:text-[#5057b6]"
                  >
                    + Add Sub Service
                  </button>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setForm(null)}
                    className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-2xl bg-[#4ade80] text-white hover:bg-green-500 font-medium" // green for success
                  >
                    {form._id ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteServiceId && (
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
              <h3 className="text-xl font-semibold mb-3 text-[#636CCB]">Delete Service?</h3>
              <p className="text-gray-600 mb-5">Are you sure you want to delete this service? This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteServiceId(null)}
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

export default Services;
