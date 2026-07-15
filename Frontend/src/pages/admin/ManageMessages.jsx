import { useEffect, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import { getContactMessages, updateContactStatus, deleteContactMessage } from "../../services/contactService";

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
};

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ManageMessages() {
  const [messages, setMessages] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const load = () => {
    getContactMessages()
      .then((res) => setMessages(res.data))
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateContactStatus(id, status);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to update status." });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteContactMessage(deleteTarget._id);
      setAlert({ type: "success", message: "Message removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!messages) return <Loader label="Loading contact messages..." />;

  return (
    <div>
      <PageHeader title="Contact Messages" />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-primary text-sm">
                  {msg.name} <span className="text-gray-400 font-normal">· {msg.email}</span>
                </p>
                <p className="text-gray-400 text-xs">{msg.phone || "No phone provided"} · {formatDate(msg.createdAt)}</p>
              </div>
              <select
                value={msg.status}
                onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${statusStyles[msg.status]}`}
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <p className="font-semibold text-gray-700 text-sm mb-1">{msg.subject}</p>
            <p className="text-gray-600 text-sm">{msg.message}</p>
            <button onClick={() => setDeleteTarget(msg)} className="text-red-500 hover:underline text-xs mt-3">
              Delete
            </button>
          </div>
        ))}
        {messages.length === 0 && <p className="text-gray-400 text-center py-8">No contact messages yet.</p>}
      </div>

      {deleteTarget && (
        <ConfirmDialog message="Delete this message? This cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
