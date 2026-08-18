import React, { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Layout/Loader";
import { Pencil, Trash2, Plus, X, Scissors, Tag, Check, Sparkles } from "lucide-react";

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
      showAlert("success", "Service category deleted!");
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
    if (!form.name.trim()) return showAlert("error", "Category name is required.");
    setOperationLoading(true);
    try {
      const payload = { ...form, salon_id };
      if (form._id) {
        await axios.put(`/services/${form._id}`, payload, config);
        showAlert("success", "Service category updated! ✨");
      } else {
        await axios.post("/services", payload, config);
        showAlert("success", "New service category added! ✨");
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
            Active Salon Catalog ({services.length} Categories)
          </h2>
          <p className="text-xs text-[#68706B]">
            Add or adjust pricing and treatments available in the POS and booking form
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-2xl bg-[#4E6758] hover:bg-[#405448] text-white font-semibold text-xs transition duration-200 flex items-center gap-2 shadow-soft-sm"
        >
          <Plus size={15} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv) => (
          <div
            key={srv._id}
            className="bg-white rounded-3xl border border-[#EAE3D9] shadow-soft-sm p-5 sm:p-6 flex flex-col justify-between hover:shadow-soft-md transition-all space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#4E6758] uppercase tracking-wider block mb-0.5">
                    Category
                  </span>
                  <h3 className="font-heading text-base font-bold text-[#1F2421]">
                    {srv.name}
                  </h3>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-[#EDF3EF] text-[#35473C] text-[11px] font-bold">
                  {srv.sub_services?.length || 0} Treatments
                </span>
              </div>

              <p className="text-xs text-[#68706B] mt-1.5 leading-relaxed">
                {srv.description || "Professional salon treatments and care."}
              </p>

              {srv.sub_services && srv.sub_services.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-[#F2ECE4] space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-[#7D8480] tracking-wider block">
                    Treatments & Pricing:
                  </span>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {srv.sub_services.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs bg-[#FDFBF9] p-2 rounded-xl border border-[#EAE3D9]"
                      >
                        <span className="font-medium text-[#1F2421]">{s.name}</span>
                        <span className="font-bold text-[#4E6758]">₹{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-[#F2ECE4]">
              <button
                onClick={() => handleEdit(srv)}
                className="px-3 py-1.5 rounded-xl bg-[#EDF3EF] text-[#35473C] hover:bg-[#E0ECE5] font-semibold text-xs flex items-center gap-1 border border-[#D9E4DD] transition"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => handleDelete(srv._id)}
                className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl shadow-soft-lg p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#F2ECE4] pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1F2421]">
                {form._id ? "Edit Category & Pricing" : "Add Service Category"}
              </h3>
              <button
                onClick={() => setForm(null)}
                className="text-[#7D8480] hover:text-[#1F2421]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Hair Styling & Color"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1F2421] block mb-1">
                  Category Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief summary of treatments in this category..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
                />
              </div>

              {/* Sub Services Builder */}
              <div className="space-y-2 pt-2 border-t border-[#F2ECE4]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1F2421]">
                    Sub-Services & Price List
                  </span>
                  <button
                    type="button"
                    onClick={addSubService}
                    className="text-[#4E6758] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Treatment
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {form.sub_services.map((sub, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Treatment name (e.g. Hair Spa)"
                        value={sub.name}
                        onChange={(e) => {
                          const updated = [...form.sub_services];
                          updated[idx].name = e.target.value;
                          setForm({ ...form, sub_services: updated });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={sub.price}
                        onChange={(e) => {
                          const updated = [...form.sub_services];
                          updated[idx].price = e.target.value;
                          setForm({ ...form, sub_services: updated });
                        }}
                        className="w-24 px-3 py-1.5 rounded-xl bg-[#FDFBF9] border border-[#D9D0C5] focus:border-[#4E6758] outline-none text-xs"
                      />
                      {form.sub_services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubService(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                  {operationLoading ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteServiceId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EAE3D9] shadow-soft-lg space-y-3 text-center">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <h3 className="text-base font-bold text-[#1F2421]">Delete Service Category?</h3>
            <p className="text-xs text-[#68706B]">
              This will remove this category and all its treatments from the menu.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setDeleteServiceId(null)}
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

export default Services;
