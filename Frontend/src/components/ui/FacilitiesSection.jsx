import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import ImageWithFallback from "./ImageWithFallback";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Renders the school's facilities (bus/van service, computer lab, sports,
// etc.) as configured in Site Settings — admin can add/edit/remove entries
// without any code changes.
export default function FacilitiesSection() {
  const { settings } = useSiteSettings();
  const facilities = settings?.facilities || [];

  if (facilities.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          kicker="Our Facilities"
          title="What We Offer"
          subtitle="Facilities designed to support every child's safety, learning, and growth."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard className="card-outline bg-white overflow-hidden h-full">
                {facility.imageUrl ? (
                  <div className="h-40 overflow-hidden">
                    <ImageWithFallback src={facility.imageUrl} alt={facility.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-40 bg-accent/[0.06] flex items-center justify-center text-5xl">{facility.icon}</div>
                )}
                <div className="p-6">
                  <h3 className="font-heading font-bold text-ink text-lg mb-2">{facility.title}</h3>
                  <p className="text-ink/55 text-sm leading-relaxed">{facility.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
