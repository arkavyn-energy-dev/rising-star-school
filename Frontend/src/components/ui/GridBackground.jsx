// Subtle dot-grid texture that fades out at the edges — drop inside any
// `relative overflow-hidden` section to give it depth instead of a flat fill.
export default function GridBackground({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(23,23,23,0.08) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage:
          "radial-gradient(ellipse 65% 55% at 50% 40%, black 0%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 65% 55% at 50% 40%, black 0%, transparent 75%)",
      }}
      aria-hidden="true"
    />
  );
}
