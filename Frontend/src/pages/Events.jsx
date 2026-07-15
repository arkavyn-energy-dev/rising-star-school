import { motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import EventCard from "../components/ui/EventCard";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import PageHero from "../components/ui/PageHero";
import { useFetch } from "../hooks/useFetch";
import { getEvents } from "../services/eventService";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function EventGrid({ events }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, i) => (
        <motion.div
          key={event._id}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <EventCard {...event} />
        </motion.div>
      ))}
    </div>
  );
}

export default function Events() {
  const { data: events, loading, error } = useFetch(getEvents, []);

  const upcoming = events?.filter((e) => e.isUpcoming) || [];
  const past = events?.filter((e) => !e.isUpcoming) || [];

  return (
    <>
      <PageHero
        title="Events & Sports"
        subtitle="Celebrating achievements, sportsmanship, and school spirit at Rising Star Public School, Bettiah."
      />

      {loading && <Loader label="Loading events..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <section className="section-padding">
            <div className="container-custom">
              <SectionHeading
                kicker="What's Next"
                title="Upcoming Events"
                subtitle="Open to Rising Star students and students from other schools — free registration, certificates & prizes for participants."
              />
              <div className="card-outline bg-white p-8 text-center max-w-2xl mx-auto mb-8">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-ink/60 leading-relaxed">
                  No upcoming events are scheduled at the moment. New inter-school competitions, sports days, and cultural
                  programs will be announced here and on our admission banner. Stay tuned!
                </p>
              </div>
              {upcoming.length > 0 && <EventGrid events={upcoming} />}
            </div>
          </section>

          <section className="section-padding bg-accent/[0.03]">
            <div className="container-custom">
              <SectionHeading
                kicker="Sports at Rising Star"
                title="Our Sports Programs"
                subtitle="Regular sports activities for holistic development — especially standard-wise events for Nursery to Class 5."
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
                {["Cricket", "Badminton", "Carrom", "Running Races", "Kabaddi", "Team Games & More"].map((sport) => (
                  <div key={sport} className="card-outline bg-white px-5 py-4 flex items-center gap-3">
                    <span className="text-xl">🏅</span>
                    <span className="font-heading font-semibold text-ink text-sm">{sport}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-ink/50 text-sm max-w-2xl mx-auto">
                When we host open events, students from other schools can participate at no registration fee. Winners
                receive certificates and prizes. Details will be shared on this page and via the school office.
              </p>
            </div>
          </section>

          <section className="section-padding">
            <div className="container-custom">
              <SectionHeading kicker="Highlights" title="Past Events" subtitle="A look back at sports days, competitions, and celebrations at our school." />
              {past.length > 0 ? (
                <EventGrid events={past} />
              ) : (
                <p className="text-center text-ink/40">Event history will appear here soon.</p>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
