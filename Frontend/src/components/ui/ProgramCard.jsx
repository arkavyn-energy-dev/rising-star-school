import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";
import TiltCard from "./TiltCard";

export default function ProgramCard({ title, grades, description, imageUrl }) {
  return (
    <TiltCard className="group bg-white rounded-2xl border border-neutral-200 hover:border-accent/30 hover:shadow-lift transition-shadow duration-300 overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ink text-xs font-bold px-3 py-1 rounded-full">
          {grades}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-ink text-lg mb-2">{title}</h3>
        <p className="text-ink/60 text-sm leading-relaxed mb-4">{description}</p>
        <Link to="/academics" className="link-hover">
          Learn More
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </TiltCard>
  );
}
