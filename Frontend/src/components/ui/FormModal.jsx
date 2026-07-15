import { AnimatePresence, motion } from "framer-motion";

// Shared glass-styled modal shell for public-facing forms (admission
// enquiry, teacher application, etc.) — keeps the same premium look across
// every popup instead of the plain admin Modal.
export default function FormModal({ isOpen, onClose, badge, title, subtitle, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-glass p-6 sm:p-8"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 16 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-ink hover:bg-neutral-100 transition-colors"
            >
              ✕
            </button>

            <div className="mb-6">
              {badge && (
                <span className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {badge}
                </span>
              )}
              <h3 className="font-heading font-bold text-2xl text-ink">{title}</h3>
              {subtitle && <p className="text-neutral-500 text-sm mt-1">{subtitle}</p>}
            </div>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
