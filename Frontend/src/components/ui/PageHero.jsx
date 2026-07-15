import { motion } from "framer-motion";

// Shared dark "band" hero used at the top of every inner page — keeps the
// charcoal accent consistent across the site while the rest of each page
// stays light and minimal.
export default function PageHero({ title, subtitle }) {
  return (
    <section className="relative bg-ink py-20 lg:py-28 overflow-hidden">
      <div className="absolute -top-24 -right-16 w-80 h-80 bg-accent/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-accent/[0.06] rounded-full blur-3xl" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container-custom relative z-10 text-center"
      >
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4 tracking-tight">{title}</h1>
        <p className="text-white/55 text-lg max-w-2xl mx-auto">{subtitle}</p>
      </motion.div>
    </section>
  );
}
