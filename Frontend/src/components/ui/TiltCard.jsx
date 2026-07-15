import { useRef } from "react";

// Real 3D tilt + cursor-tracked spotlight glow, mutated directly on the DOM
// (no React re-renders on mousemove) for a buttery-smooth premium feel —
// the kind of micro-interaction seen on Linear/Vercel-style product sites.
export default function TiltCard({ children, className = "", strength = 8 }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const frame = useRef(null);

  const handleMouseMove = (e) => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - py) * strength;
      const rotateY = (px - 0.5) * strength;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(59,130,246,0.16), transparent 62%)`;
        glowRef.current.style.opacity = "1";
      }
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className} transition-transform duration-200 ease-out will-change-transform`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div ref={glowRef} className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 z-0" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
