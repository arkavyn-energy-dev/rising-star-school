import { useState } from "react";

// Faculty/Event/Gallery/Testimonial photos are uploaded later via the admin
// panel — until then, imageUrl is empty. This renders a graceful placeholder
// instead of a broken <img> icon.
export default function ImageWithFallback({ 
  src, 
  alt, 
  className = "",
  priority = false,
  aspectRatio = "auto"
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div 
        className={`relative overflow-hidden bg-gradient-to-br from-ink-soft to-ink flex items-center justify-center ${className}`}
        style={{ aspectRatio }}
      >
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

  return (
    <div 
      className={`relative ${className}`}
      style={{ aspectRatio }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-ink-soft/50 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-150 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{ 
          willChange: 'opacity',
          contentVisibility: 'auto'
        }}
      />
    </div>
  );
}
