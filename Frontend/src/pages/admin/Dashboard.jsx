import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFaculty } from "../../services/facultyService";
import { getEvents } from "../../services/eventService";
import { getGalleryImages } from "../../services/galleryService";
import { getAdmissionEnquiries } from "../../services/admissionService";
import { getJobApplications } from "../../services/jobApplicationService";
import { getTestAttempts } from "../../services/testAttemptService";
import { getContactMessages } from "../../services/contactService";
import { getSubscribers } from "../../services/newsletterService";
import Loader from "../../components/ui/Loader";

const cards = [
  { key: "faculty", label: "Faculty Members", icon: "👨‍🏫", link: "/admin/faculty" },
  { key: "events", label: "Events", icon: "📅", link: "/admin/events" },
  { key: "gallery", label: "Gallery Photos", icon: "🖼️", link: "/admin/gallery" },
  { key: "admissions", label: "Admission Enquiries", icon: "📝", link: "/admin/admissions" },
  { key: "careers", label: "Teacher Applications", icon: "👩‍🏫", link: "/admin/careers" },
  { key: "testAttempts", label: "Online Test Submissions", icon: "📋", link: "/admin/test-attempts" },
  { key: "messages", label: "Contact Messages", icon: "✉️", link: "/admin/messages" },
  { key: "subscribers", label: "Newsletter Subscribers", icon: "📧", link: "/admin/subscribers" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    Promise.all([
      getFaculty(),
      getEvents(),
      getGalleryImages(),
      getAdmissionEnquiries(),
      getJobApplications(),
      getTestAttempts(),
      getContactMessages(),
      getSubscribers(),
    ])
      .then(([faculty, events, gallery, admissions, careers, testAttempts, messages, subscribers]) => {
        setCounts({
          faculty: faculty.count,
          events: events.count,
          gallery: gallery.count,
          admissions: admissions.count,
          careers: careers.count,
          testAttempts: testAttempts.count,
          messages: messages.count,
          subscribers: subscribers.count,
        });
      })
      .catch((err) => console.error("Failed to load dashboard stats:", err.message));
  }, []);

  if (!counts) return <Loader label="Loading dashboard..." />;

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-primary mb-6">Welcome back 👋</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.key}
            to={card.link}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-heading font-extrabold text-primary">{counts[card.key]}</p>
                <p className="text-gray-500 text-sm mt-1">{card.label}</p>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
