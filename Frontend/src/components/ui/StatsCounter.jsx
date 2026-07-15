import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSiteSettings } from "../../context/SiteSettingsContext";

function AnimatedNumber({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-heading font-extrabold text-white">
      {count}
      <span className="text-accent-glow">{suffix}</span>
    </div>
  );
}

export default function StatsCounter() {
  const { settings } = useSiteSettings();
  const stats = settings?.stats || [];

  if (stats.length === 0) return null;

  return (
    <section className="bg-ink relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[20rem] bg-accent/20 rounded-full blur-[100px]" />
      <div className="container-custom py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center bg-white/[0.04] border border-white/10 rounded-2xl py-8 px-4 backdrop-blur-sm hover:bg-white/[0.07] hover:border-accent/30 transition-colors duration-300"
            >
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              <p className="text-white/50 font-medium text-xs mt-2 uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
