import { motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import Loader from "../components/ui/Loader";
import PageHero from "../components/ui/PageHero";
import TiltCard from "../components/ui/TiltCard";
import { CardSkeleton, TextSkeleton } from "../components/ui/SkeletonLoader";
import { useSiteSettings } from "../context/SiteSettingsContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function Academics() {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <>
        <div className="h-64 bg-ink-soft/20 animate-pulse" />
        <section className="section-padding">
          <div className="container-custom space-y-12">
            <TextSkeleton lines={4} />
            <CardSkeleton count={4} />
          </div>
        </section>
      </>
    );
  }

  const academics = settings?.academics || {};
  const programs = settings?.programs || [];

  return (
    <>
      <PageHero
        title="Academics"
        subtitle="A comprehensive curriculum designed to nurture curiosity, build skills, and achieve excellence."
      />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            kicker="Curriculum"
            title="Our Curriculum"
            subtitle="From Nursery to Class 10th — a structured English-medium learning path for every stage of growth."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
              >
                <TiltCard className="card-outline bg-white overflow-hidden h-full">
                  <div className="relative h-44">
                    <ImageWithFallback src={program.imageUrl} alt={program.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ink text-xs font-bold px-3 py-1 rounded-full">
                      {program.grades}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-ink text-lg mb-2">{program.title}</h3>
                    <p className="text-ink/55 text-sm leading-relaxed">{program.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            kicker="Beyond Academics"
            title="Subjects & Activities"
            subtitle="Core curriculum plus co-curricular programs for Classes Nursery to 10."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {(academics.streams || []).map((stream, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
              >
                <TiltCard className="card-outline bg-white p-6 text-center h-full">
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-accent text-2xl font-bold font-heading">{stream.name[0]}</span>
                  </div>
                  <h3 className="font-heading font-bold text-ink text-xl mb-3">{stream.name}</h3>
                  <p className="text-ink/55 text-sm leading-relaxed">{stream.subjects}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading kicker="Approach" title="Our Teaching Methodology" subtitle="Modern approaches that make learning engaging and effective." />
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {(academics.methodology || []).map((method, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
              >
                <TiltCard className="flex gap-4 card-outline bg-white p-6 h-full">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold font-heading">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-ink text-base mb-1">{method.title}</h3>
                    <p className="text-ink/55 text-sm leading-relaxed">{method.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

