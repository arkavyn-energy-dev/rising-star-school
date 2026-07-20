import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnnouncementBanner from "../components/ui/AnnouncementBanner";
import SectionHeading from "../components/ui/SectionHeading";
import ProgramCard from "../components/ui/ProgramCard";
import StatsCounter from "../components/ui/StatsCounter";
import TestimonialCard from "../components/ui/TestimonialCard";
import NewsletterSection from "../components/ui/NewsletterSection";
import Loader from "../components/ui/Loader";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import TiltCard from "../components/ui/TiltCard";
import GridBackground from "../components/ui/GridBackground";
import FacilitiesSection from "../components/ui/FacilitiesSection";
import SchoolLogo from "../components/ui/SchoolLogo";
import { HeroSkeleton, CardSkeleton, StatsSkeleton } from "../components/ui/SkeletonLoader";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { useAdmissionModal } from "../context/AdmissionModalContext";
import { useFetch } from "../hooks/useFetch";
import { getTestimonials } from "../services/testimonialService";

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function HeroVisual({ settings }) {
  const yearsActive = settings?.establishedYear ? new Date().getFullYear() - settings.establishedYear : 15;

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] mx-auto">
      <div className="absolute -top-8 -right-6 w-56 h-56 sm:w-72 sm:h-72 bg-accent/[0.14] rounded-full blur-[70px]" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="relative"
      >
        <TiltCard className="rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/60 shadow-glass" strength={4}>
          {/* Portrait campus photo (900×1600) — object-contain so full image shows, not cropped */}
          <div className="relative w-full aspect-[9/16] bg-ink/[0.04]">
            <img
              src="/school-images/ecdad21b-0b6a-4838-bd5a-b5a87813f7c4.jpg"
              alt="Rising Star Public School campus"
              width={900}
              height={1600}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-contain object-center"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 glass rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
              <SchoolLogo className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex-shrink-0 shadow-sm" />
              <div className="min-w-0">
                <p className="text-ink font-heading font-semibold text-xs sm:text-sm truncate">
                  {settings?.schoolName || "Rising Star Public School"}
                </p>
                <p className="text-ink/50 text-[10px] sm:text-xs truncate">{settings?.tagline || "Nurturing Minds, Shaping Futures"}</p>
              </div>
            </div>
          </div>
        </TiltCard>

        <motion.div
          className="hidden sm:block absolute -top-4 -left-4 lg:-top-6 lg:-left-8 glass rounded-2xl px-3 py-2 lg:px-4 lg:py-3 shadow-lift"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="font-heading font-extrabold text-lg lg:text-xl text-ink leading-none">CBSE</p>
          <p className="text-ink/45 text-[10px] lg:text-[11px] uppercase tracking-wide mt-0.5">Affiliated</p>
        </motion.div>

        <motion.div
          className="hidden sm:block absolute -bottom-4 -right-3 lg:-bottom-7 lg:-right-6 glass rounded-2xl px-3 py-2 lg:px-4 lg:py-3 shadow-lift"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <p className="font-heading font-extrabold text-lg lg:text-xl text-ink leading-none">{yearsActive}+</p>
          <p className="text-ink/45 text-[10px] lg:text-[11px] uppercase tracking-wide mt-0.5">Years Growing</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function HeroSection({ settings }) {
  const { openAdmissionModal } = useAdmissionModal();

  return (
    <section className="relative bg-paper flex items-center overflow-hidden">
      <GridBackground />

      <div className="container-custom relative z-10 py-12 sm:py-16 lg:py-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
          {/* Image first on phone so it is always visible */}
          <div className="order-1 lg:order-2">
            <HeroVisual settings={settings} />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroStagger}
            className="order-2 lg:order-1 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <motion.div variants={heroItem} className="inline-flex items-center gap-2 border border-accent/25 bg-accent/[0.06] rounded-full px-4 py-1.5 mb-6 lg:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              <span className="text-accent text-sm font-medium">Admissions Open 2026-27</span>
            </motion.div>

            <motion.h1
              variants={heroItem}
              className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] text-ink leading-[1.05] tracking-tight mb-5 lg:mb-7"
            >
              Empowering Young Minds,
              <br />
              <span className="text-gradient">Building Bright Futures</span>
            </motion.h1>

            <motion.p variants={heroItem} className="text-ink/55 text-sm sm:text-base md:text-lg leading-relaxed mb-8 lg:mb-10 max-w-xl mx-auto lg:mx-0">
              {settings?.description}
            </motion.p>

            <motion.div variants={heroItem} className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              <motion.button
                onClick={openAdmissionModal}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary text-sm sm:text-base"
              >
                Apply Now →
              </motion.button>
              <Link to="/about" className="btn-outline text-sm sm:text-base">
                Explore More
              </Link>
            </motion.div>

            {settings?.stats?.length > 0 && (
              <motion.div variants={heroItem} className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 mt-10 lg:mt-12 pt-8 border-t border-ink/10">
                {settings.stats.slice(0, 3).map((stat, i) => (
                  <div key={i}>
                    <p className="font-heading font-extrabold text-2xl text-ink">
                      {stat.value}
                      {stat.suffix}
                    </p>
                    <p className="text-ink/45 text-xs uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { data: testimonials } = useFetch(getTestimonials, []);

  if (settingsLoading) {
    return (
      <>
        <HeroSkeleton />
        <section className="section-padding bg-paper">
          <div className="container-custom">
            <div className="h-8 bg-white/10 rounded w-48 mx-auto mb-12 animate-pulse" />
            <CardSkeleton count={6} />
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom">
            <StatsSkeleton />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <HeroSection settings={settings} />
      <AnnouncementBanner />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            kicker="Academics"
            title="Our Programs"
            subtitle="Comprehensive English-medium education from Nursery to Class 10th designed to bring out the best in every student."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(settings?.programs || []).map((program, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "100px" }}
                transition={{ duration: 0.2 }}
              >
                <ProgramCard {...program} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            kicker="Why Us"
            title="Why Choose Us"
            subtitle={`What makes ${settings?.schoolName || "Rising Star Public School"} the right choice for your child.`}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(settings?.whyChooseUs || []).map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "100px" }}
                transition={{ duration: 0.2 }}
              >
                <TiltCard className="card-outline bg-white p-6 text-center h-full">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-heading font-bold text-ink text-lg mb-2">{item.title}</h3>
                  <p className="text-ink/55 text-sm leading-relaxed">{item.description}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FacilitiesSection />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "100px" }} transition={{ duration: 0.2 }}>
              <div className="relative rounded-3xl overflow-hidden border border-neutral-200 h-[400px]">
                <ImageWithFallback 
                  src={settings?.aboutContent?.principalPhoto} 
                  alt="Principal" 
                  className="absolute inset-0 w-full h-full object-cover"
                  aspectRatio="4/5"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-6">
                  <p className="text-white font-heading font-bold">
                    {settings?.aboutContent?.principalName || "Principal"}
                  </p>
                  <p className="text-accent-glow text-sm">Principal</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "100px" }} transition={{ duration: 0.2 }}>
              <SectionHeading kicker="From the Desk of" title="Principal's Message" center={false} />
              <p className="text-ink/60 leading-relaxed mb-6">{settings?.aboutContent?.principalMessage}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-accent" />
                <p className="text-ink font-heading font-semibold">
                  {settings?.aboutContent?.principalName || "Principal"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <StatsCounter />

      {testimonials?.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeading kicker="Testimonials" title="What Parents Say" subtitle="Hear from the parents of our Rising Star family." />
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t._id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ duration: 0.2 }}
                >
                  <TestimonialCard {...t} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterSection />
    </>
  );
}
