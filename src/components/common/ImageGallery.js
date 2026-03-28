import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export default function ImageGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[activeIndex] || '';
  const total = images.length;

  const goTo = useCallback(
    (index) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard navigation in lightbox
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    },
    [prev, next]
  );

  if (total === 0) {
    return (
      <div className="aspect-[4/3] bg-surface-100 dark:bg-surface-800 rounded-2xl
                      flex items-center justify-center text-surface-400">
        No images available
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative group aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden
                        bg-surface-100 dark:bg-surface-800 cursor-pointer"
             onClick={() => setLightboxOpen(true)}
        >
          <img
            src={currentImage}
            alt={`Item ${activeIndex + 1} of ${total}`}
            className="w-full h-full object-cover transition-transform duration-500"
          />

          {/* Zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors
                          flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity
                            bg-black/50 text-white px-3 py-1.5 rounded-full text-sm
                            flex items-center gap-1.5 backdrop-blur-sm">
              <ZoomIn className="w-4 h-4" />
              Click to expand
            </span>
          </div>

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full
                           bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm shadow-md
                           opacity-0 group-hover:opacity-100 hover:scale-110
                           active:scale-95 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-surface-700 dark:text-surface-200" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full
                           bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm shadow-md
                           opacity-0 group-hover:opacity-100 hover:scale-110
                           active:scale-95 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-surface-700 dark:text-surface-200" />
              </button>
            </>
          )}

          {/* Image counter */}
          {total > 1 && (
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full
                            bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
              {activeIndex + 1} / {total}
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`gallery-thumb flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 ${
                  i === activeIndex ? 'active' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Mobile swipe hint */}
        {total > 1 && (
          <p className="text-center text-xs text-surface-400 md:hidden">
            Swipe to see more photos
          </p>
        )}
      </div>

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Image lightbox"
          ref={(el) => el?.focus()}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white
                       hover:bg-white/10 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          {total > 1 && (
            <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
              {activeIndex + 1} / {total}
            </span>
          )}

          {/* Main image */}
          <img
            src={currentImage}
            alt={`Item ${activeIndex + 1} of ${total}`}
            className="max-h-[85vh] max-w-[90vw] object-contain select-none"
          />

          {/* Nav arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                           text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                           text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
