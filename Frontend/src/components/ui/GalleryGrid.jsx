import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { getGalleryImages } from "../../services/galleryService";
import ImageWithFallback from "./ImageWithFallback";

const categories = ["All", "Campus", "Classroom", "Sports", "Events"];

export default function GalleryGrid() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const { data: images, loading } = useFetch(() => getGalleryImages(active), [active]);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              active === cat
                ? "bg-ink text-white border-ink"
                : "bg-white text-ink/60 border-neutral-200 hover:border-ink/30 hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-400">Loading gallery...</p>}

      {!loading && images?.length === 0 && (
        <p className="text-center text-gray-400 py-10">No photos in this category yet. Check back soon!</p>
      )}

      {!loading && images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={img._id}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group border border-neutral-200"
              onClick={() => setLightbox(i)}
            >
              <ImageWithFallback
                src={img.imageUrl}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-all duration-300 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox !== null && images?.[lightbox] && (
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
            <ImageWithFallback
              src={images[lightbox].imageUrl}
              alt={images[lightbox].alt}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
