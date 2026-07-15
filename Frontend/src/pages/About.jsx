import { motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import StatsCounter from "../components/ui/StatsCounter";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import Loader from "../components/ui/Loader";
import PageHero from "../components/ui/PageHero";
import TiltCard from "../components/ui/TiltCard";
import { useSiteSettings } from "../context/SiteSettingsContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const { settings, loading } = useSiteSettings();

  if (loading) return <Loader />;

  const about = settings?.aboutContent || {};

  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Learn about our journey, mission, and what makes us a trusted name in education."
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <SectionHeading kicker="Our Journey" title="Our Story" center={false} />
              <p className="text-ink/60 leading-relaxed mb-6">{about.history}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="card-outline p-4 text-center">
                  <p className="text-ink font-heading font-bold text-2xl">{settings?.establishedYear}</p>
                  <p className="text-ink/50 text-sm">Established</p>
                </div>
                <div className="card-outline p-4 text-center">
                  <p className="text-ink font-heading font-bold text-2xl">CBSE</p>
                  <p className="text-ink/50 text-sm">Affiliated</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden border border-neutral-200 h-[350px]">
                <ImageWithFallback src="/school-images/ecdad21b-0b6a-4838-bd5a-b5a87813f7c4.jpg" alt="School Campus" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading kicker="Purpose" title="Mission & Vision" />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <TiltCard className="card-outline bg-white p-8 h-full">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-heading font-bold text-ink text-xl mb-3">Our Mission</h3>
                <p className="text-ink/60 leading-relaxed">{about.mission}</p>
              </TiltCard>
            </motion.div>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <TiltCard className="card-outline bg-white p-8 h-full">
                <div className="text-3xl mb-3">🔭</div>
                <h3 className="font-heading font-bold text-ink text-xl mb-3">Our Vision</h3>
                <p className="text-ink/60 leading-relaxed">{about.vision}</p>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading kicker="What Drives Us" title="Our Core Values" subtitle="The principles that guide everything we do." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(about.values || []).map((value, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <TiltCard className="card-outline bg-white p-6 text-center h-full">
                  <div className="text-3xl mb-3">{value.icon}</div>
                  <h3 className="font-heading font-bold text-ink text-lg mb-2">{value.title}</h3>
                  <p className="text-ink/55 text-sm leading-relaxed">{value.description}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <SectionHeading kicker="Leadership" title="From the Director's Desk" center={false} />
              <p className="text-ink/60 leading-relaxed mb-6">{about.directorMessage}</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-[2px] bg-accent" />
                <div>
                  <p className="text-ink font-heading font-semibold">{about.directorName || "Sonu Mishra"}</p>
                  <p className="text-ink/50 text-sm">Director</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-3xl overflow-hidden border border-neutral-200 h-[350px]">
                <ImageWithFallback src={about.directorPhoto} alt="Director" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-2 lg:order-1">
              <SectionHeading kicker="Leadership" title="From the Principal's Desk" center={false} />
              <p className="text-ink/60 leading-relaxed mb-6">{about.principalMessage}</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-[2px] bg-accent" />
                <div>
                  <p className="text-ink font-heading font-semibold">{about.principalName}</p>
                  <p className="text-ink/50 text-sm">Principal</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="rounded-3xl overflow-hidden border border-neutral-200 h-[400px]">
                <ImageWithFallback src={about.principalPhoto} alt="Principal" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <StatsCounter />
    </>
  );
}
