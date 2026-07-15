import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAdmissionModal } from "../../context/AdmissionModalContext";

const slides = [
  {
    text: "Admissions Open 2026–27 | Nursery to Class 10 | Bettiah",
    ctaLabel: "Apply Now",
    type: "admission",
  },
  {
    text: "Upcoming Events — Open to All Schools, Free Registration, Certificates & Prizes!",
    ctaLabel: "View Events",
    type: "events",
  },
];

// Slim, always-visible strip pinned above the navbar on every page — rotates
// between the admission CTA and an events promo so both stay top-of-mind
// without needing two separate banners.
export default function AdmissionBanner() {
  const { openAdmissionModal } = useAdmissionModal();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <div className="sticky top-0 z-[60] bg-ink text-white overflow-hidden">
      <div className="container-custom flex items-center justify-center gap-3 py-2 min-h-[36px]">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand animate-pulse-dot" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.type}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <p className="text-xs sm:text-sm font-medium tracking-wide text-center">{slide.text}</p>

            {slide.type === "admission" ? (
              <motion.button
                onClick={openAdmissionModal}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="ml-1 bg-brand text-white text-xs font-semibold px-3.5 py-1 rounded-full hover:bg-brand-light transition-colors shrink-0"
              >
                {slide.ctaLabel}
              </motion.button>
            ) : (
              <Link
                to="/events"
                className="ml-1 bg-brand text-white text-xs font-semibold px-3.5 py-1 rounded-full hover:bg-brand-light transition-colors shrink-0"
              >
                {slide.ctaLabel}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
