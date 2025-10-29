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

  // 🧠 Fetch all services
  const fetchServices = async () => {
    try {
      const res = await axios.get("/services", config);
      setServices(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🧾 Delete a service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`/services/${id}`, config);
      fetchServices();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✏️ Edit existing service
  const handleEdit = (srv) => {
    setForm({
      _id: srv._id,
      name: srv.name,
      description: srv.description,
      sub_services: srv.sub_services || [],
    });
  };

  // ➕ Add new service
  const handleAdd = () =>
    setForm({
      name: "",
      description: "",
      sub_services: [{ name: "", price: "" }],
    });

  // ➕ Add new sub-service
  const addSubService = () =>
    setForm({
      ...form,
      sub_services: [...form.sub_services, { name: "", price: "" }],
    });

  // 🧹 Remove sub-service
  const removeSubService = (index) => {
    const updated = [...form.sub_services];
    updated.splice(index, 1);
    setForm({ ...form, sub_services: updated });
  };

  // 💾 Save (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, salon_id };

      if (form._id) {
        await axios.put(`/services/${form._id}`, payload, config);
      } else {
        await axios.post("/services", payload, config);
      }

      fetchServices();
      setForm(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert(err.response?.data?.message || "Failed to save service");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Services</h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="bg-[#687FE5] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#5a6fd8]"
        >
          <Plus size={18} className="inline mr-2" /> Add Service
        </motion.button>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <motion.div
            key={srv._id}
            className="bg-white rounded-2xl border border-[#E0E3FF] shadow-md p-6 hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-lg font-semibold text-[#3A3A3A]">
              {srv.name}
            </h4>
            <p className="text-gray-600 mt-2 text-sm">{srv.description}</p>

            <div className="mt-3">
              <p className="text-gray-700 font-medium">Sub-Services:</p>
              <ul className="list-disc ml-6 text-gray-500 text-sm">
                {srv.sub_services.map((s, idx) => (
                  <li key={idx}>
                    {s.name} - ₹{s.price}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handleEdit(srv)}
                className="text-[#687FE5] hover:text-[#5057b6]"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(srv._id)}
                className="text-[#F87171] hover:text-[#dc2626]"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {form && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 rounded-3xl shadow-2xl border border-[#DDE1FF] w-full max-w-lg p-6"
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
                  className="w-full border border-[#DDE1FF] rounded-xl p-3 focus:ring-2 focus:ring-[#687FE5]"
                  required
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-[#DDE1FF] rounded-xl p-3 focus:ring-2 focus:ring-[#687FE5]"
                />

                {/* Sub Services */}
                <div className="mt-4 space-y-2">
                  <p className="font-medium text-gray-700 mb-2">
                    Sub Services:
                  </p>
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
                        className="w-1/2 border border-[#DDE1FF] rounded-xl p-2"
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
                        className="w-1/3 border border-[#DDE1FF] rounded-xl p-2"
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
                    className="px-4 py-2 rounded-2xl bg-[#687FE5] text-white hover:bg-[#5057b6] font-medium"
                  >
                    {form._id ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
