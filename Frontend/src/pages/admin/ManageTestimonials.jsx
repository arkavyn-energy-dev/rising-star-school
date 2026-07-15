import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../../services/testimonialService";

const emptyForm = { name: "", role: "", quote: "" };

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: emptyForm });

  const load = () => {
    getTestimonials()
      .then((res) => setTestimonials(res.data))
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    reset(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    reset({ name: t.name, role: t.role, quote: t.quote });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("role", data.role);
    formData.append("quote", data.quote);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    try {
      if (editing) {
        await updateTestimonial(editing._id, formData);
        setAlert({ type: "success", message: "Testimonial updated successfully." });
      } else {
        await createTestimonial(formData);
        setAlert({ type: "success", message: "Testimonial added successfully." });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Something went wrong." });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTestimonial(deleteTarget._id);
      setAlert({ type: "success", message: "Testimonial removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!testimonials) return <Loader label="Loading testimonials..." />;

  return (
    <div>
      <PageHeader title="Manage Testimonials" actionLabel="+ Add Testimonial" onAction={openAdd} />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <ImageWithFallback src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-medium text-primary text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm italic mb-4">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex gap-3 text-sm">
              <button onClick={() => openEdit(t)} className="text-accent-dark hover:underline">
                Edit
              </button>
              <button onClick={() => setDeleteTarget(t)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-8">No testimonials yet. Click "Add Testimonial" to create one.</p>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Testimonial" : "Add Testimonial"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register("name", { required: true })} placeholder="Name" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <input {...register("role", { required: true })} placeholder="Role (e.g. Parent, Class 5)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <textarea {...register("quote", { required: true })} rows={3} placeholder="Quote" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm resize-none" />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Photo (optional — requires Cloudinary setup)</label>
              <input {...register("image")} type="file" accept="image/*" className="w-full text-sm" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
              {isSubmitting ? "Saving..." : editing ? "Update" : "Add"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog message={`Delete testimonial from "${deleteTarget.name}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
