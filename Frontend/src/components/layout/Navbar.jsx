import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import SchoolLogo from "../ui/SchoolLogo";

const primaryLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions", label: "Admissions" },
];

const moreLinks = [
  { to: "/faculty", label: "Faculty" },
  { to: "/gallery", label: "Gallery" },
  { to: "/events", label: "Events" },
  { to: "/online-test", label: "Online Test" },
  { to: "/contact", label: "Contact" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteSettings();
  const { openAdmissionModal } = useAdmissionModal();
  const location = useLocation();
  const moreRef = useRef(null);
  const isMoreActive = moreLinks.some((l) => l.to === location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="px-3 sm:px-4 pt-2">
      <nav
        className={`max-w-6xl mx-auto rounded-xl transition-all duration-300 ${
          scrolled ? "glass shadow-glass" : "bg-white/90 backdrop-blur-md border border-white/70 shadow-soft"
        }`}
      >
        <div className="flex items-center justify-between h-14 lg:h-[56px] px-3 lg:px-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 min-w-0 group" aria-label="Rising Star Public School — Home">
            <SchoolLogo
              priority
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg shadow-sm ring-1 ring-black/5 group-hover:shadow-md transition-shadow"
            />
            <p className="hidden md:block text-ink font-heading font-bold text-[13px] truncate max-w-[140px] lg:max-w-[200px] group-hover:text-brand transition-colors">
              {settings?.schoolName || "Rising Star Public School"}
            </p>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => `nav-link px-3 py-1.5 text-[13px] font-medium rounded-lg ${isActive ? "nav-link-active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                className={`nav-link px-3 py-1.5 text-[13px] font-medium rounded-lg inline-flex items-center gap-0.5 ${
                  isMoreActive || moreOpen ? "nav-link-active" : ""
                }`}
              >
                More
                <svg className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 pt-1.5 z-20"
                  >
                    <div className="glass shadow-glass rounded-xl p-1.5 min-w-[9.5rem]">
                      {moreLinks.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          onClick={() => setMoreOpen(false)}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                              isActive ? "text-brand bg-brand/10" : "text-ink/70 hover:text-brand hover:bg-brand/5"
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={openAdmissionModal}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary ml-1.5 text-xs !py-1.5 !px-4"
            >
              Apply Now
            </motion.button>
          </div>

          <div className="flex lg:hidden items-center gap-1">
            <button onClick={openAdmissionModal} className="btn-primary text-xs !py-1.5 !px-3">
              Apply
            </button>
            <button onClick={() => setIsOpen(true)} className="text-ink p-1.5" aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="lg:hidden fixed top-0 right-0 z-[90] h-full w-[78%] max-w-xs bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-12 border-b border-neutral-100">
                <p className="font-heading font-bold text-sm text-ink">Menu</p>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-ink/50 hover:text-ink" aria-label="Close">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
                {allLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive ? "text-brand bg-brand/10" : "text-ink/75 hover:text-brand hover:bg-brand/5"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
