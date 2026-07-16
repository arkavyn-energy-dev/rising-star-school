import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/ui/PageHero";
import SectionHeading from "../components/ui/SectionHeading";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useFetch } from "../hooks/useFetch";
import { getTests } from "../services/testService";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function OnlineTests() {
  const { data: tests, loading, error } = useFetch(getTests, []);

  return (
    <>
      <PageHero
        title="Online Screening Test"
        subtitle="Class-wise MCQ assessments for students applying to Class 5 through Class 10. Fill in your details, attempt the test, and our team will review your submission."
      />

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <SectionHeading
            kicker="Admission Screening"
            title="Choose Your Class Test"
            subtitle="Each test has 30 questions covering Mathematics, Science, and General Knowledge. Results are reviewed by the school administration."
          />

          {loading && <Loader label="Loading available tests..." />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 gap-5">
              {tests?.length === 0 && (
                <p className="text-center text-ink/50 col-span-full py-10">
                  No online tests are available right now. Please contact the school office.
                </p>
              )}
              {tests?.map((test, i) => (
                <motion.div
                  key={test._id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <div className="card-outline bg-white p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-accent text-xs font-semibold uppercase tracking-wide mb-1">{test.className}</p>
                        <h3 className="font-heading font-bold text-ink text-lg">{test.title}</h3>
                      </div>
                      <span className="shrink-0 text-xs bg-accent/10 text-accent font-semibold px-3 py-1 rounded-full">
                        30 MCQs
                      </span>
                    </div>
                    <p className="text-ink/55 text-sm leading-relaxed mb-4 flex-1">{test.description}</p>
                    <p className="text-ink/40 text-xs mb-4">Duration: ~{test.durationMinutes || 45} minutes</p>
                    <Link to={`/online-test/${test._id}`} className="btn-primary text-center text-sm">
                      Start Test →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-10 card-outline bg-accent/[0.04] p-6 text-center">
            <p className="text-ink/60 text-sm leading-relaxed">
              After submission, you will receive a confirmation on screen and via email/WhatsApp (when configured).
              Selected students will be contacted by the school for the next admission steps.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
