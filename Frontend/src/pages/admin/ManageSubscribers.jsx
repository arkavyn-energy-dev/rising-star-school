import { useEffect, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import AlertBanner from "../../components/admin/AlertBanner";
import Loader from "../../components/ui/Loader";
import { getSubscribers } from "../../services/newsletterService";

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ManageSubscribers() {
  const [subscribers, setSubscribers] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    getSubscribers()
      .then((res) => setSubscribers(res.data))
      .catch((err) => setAlert({ type: "error", message: err.response?.data?.message || err.message }));
  }, []);

  if (!subscribers) return <Loader label="Loading subscribers..." />;

  return (
    <div>
      <PageHeader title="Newsletter Subscribers" />
      <AlertBanner type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: "", message: "" })} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Subscribed On</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub._id} className="border-b border-gray-50">
                <td className="px-4 py-3 text-gray-700">{sub.email}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(sub.createdAt)}</td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
