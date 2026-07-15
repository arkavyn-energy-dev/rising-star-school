import ImageWithFallback from "./ImageWithFallback";
import TiltCard from "./TiltCard";

export default function FacultyCard({ name, designation, subject, qualification, imageUrl }) {
  return (
    <TiltCard className="group bg-white rounded-2xl border border-neutral-200 hover:border-accent/30 hover:shadow-lift transition-shadow duration-300 overflow-hidden text-center h-full">
      <div className="relative h-56 overflow-hidden bg-neutral-100">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-ink text-base mb-0.5">{name}</h3>
        <p className="text-accent font-semibold text-sm mb-1">{designation}</p>
        <p className="text-ink/50 text-xs">{subject}</p>
        <p className="text-ink/35 text-xs mt-1">{qualification}</p>
      </div>
    </TiltCard>
  );
}
