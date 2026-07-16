import { useEffect, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import {
  getJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
} from "../../services/jobApplicationService";

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-green-100 text-green-700",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ManageJobApplications() {
  const [applications, setApplications] = useState(null);
  const [filter, setFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const load = () => {
    getJobApplications(filter || undefined)
      .then((res) => setApplications(res.data))
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateJobApplicationStatus(id, status);
      setAlert({ type: "success", message: "Status updated. Applicant will be notified by email/SMS if configured." });
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to update status." });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteJobApplication(deleteTarget._id);
      setAlert({ type: "success", message: "Application removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!applications) return <Loader label="Loading teacher applications..." />;

  return (
    <div>
      <PageHeader title="Teacher Applications" />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { value: "", label: "All" },
          { value: "new", label: "New" },
          { value: "shortlisted", label: "Shortlisted" },
          { value: "rejected", label: "Rejected" },
          { value: "hired", label: "Hired" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === opt.value ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3">Ref ID</th>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50 align-top">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{app.referenceId}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">{app.fullName}</div>
                    {app.message && <div className="text-gray-400 text-xs mt-1 max-w-xs">{app.message}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.subjectSpecialization}</td>
                  <td className="px-4 py-3 text-gray-600">{app.qualification}</td>
                  <td className="px-4 py-3 text-gray-600">{app.experienceYears || 0} yrs</td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>{app.email}</div>
                    <div className="text-gray-400">{app.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(app.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${statusStyles[app.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(app)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No teacher applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          message="Delete this application? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
