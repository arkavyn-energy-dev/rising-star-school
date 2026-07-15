import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../../services/eventService";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  isUpcoming: true,
  isOpenToAll: false,
  hasCertificate: false,
  hasPrizes: false,
  registrationFee: "Free",
  prizeDetails: "",
};

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ManageEvents() {
  const [events, setEvents] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: emptyForm });

  const load = () => {
    getEvents()
      .then((res) => setEvents(res.data))
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

  const openEdit = (event) => {
    setEditing(event);
    reset({
      title: event.title,
      description: event.description,
      date: event.date?.slice(0, 10),
      isUpcoming: event.isUpcoming,
      isOpenToAll: event.isOpenToAll || false,
      hasCertificate: event.hasCertificate || false,
      hasPrizes: event.hasPrizes || false,
      registrationFee: event.registrationFee || "Free",
      prizeDetails: event.prizeDetails || "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("isUpcoming", data.isUpcoming);
    formData.append("isOpenToAll", data.isOpenToAll);
    formData.append("hasCertificate", data.hasCertificate);
    formData.append("hasPrizes", data.hasPrizes);
    formData.append("registrationFee", data.registrationFee || "Free");
    formData.append("prizeDetails", data.prizeDetails || "");
    if (data.image?.[0]) formData.append("image", data.image[0]);

    try {
      if (editing) {
        await updateEvent(editing._id, formData);
        setAlert({ type: "success", message: "Event updated successfully." });
      } else {
        await createEvent(formData);
        setAlert({ type: "success", message: "Event added successfully." });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Something went wrong." });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteEvent(deleteTarget._id);
      setAlert({ type: "success", message: "Event removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!events) return <Loader label="Loading events..." />;

  return (
    <div>
      <PageHeader title="Manage Events" actionLabel="+ Add Event" onAction={openAdd} />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <ImageWithFallback src={event.imageUrl} alt={event.title} className="w-12 h-10 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">{event.title}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(event.date)}</td>
                  <td className="px-4 py-3 space-x-1.5 whitespace-nowrap">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${event.isUpcoming ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {event.isUpcoming ? "Upcoming" : "Past"}
                    </span>
                    {event.isOpenToAll && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Open to All</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(event)} className="text-accent-dark hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(event)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No events yet. Click "Add Event" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Event" : "Add Event"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register("title", { required: true })} placeholder="Event Title" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <textarea {...register("description", { required: true })} rows={3} placeholder="Description" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm resize-none" />
            <input {...register("date", { required: true })} type="date" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input {...register("isUpcoming")} type="checkbox" className="rounded" />
              This is an upcoming event
            </label>

            <div className="border-t border-gray-100 pt-3 space-y-2.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Open Event Promotion</p>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input {...register("isOpenToAll")} type="checkbox" className="rounded" />
                Open to students from other schools too
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input {...register("hasCertificate")} type="checkbox" className="rounded" />
                Participation certificate provided
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input {...register("hasPrizes")} type="checkbox" className="rounded" />
                Prizes for winners
              </label>
              <input {...register("registrationFee")} placeholder="Registration Fee (e.g. Free)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
              <input {...register("prizeDetails")} placeholder="Prize details (optional)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            </div>

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
        <ConfirmDialog
          message={`Delete event "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
