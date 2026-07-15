import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { subscribeNewsletter } from "../../services/newsletterService";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await subscribeNewsletter(email);
      setStatus({ type: "success", message: res.message || "Subscribed successfully!" });
      setEmail("");
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="bg-ink rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden border border-white/10">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="relative z-10">
            <SectionHeading
              title="Stay Updated"
              subtitle="Subscribe to our newsletter for the latest news, events, and announcements."
              light
            />
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent text-ink bg-white/95"
              />
              <button type="submit" disabled={submitting} className="btn-primary whitespace-nowrap disabled:opacity-60">
                {submitting ? "Subscribing..." : "Subscribe →"}
              </button>
            </form>
            {status.message && (
              <p className={`mt-4 text-sm ${status.type === "success" ? "text-accent-glow" : "text-red-300"}`}>
                {status.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
