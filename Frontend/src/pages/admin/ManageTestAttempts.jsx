import { useEffect, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AlertBanner from "../../components/admin/AlertBanner";
import StudentReplyModal from "../../components/admin/StudentReplyModal";
import Loader from "../../components/ui/Loader";
import {
  getTestAttempts,
  updateTestAttemptStatus,
  deleteTestAttempt,
  getTestNotifyConfig,
} from "../../services/testAttemptService";

const statusStyles = {
  pending: "bg-blue-100 text-blue-700",
  selected: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const scoreColor = (score, total) => {
  const pct = (score / total) * 100;
  if (pct >= 70) return "text-green-600";
  if (pct >= 50) return "text-yellow-600";
  return "text-red-600";
};

const formatDeliveryAlert = (delivery) => {
  if (!delivery?.messages?.length) return "Status updated.";
  return delivery.messages.join(" | ");
};

export default function ManageTestAttempts() {
  const [attempts, setAttempts] = useState(null);
  const [notifyConfig, setNotifyConfig] = useState(null);
  const [filter, setFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [replyTarget, setReplyTarget] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    getTestAttempts(filter ? { status: filter } : {})
      .then((res) => setAttempts(res.data))
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
  };

  useEffect(() => {
    load();
  }, [filter]);

  useEffect(() => {
    getTestNotifyConfig()
      .then((res) => setNotifyConfig(res.data))
      .catch(() => {});
  }, []);

  const handleSelectReject = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await updateTestAttemptStatus(id, status);
      const deliveryMsg = formatDeliveryAlert(res.delivery);
      setAlert({
        type: res.delivery?.allConfigured === false ? "error" : "success",
        message:
          status === "selected"
            ? `Student marked as selected. ${deliveryMsg}`
            : `Student marked as rejected. ${deliveryMsg}`,
      });
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to update status." });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMessageSent = (res) => {
    setAlert({
      type: res.delivery?.allConfigured === false ? "error" : "success",
      message: `${res.message} ${formatDeliveryAlert(res.delivery)}`,
    });
    load();
  };

  const confirmDelete = async () => {
    try {
      await deleteTestAttempt(deleteTarget._id);
      setAlert({ type: "success", message: "Test attempt removed." });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete." });
    }
  };

  if (!attempts) return <Loader label="Loading test submissions..." />;

  const notifyWarning =
    notifyConfig && (!notifyConfig.emailConfigured || !notifyConfig.whatsappConfigured);

  return (
    <div>
      <PageHeader title="Online Test Submissions" />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      {notifyWarning && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold mb-1">Messages will not reach students until Backend/.env is configured</p>
          <ul className="list-disc pl-5 space-y-0.5 text-amber-800">
            {!notifyConfig.emailConfigured && (
              <li>
                Email: set <code className="text-xs bg-amber-100 px-1 rounded">EMAIL_USER</code> and{" "}
                <code className="text-xs bg-amber-100 px-1 rounded">EMAIL_PASS</code> (Gmail App Password)
              </li>
            )}
            {!notifyConfig.whatsappConfigured && (
              <li>
                WhatsApp: Twilio sandbox setup — run{" "}
                <code className="text-xs bg-amber-100 px-1 rounded">npm run whatsapp:setup SID TOKEN +14155238886 PHONE</code>
                . Student must first send <strong>join &lt;code&gt;</strong> to Twilio sandbox number on WhatsApp.
              </li>
            )}
          </ul>
          <p className="mt-2 text-xs">
            MongoDB only stores student details — it does not send messages. Use <strong>Send Message</strong> to reply
            from here once email/WhatsApp is configured.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { value: "", label: "All" },
          { value: "pending", label: "Pending Review" },
          { value: "selected", label: "Selected" },
          { value: "rejected", label: "Rejected" },
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
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Test</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt._id} className="border-b border-gray-50 hover:bg-gray-50 align-top">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{attempt.referenceId}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">{attempt.studentName}</div>
                    <div className="text-gray-400 text-xs">{attempt.studentClass}</div>
                    {attempt.parentName && <div className="text-gray-400 text-xs">Parent: {attempt.parentName}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px]">{attempt.testTitle}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${scoreColor(attempt.score, attempt.totalQuestions)}`}>
                      {attempt.score}/{attempt.totalQuestions}
                    </span>
                    <span className="text-gray-400 text-xs ml-1">
                      ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>{attempt.email}</div>
                    <div className="text-gray-400">{attempt.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(attempt.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[attempt.status]}`}>
                      {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setReplyTarget(attempt)}
                      className="text-xs font-semibold text-primary hover:underline mb-1 block ml-auto"
                    >
                      Send Message
                    </button>
                    {attempt.status === "pending" && (
                      <div className="flex justify-end gap-2 mb-1">
                        <button
                          disabled={updatingId === attempt._id}
                          onClick={() => handleSelectReject(attempt._id, "selected")}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Select
                        </button>
                        <button
                          disabled={updatingId === attempt._id}
                          onClick={() => handleSelectReject(attempt._id, "rejected")}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    <button onClick={() => setDeleteTarget(attempt)} className="text-red-500 hover:underline text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {attempts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No test submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {replyTarget && (
        <StudentReplyModal attempt={replyTarget} onClose={() => setReplyTarget(null)} onSent={handleMessageSent} />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message="Delete this test submission? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
