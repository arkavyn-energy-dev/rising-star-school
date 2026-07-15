import { motion } from "framer-motion";

// Global ambient background — a soft dot-grid plus slow-drifting gradient
// orbs. This is what gives the site depth instead of a flat white page;
// it sits fixed behind everything and never intercepts clicks/scroll.
export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-paper" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(23,23,23,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper" />

      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-accent/25 via-accent/10 to-transparent blur-[90px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[15%] right-[-10%] w-[32rem] h-[32rem] rounded-full bg-gradient-to-bl from-violet-400/20 via-accent/10 to-transparent blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-accent/15 via-transparent to-transparent blur-[100px]"
        animate={{ x: [0, 25, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}
