import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import Loader from "../components/ui/Loader";
import PageHero from "../components/ui/PageHero";
import AdmissionForm from "../components/ui/AdmissionForm";
import { useSiteSettings } from "../context/SiteSettingsContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Admissions() {
  const { settings, loading } = useSiteSettings();

  if (loading) return <Loader />;

  return (
    <>
      <PageHero
        title="Admissions"
        subtitle="Join the Rising Star family. Admissions are now open for the 2026-27 academic session."
      />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading kicker="How It Works" title="Admission Process" subtitle="A simple 4-step process to become a part of our school community." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {(settings?.admissionProcess || []).map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 border border-accent/30 bg-accent/[0.06] text-accent font-heading font-extrabold text-2xl rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-heading font-bold text-ink text-lg mb-2">{step.title}</h3>
                <p className="text-ink/55 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading kicker="Transparent Pricing" title="Fee Structure" subtitle="Transparent and affordable fee structure for all grades." />
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl mx-auto">
            <div className="card-outline bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="px-6 py-4 text-left font-heading font-semibold text-sm">Grade</th>
                      <th className="px-6 py-4 text-left font-heading font-semibold text-sm">Admission Fee</th>
                      <th className="px-6 py-4 text-left font-heading font-semibold text-sm">Tuition Fee</th>
                      <th className="px-6 py-4 text-left font-heading font-semibold text-sm">Annual Charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(settings?.feeStructure || []).map((row, i) => (
                      <tr key={i} className={`border-b border-neutral-100 ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}>
                        <td className="px-6 py-4 font-semibold text-ink text-sm">{row.grade}</td>
                        <td className="px-6 py-4 text-ink/60 text-sm">{row.admission}</td>
                        <td className="px-6 py-4 text-ink/60 text-sm">{row.tuition}</td>
                        <td className="px-6 py-4 text-ink/60 text-sm">{row.annual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-ink/35 text-xs mt-3 text-center">
              * Fees are indicative and subject to change. Contact the school office for exact figures.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-accent/[0.03]">
        <div className="container-custom max-w-4xl text-center">
          <SectionHeading
            kicker="Screening"
            title="Online Test (Class 5 – 10)"
            subtitle="Students applying for Class 5 to Class 10 can take our online MCQ screening test. 30 questions covering Mathematics, Science, and General Knowledge."
          />
          <p className="text-ink/55 text-sm leading-relaxed mb-6 max-w-2xl mx-auto">
            Fill in student details, complete the test, and our team will review your submission. Selected students will
            receive confirmation via email and WhatsApp, followed by a call to visit the school for admission formalities.
          </p>
          <Link to="/online-test" className="btn-primary inline-block">
            View Class-wise Tests →
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionHeading kicker="Checklist" title="Documents Required" center={false} />
              <ul className="space-y-3">
                {(settings?.documentsRequired || []).map((doc, i) => (
                  <motion.li
                    key={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex items-center gap-3 text-ink/70"
                  >
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">{doc}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading kicker="Get Started" title="Enquiry Form" center={false} />
              <div className="card-outline bg-white p-6">
                <AdmissionForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
