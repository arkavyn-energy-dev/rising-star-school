import { useEffect, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import { getAdmissionEnquiries, updateAdmissionStatus, deleteAdmissionEnquiry } from "../../services/admissionService";

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
};

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ManageAdmissions() {
  const [enquiries, setEnquiries] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const load = () => {
    getAdmissionEnquiries()
      .then((res) => setEnquiries(res.data))
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAdmissionStatus(id, status);
      setAlert({ type: "success", message: "Status updated. Parent will be notified by email/SMS if configured." });
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to update status." });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteAdmissionEnquiry(deleteTarget._id);
      setAlert({ type: "success", message: "Enquiry removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!enquiries) return <Loader label="Loading admission enquiries..." />;

  return (
    <div>
      <PageHeader title="Admission Enquiries" />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3">Ref ID</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => (
                <tr key={enq._id} className="border-b border-gray-50 hover:bg-gray-50 align-top">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{enq.referenceId}</td>
                  <td className="px-4 py-3 font-medium text-primary">{enq.parentName}</td>
                  <td className="px-4 py-3 text-gray-600">{enq.studentName}</td>
                  <td className="px-4 py-3 text-gray-600">{enq.grade}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>{enq.email}</div>
                    <div className="text-gray-400">{enq.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(enq.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${statusStyles[enq.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(enq)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No admission enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDialog message="Delete this enquiry? This cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
