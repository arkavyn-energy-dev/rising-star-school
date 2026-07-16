import { useEffect, useState } from "react";
import { getSettings } from "../../services/settingsService";
import { sendTestAttemptMessage } from "../../services/testAttemptService";

const scorePercent = (score, total) => (total ? Math.round((score / total) * 100) : 0);

const buildTemplates = (attempt, settings) => {
  const schoolName = settings?.schoolName || "Rising Star Public School";
  const pct = scorePercent(attempt.score, attempt.totalQuestions);
  const details = [
    settings?.address && `Address: ${settings.address}`,
    settings?.phone && `Phone: ${settings.phone}`,
    settings?.email && `Email: ${settings.email}`,
    settings?.timings && `Timings: ${settings.timings}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    selected: {
      subject: `Congratulations! You're Selected — ${schoolName}`,
      message: `Dear ${attempt.studentName},

Congratulations! You have been SELECTED for admission at ${schoolName} based on your online assessment.

Assessment: ${attempt.testTitle}
Class: ${attempt.studentClass}
Your Score: ${attempt.score}/${attempt.totalQuestions} (${pct}%)
Reference ID: ${attempt.referenceId}

Next Steps:
1. Our team will call you at ${attempt.phone} within 24–48 hours.
2. Please visit the school with your parent/guardian to complete admission formalities.
3. Carry Aadhaar, previous school records, and passport-size photographs.

${details}

We look forward to welcoming you!

— Principal, ${schoolName}`,
    },
    rejected: {
      subject: `Update on your assessment — ${schoolName}`,
      message: `Dear ${attempt.studentName},

Thank you for appearing in the online assessment for ${schoolName} (${attempt.testTitle}).

After careful review, we are unable to move forward with your application at this time. We encourage you to apply again in the future.

${details}

— ${schoolName}`,
    },
    thankyou: {
      subject: `Test submitted — ${schoolName}`,
      message: `Dear ${attempt.studentName},

Thank you for taking the online assessment at ${schoolName}.

Test: ${attempt.testTitle}
Reference ID: ${attempt.referenceId}
Score: ${attempt.score}/${attempt.totalQuestions} (${pct}%)

Our team is reviewing your test. Please wait for the selection result on your email and WhatsApp.

${details}

— ${schoolName}`,
    },
  };
};

export default function StudentReplyModal({ attempt, onClose, onSent }) {
  const [settings, setSettings] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSettings()
      .then((res) => {
        setSettings(res.data);
        const templates = buildTemplates(attempt, res.data);
        setSubject(templates.selected.subject);
        setMessage(templates.selected.message);
      })
      .catch(() => setError("Failed to load school details."));
  }, [attempt]);

  const applyTemplate = (key) => {
    if (!settings) return;
    const templates = buildTemplates(attempt, settings);
    setSubject(templates[key].subject);
    setMessage(templates[key].message);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await sendTestAttemptMessage(attempt._id, {
        subject,
        message,
        sendEmail,
        sendWhatsApp,
      });
      onSent(res);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-heading font-bold text-lg text-primary">Send Message to Student</h3>
          <p className="text-gray-500 text-sm mt-1">
            Message goes to the email and WhatsApp number registered at test submission time.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Student</p>
              <p className="font-medium text-primary">{attempt.studentName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Reference ID</p>
              <p className="font-mono text-xs">{attempt.referenceId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Email</p>
              <p className="text-gray-700">{attempt.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Phone / WhatsApp</p>
              <p className="text-gray-700">{attempt.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "selected", label: "Selection template" },
              { key: "rejected", label: "Rejection template" },
              { key: "thankyou", label: "Thank you template" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => applyTemplate(t.key)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Message (edit in your own words)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y font-mono leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
              Send to Email
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sendWhatsApp} onChange={(e) => setSendWhatsApp(e.target.checked)} />
              Send to WhatsApp / SMS
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={submitting || !message.trim()}
            className="px-5 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send Message →"}
          </button>
        </div>
      </div>
    </div>
  );
}
