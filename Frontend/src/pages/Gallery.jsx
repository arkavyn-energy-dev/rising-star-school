import SectionHeading from "../components/ui/SectionHeading";
import GalleryGrid from "../components/ui/GalleryGrid";
import CampusGallery from "../components/ui/CampusGallery";
import PageHero from "../components/ui/PageHero";

export default function Gallery() {
  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="A glimpse into life at Rising Star Public School — our campus, events, and everyday moments."
      />

      <CampusGallery />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading kicker="Moments" title="Photo Gallery" subtitle="Explore our campus, classrooms, events, and student activities." />
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
