import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from "../../services/facultyService";

const emptyForm = { name: "", designation: "", subject: "", qualification: "", order: 0 };

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: emptyForm });

  const load = () => {
    getFaculty()
      .then((res) => setFaculty(res.data))
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

  const openEdit = (member) => {
    setEditing(member);
    reset({
      name: member.name,
      designation: member.designation,
      subject: member.subject,
      qualification: member.qualification,
      order: member.order,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") {
        if (value?.[0]) formData.append("image", value[0]);
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (editing) {
        await updateFaculty(editing._id, formData);
        setAlert({ type: "success", message: "Faculty member updated successfully." });
      } else {
        await createFaculty(formData);
        setAlert({ type: "success", message: "Faculty member added successfully." });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Something went wrong." });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteFaculty(deleteTarget._id);
      setAlert({ type: "success", message: "Faculty member removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!faculty) return <Loader label="Loading faculty..." />;

  return (
    <div>
      <PageHeader title="Manage Faculty" actionLabel="+ Add Faculty" onAction={openAdd} />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((member) => (
                <tr key={member._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <ImageWithFallback src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">{member.name}</td>
                  <td className="px-4 py-3 text-gray-600">{member.designation}</td>
                  <td className="px-4 py-3 text-gray-600">{member.subject}</td>
                  <td className="px-4 py-3 text-gray-600">{member.qualification}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(member)} className="text-accent-dark hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(member)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {faculty.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No faculty members yet. Click "Add Faculty" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Faculty Member" : "Add Faculty Member"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register("name", { required: true })} placeholder="Name" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <input {...register("designation", { required: true })} placeholder="Designation" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <input {...register("subject", { required: true })} placeholder="Subject" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <input {...register("qualification", { required: true })} placeholder="Qualification" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <input {...register("order")} type="number" placeholder="Display Order" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
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
          message={`Delete faculty member "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
