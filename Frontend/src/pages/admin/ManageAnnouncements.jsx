import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/announcementService";

export default function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: { text: "", order: 0 } });

  const load = () => {
    getAnnouncements()
      .then((res) => setAnnouncements(res.data))
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    reset({ text: "", order: 0 });
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    reset({ text: a.text, order: a.order });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateAnnouncement(editing._id, data);
        setAlert({ type: "success", message: "Announcement updated." });
      } else {
        await createAnnouncement(data);
        setAlert({ type: "success", message: "Announcement added." });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Something went wrong." });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteAnnouncement(deleteTarget._id);
      setAlert({ type: "success", message: "Announcement removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!announcements) return <Loader label="Loading announcements..." />;

  return (
    <div>
      <PageHeader title="Manage Announcements" actionLabel="+ Add Announcement" onAction={openAdd} />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {announcements.map((a) => (
          <div key={a._id} className="flex items-center justify-between px-5 py-4">
            <p className="text-sm text-gray-700">{a.text}</p>
            <div className="flex gap-3 text-sm flex-shrink-0 ml-4">
              <button onClick={() => openEdit(a)} className="text-accent-dark hover:underline">
                Edit
              </button>
              <button onClick={() => setDeleteTarget(a)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-gray-400 text-center py-8">No announcements yet. Click "Add Announcement" to create one.</p>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Announcement" : "Add Announcement"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea {...register("text", { required: true })} rows={3} placeholder="Announcement text (emoji encouraged, e.g. 📢 ...)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm resize-none" />
            <input {...register("order")} type="number" placeholder="Display Order" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
              {isSubmitting ? "Saving..." : editing ? "Update" : "Add"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog message="Delete this announcement?" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
