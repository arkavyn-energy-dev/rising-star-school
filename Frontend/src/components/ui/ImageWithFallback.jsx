// Faculty/Event/Gallery/Testimonial photos are uploaded later via the admin
// panel — until then, imageUrl is empty. This renders a graceful placeholder
// instead of a broken <img> icon.
export default function ImageWithFallback({ src, alt, className = "" }) {
  if (!src) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-ink-soft to-ink flex items-center justify-center ${className}`}>
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/25 rounded-full blur-2xl" />
        <span className="relative font-heading font-extrabold text-2xl text-white/25 tracking-wide select-none">RS</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
