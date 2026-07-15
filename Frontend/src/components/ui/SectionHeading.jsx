import { motion } from "framer-motion";

export default function SectionHeading({ title, subtitle, light = false, center = true, kicker }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-10 lg:mb-14 ${center ? "text-center" : ""}`}
    >
      {kicker && (
        <span
          className={`inline-block text-xs font-semibold uppercase tracking-[0.15em] mb-3 ${
            light ? "text-brand-glow" : "text-brand"
          }`}
        >
          {kicker}
        </span>
      )}
      <h2
        className={`font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4 ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg max-w-2xl leading-relaxed ${center ? "mx-auto" : ""} ${
            light ? "text-white/60" : "text-ink/55"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
