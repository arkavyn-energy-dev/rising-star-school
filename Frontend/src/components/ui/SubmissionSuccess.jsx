import { motion } from "framer-motion";
import { useState } from "react";

// Shared confirmation screen shown after a public form submission
// (admission enquiry, teacher application, online test). Surfaces the
// server-issued reference ID as the applicant's "proof" — they can screenshot
// or copy it, and it's also mirrored to their email/SMS/WhatsApp.
export default function SubmissionSuccess({ title, message, referenceId, note, onDone, doneLabel = "Done" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context) — non-critical.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="text-center py-2"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="font-heading font-bold text-xl text-ink mb-2">{title}</h3>
      <p className="text-ink/60 text-sm leading-relaxed max-w-sm mx-auto mb-5">{message}</p>

      {referenceId && (
        <div className="inline-flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3 mb-5">
          <div className="text-left">
            <p className="text-ink/40 text-[11px] uppercase tracking-wide font-semibold">Your Reference ID</p>
            <p className="font-heading font-bold text-ink text-lg tracking-wide">{referenceId}</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="w-9 h-9 flex items-center justify-center rounded-full text-accent hover:bg-accent/10 transition-colors shrink-0"
            aria-label="Copy reference ID"
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {note && <p className="text-ink/40 text-xs max-w-sm mx-auto mb-5">{note}</p>}

      {onDone && (
        <button type="button" onClick={onDone} className="btn-primary">
          {doneLabel}
        </button>
      )}
    </motion.div>
  );
}
