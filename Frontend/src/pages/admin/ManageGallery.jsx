import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { getGalleryImages, createGalleryImage, deleteGalleryImage } from "../../services/galleryService";

const categories = ["Campus", "Classroom", "Sports", "Events"];

export default function ManageGallery() {
  const [images, setImages] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { category: "Campus", alt: "" },
  });

  const load = () => {
    getGalleryImages()
      .then((res) => setImages(res.data))
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    reset({ category: "Campus", alt: "" });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    if (!data.image?.[0]) {
      setAlert({ type: "error", message: "Please select an image file. Note: Cloudinary must be configured for uploads to work." });
      return;
    }

    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("alt", data.alt);
    formData.append("image", data.image[0]);

    try {
      await createGalleryImage(formData);
      setAlert({ type: "success", message: "Photo uploaded successfully." });
      setModalOpen(false);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Upload failed. Is Cloudinary configured?" });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteGalleryImage(deleteTarget._id);
      setAlert({ type: "success", message: "Photo removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!images) return <Loader label="Loading gallery..." />;

  return (
    <div>
      <PageHeader title="Manage Gallery" actionLabel="+ Upload Photo" onAction={openAdd} />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      {images.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
          No photos yet. Click "Upload Photo" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img._id} className="relative group rounded-lg overflow-hidden border border-gray-100 aspect-square">
              <ImageWithFallback src={img.imageUrl} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => setDeleteTarget(img)} className="text-white text-sm bg-red-500 px-3 py-1.5 rounded-lg">
                  Delete
                </button>
              </div>
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                {img.category}
              </span>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title="Upload Gallery Photo" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <select {...register("category", { required: true })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input {...register("alt")} placeholder="Alt text (description)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Photo (requires Cloudinary setup to work)</label>
              <input {...register("image", { required: true })} type="file" accept="image/*" className="w-full text-sm" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
              {isSubmitting ? "Uploading..." : "Upload"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog message="Delete this photo? This cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
