import { motion, useScroll, useSpring } from "framer-motion";

// Thin progress line pinned to the very top edge of the viewport, above the
// admission banner — a small, expected touch on modern content-heavy sites.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 32, mass: 0.4 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-light to-violet-400 origin-left z-[70]"
    />
  );
}
