import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import FacultyCard from "../components/ui/FacultyCard";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import PageHero from "../components/ui/PageHero";
import FormModal from "../components/ui/FormModal";
import TeacherApplicationForm from "../components/ui/TeacherApplicationForm";
import { useFetch } from "../hooks/useFetch";
import { getFaculty } from "../services/facultyService";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Faculty() {
  const { data: faculty, loading, error } = useFetch(getFaculty, []);
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <PageHero
        title="Our Faculty"
        subtitle="Meet our team of dedicated and experienced educators committed to academic excellence."
      />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading kicker="Our Educators" title="Meet Our Teachers" subtitle="Qualified, passionate, and committed to bringing out the best in every student." />

          {loading && <Loader label="Loading faculty..." />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {faculty.map((member, i) => (
                <motion.div
                  key={member._id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <FacultyCard {...member} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <SectionHeading kicker="Careers" title="Join Our Team" subtitle="We're always looking for passionate educators to join our growing family." />
          <p className="text-ink/60 mb-6">
            If you are a qualified teacher with a passion for education and a commitment to student success, we
            would love to hear from you. Apply below and our HR team will get in touch.
          </p>
          <button onClick={() => setApplyOpen(true)} className="btn-primary inline-block">
            Apply to Teach →
          </button>
        </div>
      </section>

      <FormModal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        badge="We're Hiring"
        title="Apply to Teach"
        subtitle="Tell us about yourself — our HR team will review your profile and reach out soon."
      >
        <TeacherApplicationForm />
      </FormModal>
    </>
  );
}
