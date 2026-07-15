import { useFetch } from "../../hooks/useFetch";
import { getAnnouncements } from "../../services/announcementService";

export default function AnnouncementBanner() {
  const { data: announcements } = useFetch(getAnnouncements, []);

  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="bg-white border-y border-neutral-200 text-ink py-2.5 overflow-hidden">
      <div className="animate-scroll-left whitespace-nowrap">
        {announcements.map((item) => (
          <span key={item._id} className="inline-flex items-center mx-8 text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2.5" />
            {item.text}
          </span>
        ))}
        {announcements.map((item) => (
          <span key={`dup-${item._id}`} className="inline-flex items-center mx-8 text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2.5" />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
