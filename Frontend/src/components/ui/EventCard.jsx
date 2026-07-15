import ImageWithFallback from "./ImageWithFallback";
import TiltCard from "./TiltCard";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function EventCard({
  title,
  date,
  description,
  imageUrl,
  isUpcoming,
  isOpenToAll,
  hasCertificate,
  hasPrizes,
  registrationFee,
  prizeDetails,
}) {
  return (
    <TiltCard className="group bg-white rounded-2xl border border-neutral-200 hover:border-accent/30 hover:shadow-lift transition-shadow duration-300 overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${
            isUpcoming ? "bg-accent/90 text-white" : "bg-ink/70 text-white"
          }`}
        >
          {isUpcoming ? "Upcoming" : "Past Event"}
        </div>
        {isOpenToAll && (
          <div className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-sm">
            Open to All Schools
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(date)}
        </div>
        <h3 className="font-heading font-bold text-ink text-lg mb-2">{title}</h3>
        <p className="text-ink/60 text-sm leading-relaxed mb-3">{description}</p>

        {(isOpenToAll || hasCertificate || hasPrizes) && (
          <div className="flex flex-wrap gap-1.5">
            {registrationFee && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                {registrationFee === "Free" || registrationFee === "0" ? "No Registration Fee" : `Fee: ${registrationFee}`}
              </span>
            )}
            {hasCertificate && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                🎓 Certificate
              </span>
            )}
            {hasPrizes && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100"
                title={prizeDetails || undefined}
              >
                🏆 Prizes
              </span>
            )}
          </div>
        )}
      </div>
    </TiltCard>
  );
}
