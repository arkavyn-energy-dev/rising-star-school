const LOGO_SRC = "/school-images/rising-star-logo.png";
const INTRINSIC = 1024;

/**
 * Official Rising Star Public School logo.
 * Always serves the full 1024×1024 asset so it stays sharp on retina phones & laptops.
 * Display size is controlled via Tailwind classes so phone/laptop stay consistent (same logo, scaled).
 */
export default function SchoolLogo({
  className = "w-10 h-10",
  alt = "Rising Star Public School logo",
  priority = false,
}) {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      width={INTRINSIC}
      height={INTRINSIC}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      className={`school-logo object-contain select-none shrink-0 ${className}`}
    />
  );
}
