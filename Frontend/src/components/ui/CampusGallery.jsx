import { useState } from "react";
import SectionHeading from "./SectionHeading";

// Eagerly imports whatever campus/playground photos have been dropped into
// src/assets/campus/ — no backend or Cloudinary needed for these. Just add
// image files to that folder and they show up here automatically.
const modules = import.meta.glob("../../assets/campus/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}", {
  eager: true,
  import: "default",
});

const toCaption = (path) => {
  const fileName = path.split("/").pop().replace(/\.[^.]+$/, "");
  return fileName
    .replace(/[-_]+/g, " ")
    .replace(/\d+/g, "")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Campus";
};

const photos = Object.entries(modules).map(([path, src]) => ({ src, caption: toCaption(path) }));

export default function CampusGallery() {
  const [lightbox, setLightbox] = useState(null);

  if (photos.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          kicker="Our Campus"
          title="Campus & Playground"
          subtitle="A look at our school building, classrooms, and play areas."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group border border-neutral-200"
              onClick={() => setLightbox(i)}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-all duration-300 flex items-center justify-center">
                <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 text-center">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {lightbox !== null && photos[lightbox] && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl hover:text-accent transition-colors"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            <div className="relative max-w-4xl max-h-[80vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={photos[lightbox].src}
                alt={photos[lightbox].caption}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
